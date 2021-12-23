import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { MainWidget } from './widget';

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

	globalThis.max = -1000;
	globalThis.min = 1000;

	for(let i = 0; i < details.length; i++){
		// get the length of the inner array elements
		let innerArrayLength = details[i].length;
		
		// looping inner array elements
		for(let j = 0; j < innerArrayLength; j++) {
			//console.log(details[i][j]);
			let dataPoint = {
			  x: j*10,
			  y: i*10,
			  value: details[i][j],
			};
			dataPoints.push(dataPoint);
			if (dataPoint.value > globalThis.max)
				globalThis.max = dataPoint.value;
			if (dataPoint.value < globalThis.min)
				globalThis.min = dataPoint.value;
		}
	}
	//console.log(dataPoints);

	return dataPoints;
}

declare global {
    var source: EventSource;
	var heatMap: HeatMap;

	var p1FrameCount: number;
    var p1T0: number;
    var p1T1: number;
	var event_data: number[][];

	var max: number;
	var min: number;
}

const eventHandler = (event: any) => {
	let report = JSON.parse(event.data);

	globalThis.event_data = report.image;
}

function prepare() {
	set_report([17], [18]);
	
	globalThis.heatMap = new HeatMap({
	  container: document.getElementById('mybox')!,
	  maxOpacity: .3,
	  radius: 15,
	  blur: 0.8,
	})
	
	//let canvas: HTMLElement = document.getElementById('mybox')!.children[0];
	let e = document.getElementById('mybox');

	console.log(e!.firstChild!.nodeName);
	let test = e!.firstElementChild! as HTMLElement; 
	console.log(test!.offsetTop);
	
	test!.style.left = "10px";
	test!.style.top = "10px";
	test!.style.position = "absolute";
	test!.style.margin = 'auto';
	

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

	globalThis.p1T0 = Date.now();
	globalThis.event_data = [[]];

	requestAnimationFrame(update);
	/* debug
	let data = [[100, 20, 40, 80,  0,  0,  0,  0, 0,   100],
				[ 11, 22, 33, 44, 55, 66,  0,  1, 10,  100],
				[ 1 ,  2,  3,  4,  5,  6, 20,  0,  0,  100],
				[ 11, 22, 33, 44, 55, 66,  0,100,  0,  100],
				[  1,  2, 30,  0,  0,  0,  1,  4,  5,  50],
				[  0,  1, 20, 10, 11, 22, 33, 44, 55, 99]];
	update(data);
	*/
}

function update() {
	if (globalThis.event_data == [[]])
		requestAnimationFrame(update);

	let data = globalThis.event_data;
	let points = matrixIndexed(data);
	//console.log(points);

	globalThis.heatMap.setData({
	  max: globalThis.max,
	  min: globalThis.min,
	  data: points
	})

	globalThis.p1FrameCount++;
    globalThis.p1T1 = Date.now();
    if (globalThis.p1T1 - globalThis.p1T0 >= 1000) {
        globalThis.p1T0 = globalThis.p1T1;
        console.log(`Lorenz attractor FPS = ${globalThis.p1FrameCount}`);
        globalThis.p1FrameCount = 0;

		console.log(data);
		console.log(`max=${globalThis.max}, min=${globalThis.min}`);
    }
	requestAnimationFrame(update);
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

          widget = new MainAreaWidget<MainWidget>({ content });
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