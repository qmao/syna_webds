import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';

//import { ThemeProvider } from "@mui/material/styles";
//import CssBaseline from '@mui/material/CssBaseline';
//import Container from '@mui/material/Container';


//import { requestAPI } from './handler';
//import { UserContext } from './context';


//import webdsTheme from './webdsTheme';

const options = [
    'Delta',
    'Raw',
];

const ITEM_HEIGHT = 20;

export default function MyButton () {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Box
            sx={{
                width: 600,
                height: 400,
                flexDirection: "column",
                display: "flex",
                alignItems: "flex-start"
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
                    <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
            <Paper className="mybox" id='mybox' sx={{ width: 300, height: 200 }}></Paper>
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