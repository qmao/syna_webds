import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

import { ICommandPalette, Dialog } from '@jupyterlab/apputils';

import { StackedPanel, StackedLayout, BoxPanel, Panel } from '@lumino/widgets';

import { ILauncher } from '@jupyterlab/launcher';


import {
  IDocumentManager,
} from '@jupyterlab/docmanager';


import { TabPanelUiWidget } from './widget'

import { ButtonUiWidget, IProgramInfo } from './button_ui'

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
  optional: [ILauncher, IDocumentManager],
  requires: [ICommandPalette],
  activate: async (app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null,
	docManager: IDocumentManager,
	) => {
    console.log('JupyterLab extension @webds/erase_and_program is activated!');


	const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'WebDS';

	let dock: BoxPanel;
	
    commands.addCommand(command, {
      label: 'Erase and Program',
      caption: 'Erase and Program',
      execute: async () => {


		let url = "https://get.geojs.io/v1/ip/geo.json";
		download_cache(url);

		

		/*
		const dialog = FileDialog.getOpenFiles({
		  manager: docManager, // IDocumentManager
		  filter: model => model.type == 'notebook' // optional (model: Contents.IModel) => boolean
		});

		const result = await dialog;

		if (result.button.accept){
		  let files = result.value;
		  console.log(files);
		}
		*/
		
		
		dock = new BoxPanel({direction: 'top-to-bottom', alignment:'center' });
		dock.id = 'dock';
		
		//qmao
		let tabpanel_all = new TabPanelUiWidget();
		dock.addWidget(tabpanel_all);
		
		let button_program = new ButtonUiWidget( {title: 'Program'} );
		button_program.stateChanged.connect(logMessage, this);
		let panel_start = new Panel();	
		panel_start.addClass('start-panel');
		panel_start.addWidget(button_program);
		dock.addWidget(panel_start);

		let main_layout = new StackedLayout({fitPolicy: 'set-no-constraint'});
		const main_widget = new StackedPanel({layout: main_layout});
		main_widget.id = 'erase_and_program';
		main_widget.title.label = 'Program';
		main_widget.title.closable = true;
		main_widget.addClass('main-widget');

		main_widget.addWidget(dock);

		
		shell.add(main_widget, 'main');

		requestAPI<any>('start_program')
          .then(data => {
          console.log(data);

        })
        .catch(reason => {
          console.error(
            `The erase-and-program server extension appears to be missing.\n${reason}`
          );
        });
      }
    });

	palette.addItem({ command, category: category });

    if (launcher) {
      // Add launcher
      launcher.add({
        command: command,
        category: category
      });
    }
	
	function logMessage(emitter: ButtonUiWidget, info: IProgramInfo): void {
      console.log(emitter);

      startProgram("PR1234567", "packrat");
    }
  }
};


async function startProgram(file_name: string, file_type: string): Promise<string> {
	 // POST request
    const dataToSend = { filename: file_name, type: file_type };
    try {
      const reply = await requestAPI<any>('start_program', {
        body: JSON.stringify(dataToSend),
        method: 'POST',
      });
      console.log(reply);
	  let reply_str = JSON.stringify(reply);
	  
	  let dialog = new Dialog({
        title: reply_str,
        focusNodeSelector: 'input',
        buttons: [Dialog.okButton({ label: 'TBC' })]
      });

    await dialog.launch();
	
	  
    } catch (reason) {
      console.error(
        `Error on POST ${dataToSend}.\n${reason}`
      );
    }

	return Promise.resolve("done");
}

/*
function download(url: string, filename: string) {
  fetch(url).then(function(t) {
    return t.blob().then((b)=> {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.setAttribute("download", filename);
      a.click();
    });
  });
}
*/

/*
??????
function download_cache(url: string) {

  console.log("download url:", url);
  fetch(url)
  .then(res => {
    new Promise((resolve, reject) => {
        //let dest = fs.createWritabpanel_allream('filename.mp3');
        //res.body.pipe(dest);
        //res.body.on('end', () => resolve());
        //dest.on('error', reject);

		//res.body.pipe(process.stdout);
		//res.body.on('end', function() {
		//	console.log('finished');
		//});


		process.stdout.write(res);
    })
  });
}

function blobToFile(theBlob: Blob, fileName:string): File {
    var b: any = theBlob;
    //A Blob() is almost a File()
	//	it's just missing the two properties below which we will add

    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
}
*/

async function download_cache(url: string) {
	//let blob = await fetch(url).then(r => r.blob());
	//let myFile = blobToFile(blob, "tabpanel_all.txt");
	
	let file = await fetch(url)
	.then(r => r.blob())
	.then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }));

	console.log(file);
}


/*
function download_cache(url: string) {
  console.log("download url:", url);
  fetch(url).then(function(t) {
      return t.blob().then((b)=> {
        console.log("download size:", b.size);
        console.log("download content:", b.text.toString);
        console.log(b);
        var objectURL = URL.createObjectURL(b);
        alert(objectURL);
      });
    })
    .catch(rejected => {
        alert(rejected);
    });
}
*/

/*
class ContentWidget extends Widget {

  static createNode(): HTMLElement {
    let node = document.createElement('div');
    let content = document.createElement('div');
	let message = document.createTextNode("Select Hex File");

	content.appendChild(message);
    node.appendChild(content);
    return node;
  }

  constructor(name: string) {
    super({ node: ContentWidget.createNode() });
    this.setFlag(Widget.Flag.DisallowLayout);
    this.addClass('content');
    this.addClass(name.toLowerCase());
    this.title.label = name;
    this.title.closable = true;
    this.title.caption = `Long description for: ${name}`;
  }
}


class PackratWidget extends Widget {

  static createNode(): HTMLElement {
    let node = document.createElement('div');
    let content = document.createElement('div');
    let input = document.createElement('input');
    input.placeholder = '3382123';
	let message = document.createTextNode("Packrat");

	content.appendChild(message);
	content.innerHTML += ' ';
	content.appendChild(input);
    node.appendChild(content);
    return node;
  }

  constructor(name: string) {
    super({ node: PackratWidget.createNode() });
    this.setFlag(Widget.Flag.DisallowLayout);
    this.addClass('packrat-input');
    this.title.label = name;
    this.title.closable = true;
    this.title.caption = `Long description for: ${name}`;
  }
}

class CacheWidget extends Widget {

  static createNode(): HTMLElement {
  
	let select = document.createElement('select');
	select.className = "select-cache";

	// Use createElement to add an option:
	select.appendChild(new Option("PR3833122", "3833122"));
	select.appendChild(new Option("PR3833123", "3833123"));
	select.appendChild(new Option("PR3833125", "3833125"));

    return select;
  }

  constructor(name: string) {
    super({ node: CacheWidget.createNode() });
    this.setFlag(Widget.Flag.DisallowLayout);
    this.addClass('cache-select');
    this.title.label = name;
    this.title.closable = true;
    this.title.caption = `Long description for: ${name}`;
  }
}
*/

export default extension;
