import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import Box from '@mui/material/Box';
//import Paper from '@mui/material/Paper';

//import { ThemeProvider } from "@mui/material/styles";
//import CssBaseline from '@mui/material/CssBaseline';
//import Container from '@mui/material/Container';


//import { requestAPI } from './handler';
//import { UserContext } from './context';


//import webdsTheme from './webdsTheme';



export default function MyButton () {

    return (
        <Box id='mybox' className='mybox'
            sx={{
                width: 600,
                height: 400,
                //display: 'flex',
                //flexWrap: 'wrap',
                '& > *': {
                    m: 2,
                    p: 2,
                    position: 'relative',
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                },
            }}
        >

        </Box>
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