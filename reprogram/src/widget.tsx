import { ReactWidget } from '@jupyterlab/apputils';
import React/*, { useEffect } */from 'react';

import Box from '@mui/material/Box';


//import { ThemeProvider } from "@mui/material/styles";
//import { requestAPI } from './handler';
//import { UserContext } from './context';
//import webdsTheme from './webdsTheme';

export default function VerticalTabs(
    props: {
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
) {

    return <Box />;
}
 
/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class ShellWidget extends ReactWidget {
/**
* Constructs a new CounterWidget.
*/
    constructor() {
        super();
        this.addClass('content-widget');
		console.log("TabPanelUiWidget is created!!!");
    }

    handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.currentTarget.files);
    }

    render(): JSX.Element {
        return <VerticalTabs onFileChange={this.handleChangeFile} />;
    }
}
