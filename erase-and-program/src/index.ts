import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { TabPanelUiWidget } from './widget'

import { extensionProgramIcon } from './icons';


/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'webds:erase-and-program';
}
	
/**
 * Initialization data for the @webds/erase_and_program extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@webds/erase_and_program:plugin',
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
	restorer: ILayoutRestorer
  ) => {
    console.log('JupyterLab extension @webds/erase_and_program is activated!');

    let widget: MainAreaWidget;
	const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'WebDS';

    const extension_string = 'Erase and Program';
	
    commands.addCommand(command, {
      label: extension_string,
      caption: extension_string,
	  icon: extensionProgramIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new TabPanelUiWidget();

          widget = new MainAreaWidget<TabPanelUiWidget>({ content });
          widget.id = 'erase_and_program';
          widget.title.label = extension_string;
          widget.title.closable = true;
          widget.title.icon = extensionProgramIcon;
        }

        if (!tracker.has(widget))
          tracker.add(widget);

        if (!widget.isAttached)
          shell.add(widget, 'main');

        shell.activateById(widget.id);
      }
    });

    // Add launcher
    launcher.add({
      command: command,
      category: category
    });

    let tracker = new WidgetTracker<MainAreaWidget>({ namespace: 'webds' });
    restorer.restore(tracker, { command, name: () => 'webds' });

  }
};


export default extension;
