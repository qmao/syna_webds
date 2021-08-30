import { ReactWidget } from '@jupyterlab/apputils';

import Checkbox from '@material-ui/core/Checkbox';

import React from 'react';

export class FileSelectWidget extends ReactWidget
{
    constructor()
    {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectorFiles: FileList | null )
    {
        console.log(selectorFiles);
    }

    render ()
    {
        return <div>
            <input type="file" onChange={ (e) => this.handleChange(e.target.files) } />
			
			<Checkbox
  value="checkedA"
  inputProps={{ 'aria-label': 'Checkbox A' }}
/>
        </div>;
    }
}
