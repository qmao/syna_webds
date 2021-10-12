import React, { useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { UserContext } from './context';
import webdsTheme from './webdsTheme';

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


const useStyles = makeStyles((theme: typeof webdsTheme) =>
    createStyles({
        filelist: {
            width: '100%',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 250,
        },
    }),
);

export default function FileList(
    props: {
        list: string[];
        onDelete: (value: string, index: number) => void;
        onSelect: (value: string) => void;
    }
) {
    const classes = useStyles();
    //const [select, setSelect] = React.useState('unset');
    const context = useContext(UserContext);

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
        <Paper className={classes.filelist} elevation={0}>
            <List>
     			<RadioGroup aria-label="Hex File" name="select-hex" value={context.packrat} onChange={handleChange} >
                { props.list.map((value, index) => {
                    return (
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => props.onDelete(value, index)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(value, index)} dense>
                                <ListItemIcon>
                                    <FormControlLabel value={value} control={<Radio color='primary' />} label={value} />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
				</RadioGroup>
            </List>
        </Paper>
    );
}