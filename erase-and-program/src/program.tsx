import React, { useState, useContext, useEffect } from 'react';
import { requestAPI } from './handler';
import { UserContext } from './context';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import Fab from '@mui/material/Fab';

import DownloadBlob, { BlobFile } from './packrat/packrat'

export interface IProgramInfo {
    filename: string;
    type: string
}

interface ButtonProps {
    children?: React.ReactNode;
    index?: any;
    value?: any;
    title?: any;
    alert?: any;
    onClick?: any;
    onFinish?: any;
    error: any;
}

declare global {
    var source: EventSource;
}

export default function ButtonProgram(props: ButtonProps) {
    const { children, value, index, title, alert, error,...other } = props;
    const [message, setMessage] = useState("");
    const [isAlert, setAlert] = useState(false);
    const [disable, setDisable] = useState(false);
    const [severity, setSeverity] = useState<'error' | 'info' | 'success' | 'warning'>('info');
    const [result, setResult] = useState("");
    const [progress, setProgress] = React.useState(0);
    const [buffer, setBuffer] = React.useState(0);
    const [isStart, setStart] = React.useState(false);

    const context = useContext(UserContext);

    interface ProgramResponse {
        status: string;
        message: string;
    }

    const eventHandler = (event: any) => {
        let obj = JSON.parse(event.data);
        //console.log(obj)

        if (obj.progress) {
            setProgress(obj.progress);
        }
        if (obj.status && obj.message) {
            setProgramStatus(false, obj.status == 'success', JSON.stringify(obj.message));
        }
    }

    const go = (file: string) => {
        setProgramStatus(true);
        globalThis.source = new window.EventSource('/webds/reprogram');
        console.log(globalThis.source);
        if (globalThis.source != null) {
            globalThis.source.addEventListener('reprogram', eventHandler, false);
        }
        else {
            console.log("event source is null");
        }
        start_program(file)
            .then(res => {
                setProgramStatus(true);
            })
            .catch((error) => {
                console.log(error, 'Promise error');
                setProgramStatus(false, false, error);
         })
    }

    useEffect(() => {
        let file: string;

        if (isStart) {
            if (context.index == 1) {
                console.log("download hex from packrat server");
                file = context.packratnumber;
                start_fetch(file).then(res => {
                    go(file);
                })
                .catch((error) => {
                    console.log(error, 'Promise error');
                    setProgramStatus(false, false, error);
                })
            }
            else {
                file = context.packrat;
                if (file == "") {
                    setProgramStatus(false, false, "Please choose a HEX file");
                }
                go(file);
            }
        }
    }, [isStart]);

    const setProgramStatus = (start: boolean, status?: boolean, result?: string) => {
        if (start) {
            setAlert(false);
        }
        else {
            console.log(result);
            show_result(status!, result || '');
            setStart(false);
            console.log(globalThis.source)
            if (globalThis.source != undefined && globalThis.source.addEventListener != null) {
                globalThis.source.removeEventListener('reprogram', eventHandler, false);
                globalThis.source.close();
                console.log("close event source");
            }
        }

        setBuffer(0);
        setProgress(0);
        setDisable(start);
    }

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
    };

    const show_result = (pass: boolean, message: string) => {
        console.log("pass:", pass);
        if (pass) {
            setSeverity('success');
            setResult("Success");
        }
        else {
            setSeverity('error');
            setResult("Error");
        }
        setMessage(message);
        setAlert(true);

        console.log(pass);
    }

    const start_program = async (file_name: string): Promise<ProgramResponse | undefined> => {
        const action = "start";
        const dataToSend = {
            filename: file_name,
            action: action
        };

        console.log("filename:", file_name);

        try {
            const reply = await requestAPI<any>('reprogram', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);
            return Promise.resolve(reply);
        } catch (e) {
            console.error(
                `Error on POST ${dataToSend}.\n${e}`
            );
            return Promise.reject((e as Error).message);
        }
    }

    const start_fetch = async (packrat: string): Promise<string | undefined> => {
        const formData = new FormData();

        try {
            console.log(packrat);

            let blob: BlobFile | undefined = DownloadBlob(packrat, "hex");

            console.log(blob);
            formData.append("blob", blob!.content, blob!.name);
        } catch (e) {
            return Promise.reject((e as Error).message);
        }

        try {
            const reply = await requestAPI<any>('packrat', {
                body: formData,
                method: 'POST',
            });

            console.log(reply);

            return Promise.resolve(reply);
        } catch (e) {
            return Promise.reject((e as Error).message);
        }
    }

    return (
        <div {...other}>
            <Box sx={{ width: '100%', maxWidth: 490 }}>
                {disable && (
                    <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
                )}
            </Box>
            <Box sx={{
                m: 1, display: 'flex',
                flexDirection: 'row-reverse'
                    }}
            >
                <Fab variant="extended" color="primary" disabled={disable || error} onClick={() => setStart(true)} sx={{ maxWidth: 145, mr: 12 }}>
                    <FlashOnIcon sx={{ mr: 1 }} />
                    {title}
                </Fab>

                {disable && (
                    <CircularProgress
                        size={36}
                        sx={{
                            color: "primary",
                            position: 'absolute',
                            mr: '190px',
                            marginTop: '6px',
                        }}
                    />
                )}
            </Box>

            <Snackbar open={isAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
                <Alert severity={severity} onClose={handleClose}>
                    <AlertTitle> {result} </AlertTitle>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}


