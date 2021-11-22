import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { TestList } from './testlist'

import { StackedPanel } from '@lumino/widgets';

import { extensionTestIcon } from './icons';

namespace CommandIDs {
  export const get = 'webds:unit-test';
}

/**
 * Initialization data for the @webds/webds-unit-test extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@webds/unit-test:plugin',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: (
	app: JupyterFrontEnd,
	palette: ICommandPalette,
	launcher: ILauncher | null,
  ) => {
    console.log('JupyterLab extension @webds/webds-unit-test is activated!');

	const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'WebDS';

    const extension_string = 'Unit Test';
	
    commands.addCommand(command, {
      label: extension_string,
      caption: extension_string,
	  icon: extensionTestIcon,
      execute: () => {

		let list = new TestList();

		const main_widget = new StackedPanel();
		main_widget.addWidget(list);
		main_widget.id = 'unit_test';
		main_widget.title.label = extension_string;
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

export default plugin;
