import { ReactWidget } from '@jupyterlab/apputils';

import React from 'react';
import Button from '@material-ui/core/Button';

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
}

function ButtonUi(props: ButtonProps) {
  const { children, value, index, title, ...other } = props;

  return (
    <div {...other}>
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
  
  /**
   * Constructs a new CounterWidget.
   */
  constructor( attributes: ButtonProps = {} ) {
    super();
    this.addClass('jp-ReactWidget');
	
	this.node.addEventListener('click', () => {
      this._stateChanged.emit(this._info);
    });
	
	this._title = attributes.title;
  }

  private _info: IProgramInfo = {
    filename: "",
	type: ""
  };

  render(): JSX.Element {
    return <ButtonUi title={this._title}/>;
  }
  
  private _stateChanged = new Signal<ButtonUiWidget, IProgramInfo>(this);

  public get stateChanged(): ISignal<ButtonUiWidget, IProgramInfo> {
    return this._stateChanged;
  }
  
  private _title = '';
}
