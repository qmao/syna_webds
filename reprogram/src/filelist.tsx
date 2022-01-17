import React from 'react';
//import webdsTheme from './webdsTheme';

import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';


export default function FileList(
    props: {
        list: string[];
        onDelete: (value: string, index: number) => void;
        onSelect: (value: string) => void;
        select: string;
    }
) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //setSelect(event.target.defaultValue);
        console.log(event.target);
    };

    const handleToggle = (value: string, index: number) => () => {
        console.log(value);
        console.log(index);
        props.onSelect(value);
    };
 
    return (
        <List sx={{
            p: 0
        }}>
            <RadioGroup aria-label="Hex File" name="select-hex" value={props.select} onChange={handleChange} >
            { props.list.map((value, index) => {
                return (
                    <Paper elevation={0} sx={(index % 2 == 1) ? { backgroundColor: '#FAFAFA' } : {}}>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => props.onDelete(value, index)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(value, index)}
                                dense sx={{ pt: 0, pb: 0 }}>
                                <ListItemIcon>
                                    <FormControlLabel value={value} control={<Radio color='primary' />} label={value} />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    </Paper>
                );
            })}
			</RadioGroup>
        </List>
    );
}