import React, { useContext } from 'react';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { UserContext } from './context';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        filelist: {
            width: '100%',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 250,
        },
    }),
);

const ListItemWithWiderSecondaryAction = withStyles({
    secondaryAction: {
        paddingRight: 45
    }
})(ListItem);

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
        <RadioGroup aria-label="Hex File" name="select-hex" value={context.packrat} onChange={handleChange} >
            <List >
                { props.list.map((value, index) => {
                    return (
                        <ListItemWithWiderSecondaryAction key={value} role={undefined} dense button onClick={handleToggle(value, index)}>
                            <ListItemIcon>
                                <FormControlLabel value={value} control={<Radio color='primary'/>} label={value} />
                            </ListItemIcon>
                            <ListItemSecondaryAction>
                                <Tooltip title="Remove the HEX file">
                                    <IconButton edge="end" aria-label="comments" onClick={() => props.onDelete(value, index)}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItemWithWiderSecondaryAction>
                    );
                })}
            </List>
            </RadioGroup>
        </Paper>
    );
}