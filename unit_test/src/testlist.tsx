import { ReactWidget } from '@jupyterlab/apputils';

//import * as React from 'react';
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

//import { requestAPI } from './handler';


export default function UnitTest() {
    const TestArray = ['Download packrat file', 'Get Extension List'] as const;

    return (
        <Box>
            <List>
                {TestArray.map((value) => (
                    <ListItem
                        key={value}
                        disableGutters
                        secondaryAction={
                            <IconButton>
                                <CommentIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={`Test ${value}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export class TestList extends ReactWidget {
    /**
    * Constructs a new CounterWidget.
    */
    constructor() {
        super();
        this.addClass('content-widget');
        console.log("TabPanelUiWidget is created!!!");
    }

    render(): JSX.Element {
        return <UnitTest />;
    }
}
