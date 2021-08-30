import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

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
    start?: any;
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

function ButtonUi(props: ButtonProps) {
    const { children, value, index, title, start, ...other } = props;

    const classes = useStyles();

    useEffect(() => {
        console.log("props.start");
    }, [props.start]);

    return (
        <div {...other}>
            <div className={classes.progress_program}>
                { start && <LinearProgress /> }
            </div>
            <Button variant="outlined" color="primary" href="#outlined-buttons">
	            {title}
            </Button>
        </div>
    );
}

 
/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class ButtonUiWidget extends ReactWidget {
    state = {
        _start: 0,
        _title: ""
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
        return < ButtonUi title={this.state._title} start={this.state._start} />;
    }

    private _stateChanged = new Signal<ButtonUiWidget, IProgramInfo>(this);

    public get stateChanged(): ISignal<ButtonUiWidget, IProgramInfo> {
       return this._stateChanged;
    }

    public set setStart(value: number) {
        this.state._start = value;
        this.update();
    }
}
