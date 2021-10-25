import React, { useState, useContext } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(webdsTheme =>
    createStyles({
        programRoot: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        extendedIcon: {
            marginRight: webdsTheme.spacing(1),
        },
    }),
);

export default function ButtonProgram(props: ButtonProps) {
    const { children, value, index, title, alert, ...other } = props;
    const [progress, setProgress] = useState(false);
    const [message, setMessage] = useState("");
    const [isAlert, setAlert] = useState(false);
    const [disable, setDisable] = useState(false);
    const [severity, setSeverity] = useState<'error' | 'info' | 'success' | 'warning'>('info');
    const [result, setResult] = useState("");

    const context = useContext(UserContext);
    const classes = useStyles();



    const setProgramStatus = (start: boolean, status?: boolean, result?: string) => {
        setDisable(start);
        setProgress(start);
        console.log(progress);
        if (start) {
            setAlert(false);
        }
        else {
            console.log(result);
            show_result(status!, result || '');
        }
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

        } catch (e) {
            console.error(
                `Error on POST ${dataToSend}.\n${e}`
            );
            return Promise.reject((e as Error).message);
        }
        return Promise.resolve(reply_str);
    }

    return (
        <div className={classes.programRoot} {...other}>

            <Box sx={{ m: 1, position: 'relative' }}>
                <Fab variant="extended" color="primary" disabled={disable} onClick={onClick}>
                    <FlashOnIcon className={classes.extendedIcon} />
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


