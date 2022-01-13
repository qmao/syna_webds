import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the reprogram extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'reprogram:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension reprogram is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('reprogram settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for reprogram.', reason);
        });
    }
  }
};

export default plugin;
