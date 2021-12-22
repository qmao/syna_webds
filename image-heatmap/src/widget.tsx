import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

//import { ThemeProvider } from "@mui/material/styles";
import ListItemText from '@mui/material/ListItemText';

//import { requestAPI } from './handler';
//import { UserContext } from './context';


//import webdsTheme from './webdsTheme';



export default function MyButton () {

    return (
        <ListItemText />
    );
}



/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class MainWidget extends ReactWidget {
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
        return <MyButton />;
    }
}