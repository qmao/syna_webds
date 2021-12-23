import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { Widget } from '@lumino/widgets';

import { requestAPI } from './handler';

import { launcherIcon } from './icons';

import HeatMap from 'heatmap-ts'

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'webds:image-heatmap';
}


const set_report = async (disable: number[], enable: number[]): Promise<string | undefined> => {
	const dataToSend = {
		enable: enable,
		disable: disable
	};
	console.log(dataToSend);
	try {
		const reply = await requestAPI<any>('report', {
			body: JSON.stringify(dataToSend),
			method: 'POST',
		});

		console.log(reply);
		return Promise.resolve("ok");
	} catch (error) {
		console.log(error);
		console.log(error.message);
		return Promise.reject(error.message);
	}
}

function matrixIndexed(details: number[][]) {
	let dataPoints = [];
	for(let i = 0; i < details.length; i++){
		// get the length of the inner array elements
		let innerArrayLength = details[i].length;
		
		// looping inner array elements
		for(let j = 0; j < innerArrayLength; j++) {
			//console.log(details[i][j]);
			let dataPoint = {
			  x: i,
			  y: j,
			  value: details[i][j],
			};
			dataPoints.push(dataPoint);
			//console.log(dataPoints);
		}
	}
	return dataPoints;
}

declare global {
    var source: EventSource;
	var heatMap: HeatMap;
}

const eventHandler = (event: any) => {
	let report = JSON.parse(event.data);
	console.log(report)
	console.log(report.image);
	
	update(report.image);
}

function prepare() {
	set_report([17], [18]);
	
	globalThis.heatMap = new HeatMap({
	  container: document.getElementById('image_heatmap')!,
	  maxOpacity: .6,
	  radius: 10,
	  blur: 0.75,
	})
	
	console.log(globalThis.heatMap);

	// set event handler
	globalThis.source = new window.EventSource('/webds/report');
	console.log(globalThis.source);
	if (globalThis.source != null) {
		globalThis.source.addEventListener('report', eventHandler, false);
	}
	else {
		console.log("event source is null");
	}
}

function update(data: number[][]) {

	//let data = [[1,2,3,4,5,6,0,0,0,0],[11,22,33,44,55,66,0,1,10,3],[1,2,3,4,5,6,20,0,0,1],[11,22,33,44,55,66,0,100,0,0],
	//[1,2,30,0,0,0,1,4,5,6],[0,1,20,10,11,22,33,44,55,66]];

	let points = matrixIndexed(data);
	console.log(points);

	globalThis.heatMap.setData({
	  max: 100,
	  min: 1,
	  data: points
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
        }

        if (!tracker.has(widget))
          tracker.add(widget);

        if (!widget.isAttached)
          shell.add(widget, 'main');

        shell.activateById(widget.id);
		
		prepare();
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