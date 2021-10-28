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
}


export default function ButtonProgram(props: ButtonProps) {
    const { children, value, index, title, alert, ...other } = props;
    const [message, setMessage] = useState("");
    const [isAlert, setAlert] = useState(false);
    const [disable, setDisable] = useState(false);
    const [severity, setSeverity] = useState<'error' | 'info' | 'success' | 'warning'>('info');
    const [result, setResult] = useState("");
    const [progress, setProgress] = React.useState(0);
    const [buffer, setBuffer] = React.useState(0);

    const context = useContext(UserContext);

    useEffect(() => {
        console.log("buffer:", buffer);
        console.log("progress:", progress);
    }, [progress, buffer]);

    const setProgramStatus = (start: boolean, status?: boolean, result?: string) => {

        if (start) {
            setAlert(false);
        }
        else {
            console.log(result);
            show_result(status!, result || '');
        }

        setBuffer(0);
        setProgress(0);

        setDisable(start);
    }

    const onClick = (event?: React.SyntheticEvent, reason?: string) => {
        console.log("context packrat", context.packrat);

        setProgramStatus(true);

        if (context.packrat == "") {
            setProgramStatus(false, false, "Please choose a HEX file");
        } else {
            start_program()
                .then(res => {
                    console.log(res);
                    setProgramStatus(false, true, res);
                })
                .catch((error) => {
                    console.log(error, 'Promise error');
                    setProgramStatus(false, false, error);
                })
        }
    };

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

    interface ProgressResponse {
        status: string;
        progress: number;
        message: string;
    }

    const start_program = async (): Promise<string | undefined> => {
        let reply_str = "";
        const file_type = "hex";
        const file_name = context.packrat;
        const action = "start";
        const dataToSend = {
            filename: file_name,
            type: file_type,
            action: action
        };

        console.log("filename:", file_name);

        try {
            const reply = await requestAPI<any>('program', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);

            let post_progress = 0;
            for (var i = 0; i < 100; i++) {
                setBuffer(post_progress + 3);
                let res = await get_progress()
                let obj: ProgressResponse = JSON.parse(res!);
                setProgress(obj.progress);
                post_progress = obj.progress;

                await new Promise(f => setTimeout(f, 500));
                let message = obj.message;
                if (obj.status != "running") {
                    if (obj.progress != 100)
                        return Promise.reject(message);
                    else
                        return Promise.resolve(message);
                }
            }
        } catch (e) {
            console.error(
                `Error on POST ${dataToSend}.\n${e}`
            );
            return Promise.reject((e as Error).message);
        }
        return Promise.resolve(reply_str);
    }

    const get_progress = async (): Promise<string | undefined> => {
        let reply_str = "";
        const action = "request";
        const data = "progress"

        const dataToSend = {
            action: action,
            data: data
        };

        console.log("request progress");

        try {
            const reply = await requestAPI<any>('program', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);
            reply_str = JSON.stringify(reply);
        } catch (e) {
            console.error(
                `Error on POST ${dataToSend}.\n${e}`
            );
            return Promise.reject((e as Error).message);
        }
        return Promise.resolve(reply_str);
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
                <Fab variant="extended" color="primary" disabled={disable} onClick={onClick} sx={{ maxWidth: 145, mr: 12 }}>
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


