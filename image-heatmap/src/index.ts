import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { Widget } from '@lumino/widgets';

import { launcherIcon } from './icons';

import HeatMap from 'heatmap-ts'

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'webds:image-heatmap';
}

function update() {
	const heatMap = new HeatMap({
	  container: document.getElementById('image_heatmap')!,
	  maxOpacity: .6,
	  radius: 50,
	  blur: 0.90,
	})

	console.log(heatMap);


	heatMap.setData({
	  max: 100,
	  min: 1,
	  data: [
		{
		  x: 100,
		  y: 100,
		  value: 100,
		  radius: 20
		},
		{
		  x: 200,
		  y: 250,
		  value: 50,
		  radius: 30
		}
	  ]
	})
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
          let content = new Widget();

          widget = new MainAreaWidget<Widget>({ content });
          widget.id = 'image_heatmap';
          widget.title.label = extension_string;
          widget.title.closable = true;
          widget.title.icon = launcherIcon;
		  
		  update();
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


export default extension;