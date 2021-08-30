import { Widget } from '@lumino/widgets';
import { ISignal, Signal } from '@lumino/signaling';

export interface IProgramInfo {
  filename: string;
  type: string
}

const BUTTON_WIDGET_CLASS = 'program-button';

export class ButtonWidget extends Widget {
  constructor(options = { node: document.createElement('button') }) {
    super(options);

    this.node.textContent = 'Start Program';

    /**
     * The class name, jp-ButtonWidget, follows the CSS class naming
     * convention for classes that extend lumino.Widget.
     */
    this.addClass(BUTTON_WIDGET_CLASS);

    this.node.addEventListener('click', () => {
      this._stateChanged.emit(this._info);
    });
  }

  private _info: IProgramInfo = {
    filename: "",
	type: ""
  };

  private _stateChanged = new Signal<ButtonWidget, IProgramInfo>(this);

  public get stateChanged(): ISignal<ButtonWidget, IProgramInfo> {
    return this._stateChanged;
  }
}
