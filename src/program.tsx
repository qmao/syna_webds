import React, { useState, useContext } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';
import { requestAPI } from './handler';
import { UserContext } from './context';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';

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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        progress_program: {
            width: '100%',
            '& > * + *': {
                margin: theme.spacing(2),
            },
            left: theme.spacing(50),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        program: {
            left: theme.spacing(20),
            margin: theme.spacing(1),
        }
    }),
);

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ButtonProgram(props: ButtonProps) {
    const { children, value, index, title, alert, ...other } = props;
    const [isAlert, setAlert] = useState(false);
    const [progress, setProgress] = useState(false);
    const [message, setMessage] = useState("");
    const [disable, setDisable] = useState(false);
    const [severity, setSeverity] = useState<'error' | 'info' | 'success' | 'warning'>('info');
    const [result, setResult] = useState("");

    const context = useContext(UserContext);
    const classes = useStyles();

    const setProgramStatus = (start: boolean, status?: boolean, result?: string) => {
        setDisable(start);
        setProgress(start);

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
        const dataToSend = { filename: file_name, type: file_type };

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
        <div className={classes.progress_program} {...other}>
            { progress && <LinearProgress /> }
            <Fab variant="extended" color="primary" onClick={onClick} disabled={disable} className={classes.program}>
                <NavigationIcon className={classes.extendedIcon} />
                {title}
            </Fab>
            <Snackbar open={isAlert} /*autoHideDuration={3000} onClose={handleClose}*/ >
                <Alert severity={severity} onClose={handleClose}>
                    <AlertTitle> {result} </AlertTitle>
                    { message }
                </Alert>
            </Snackbar>
        </div>
    );
}


