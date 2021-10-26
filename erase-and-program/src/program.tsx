import React, { useState, useContext } from 'react';
import { requestAPI } from './handler';
import { UserContext } from './context';
//import webdsTheme from './webdsTheme';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import Box from '@mui/material/Box';
//import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import Fab from '@mui/material/Fab';

import { green } from '@mui/material/colors';



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

        console.log("test filename:", file_name);

        try {
            const reply = await requestAPI<any>('start-program', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);
            reply_str = JSON.stringify(reply);

            for (var i = 0; i < 100; i++) {
                let res = await get_progress()
                setBuffer(progress + 10);
                let obj: ProgressResponse = JSON.parse(res!);
                setProgress(obj.progress);

                await new Promise(f => setTimeout(f, 500));
                if (obj.status != "running") {
                    console.log(obj.status);
                    break;
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
            const reply = await requestAPI<any>('start-program', {
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
            <Box sx={{ width: '100%' }}>
                {disable && (
                    <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
                )}
            </Box>

            <Box sx={{
                m: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Fab variant="extended" color="primary" disabled={disable} onClick={onClick}>
                    <FlashOnIcon />
                    {title}
                </Fab>

                {disable && (
                    <CircularProgress
                        size={24}
                        sx={{
                            color: green[500],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
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


