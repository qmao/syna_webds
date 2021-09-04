import { ReactWidget } from '@jupyterlab/apputils';

import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { ISignal, Signal } from '@lumino/signaling';

export interface IProgramInfo {
  filename: string;
  type: string
}

interface ButtonProps {
    children?: React.ReactNode;
    index?: any;
    value?: any;
    title?: any;
    progress?: any;
    alert?: any;
    severity?: any;
    message?: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        progress_program: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }),
);

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ButtonUi(props: ButtonProps) {
    const { children, value, index, title, progress, alert, ...other } = props;
    const [ isAlert, setAlert ] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        console.log("props.start");
        setAlert(alert);
    }, [props.progress]);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
    };

    return (
        <div {...other}>
            <div className={classes.progress_program}>
                { progress && <LinearProgress /> }
            </div>
            <Button variant="outlined" color="primary" href="#outlined-buttons">
	            {title}
            </Button>
            <Snackbar open={isAlert} autoHideDuration={3000} onClose={handleClose} >
                <Alert severity={props.severity}>
                    { props.message }
                </Alert>
            </Snackbar>
        </div>
    );
}

 
/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class ButtonUiWidget extends ReactWidget {
    state = {
        _progress: false,
        _title: "",
        _alert: false,
        _severity: "",
        _message: ""
    }
    /**
    * Constructs a new CounterWidget.
    */
    constructor(attributes: ButtonProps = {}) {
        super();
        this.addClass('jp-ReactWidget');

        this.node.addEventListener('click', () => {
            this._stateChanged.emit(this._info);
        });
        this.state._title = attributes.title;
    }

    private _info: IProgramInfo = {
        filename: "",
        type: ""
    };

    render(): JSX.Element {
        return < ButtonUi title={this.state._title} progress={this.state._progress} alert={this.state._alert}
            severity={this.state._severity} message={this.state._message}
        />;
    }

    private _stateChanged = new Signal<ButtonUiWidget, IProgramInfo>(this);

    public get stateChanged(): ISignal<ButtonUiWidget, IProgramInfo> {
       return this._stateChanged;
    }

    //fixme should use signal instead
    public setStart() {
        this.state._alert = false;
        this.state._progress = true;
        this.update();
    }

    public setStop(severity: string, message: string) {
        this.state._alert = true;
        this.state._progress = false;
        this.state._severity = severity;
        this.state._message = message;
        this.update();
    }
}
