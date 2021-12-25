import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';

//import { ThemeProvider } from "@mui/material/styles";

import { requestAPI } from './handler';
//import { UserContext } from './context';


//import webdsTheme from './webdsTheme';

const options = [
    'DELTA',
    'RAW',
];

const ITEM_HEIGHT = 20;

const REPORT_TOUCH = 17;
const REPORT_DELTA = 18;
const REPORT_RAW = 19;

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

export default function MyButton () {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (
        event: React.MouseEvent<HTMLElement>,
        option: string,
    ) => {

        console.log(option);
        if (option == 'DELTA')
            set_report([REPORT_TOUCH, REPORT_RAW], [REPORT_DELTA]);
        else if (option == 'RAW')
            set_report([REPORT_TOUCH, REPORT_DELTA], [REPORT_RAW]);


        setAnchorEl(null);
    };


    return (
        <Box
            sx={{
                width: 600,
                height: 400,
                flexDirection: "column",
                display: "flex",
                alignItems: "flex-start",
                ml: 5,
                mt: 5
            }}
        >
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls="long-menu"
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option} selected={option === 'DELTA'} onClick={(event) => handleClose(event, option)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
            <Paper className="mybox" id='mybox'></Paper>
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