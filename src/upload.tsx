import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import BackupIcon from '@material-ui/icons/Backup';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        input: {
            display: 'none',
        },
    }),
);

export default function UploadButtons(
  props: {
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
        title?: string;
  })
{
    const classes = useStyles();
    const [counter, setCounter] = useState(0);

    return (
        <div className={classes.root}>
            <input
                accept=".hex"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={props.onChange}
            />
            <label htmlFor="contained-button-file">
                <Tooltip title="Click button to upload a hex file to RPi4" arrow>
                    <Button variant="contained" color="default" component="span"
                        onClick={(): void => {
                            setCounter(counter + 1);
                            console.log(counter);
                            (document.getElementById("contained-button-file") as HTMLInputElement).value = "";
                        }}
                        startIcon={<BackupIcon />}>
                        {props.title}
                    </Button>
                </Tooltip>
            </label>
        </div>
    );
}