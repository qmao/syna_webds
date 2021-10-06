import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import {
  IDocumentManager,
} from '@jupyterlab/docmanager';


import { TabPanelUiWidget } from './widget'

import { StackedPanel } from '@lumino/widgets';

import { extensionProgramIcon } from './icons';


/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'webds:erase-and-program';
}

declare const window: Window &
   typeof globalThis & {
     FB: any
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


	
    commands.addCommand(command, {
      label: 'Erase and Program',
      caption: 'Erase and Program',
	  icon: extensionProgramIcon,
      execute: async () => {

		let tabpanel_all = new TabPanelUiWidget();

		const main_widget = new StackedPanel();
		main_widget.addWidget(tabpanel_all);
		main_widget.id = 'erase_and_program';
		main_widget.title.label = 'Program';
		main_widget.title.closable = true;
		main_widget.addClass('main-widget');

		shell.add(main_widget, 'main');
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
  }
};


export default extension;
