import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { MainWidget } from './widget';

import { launcherIcon } from './icons';

import { Message } from '@lumino/messaging';


/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'webds:image-heatmap';
}


/**
 * Initialization data for the @webds/image_heatmap extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@webds/image_heatmap:plugin',
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
	restorer: ILayoutRestorer
  ) => {
    console.log('JupyterLab extension @webds/image_heatmap is activated!');

    let widget: MainAreaWidget;
	const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'WebDS';

    const extension_string = 'Image HeatMap';
	
    commands.addCommand(command, {
      label: extension_string,
      caption: extension_string,
	  icon: launcherIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new MainWidget();
		  content.id = 'heatmap_content';

          widget = new ImageWidget({ content });
          widget.id = 'image_heatmap';
          widget.title.label = extension_string;
          widget.title.closable = true;
          widget.title.icon = launcherIcon;
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

    let tracker = new WidgetTracker<MainAreaWidget>({ namespace: command });
    restorer.restore(tracker, { command, name: () => command });

  }
};

class ImageWidget extends MainAreaWidget<MainWidget> {
  protected onCloseRequest(msg: Message): void {
    console.log("Ready to close!!!")
    super.onCloseRequest(msg);
  }

  protected onAfterShow(msg: Message): void {
    console.log("Ready to show!!!")
    super.onAfterShow(msg);
  }
}

export default extension;