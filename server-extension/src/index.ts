import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { requestAPI } from './handler';

/**
 * Initialization data for the server-extension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'server-extension',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: async (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null
  ) => {
    console.log('JupyterLab extension server-extension is activated!');

    // GET request
    try {
      const data = await requestAPI<any>('general');
      console.log(data);
    } catch (reason) {
      console.error(`Error on GET /webds-api/general.\n${reason}`);
    }

	/*
	// Test Download File
	try {
		console.log("start to fetch");

		var myRequest = new Request('http://pi-syna.local:8889/webds/packrat?packrat-id=3080091&filename=PR3080091.hex');

		fetch(myRequest)
			.then(response => response.blob())
			.then(function (myBlob) {

			  console.log(myBlob);

			  let a = document.createElement('a');
			  document.body.appendChild(a);
			  a.setAttribute('style', 'display: none');

			  let url = window.URL.createObjectURL(myBlob);
			  a.href = url;
			  a.download = "test_blob.txt";
			  a.click();

			  a.href = '';
			  window.URL.revokeObjectURL(url);

			});
		console.log("done!!!");

	} catch (e) {
		console.log(e);
    }
    */
  },
};

export default extension;

