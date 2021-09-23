import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import BackupIcon from '@material-ui/icons/Backup';
import { blue } from '@material-ui/core/colors';

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
        upload: {
            width: theme.spacing(5),
            height: theme.spacing(5),

            backgroundColor: blue[400],
            '&:hover': {
                backgroundColor: blue[500]
            }
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
                    <IconButton aria-label="delete" color="default" component="span"
                        onClick={(): void => {
                            setCounter(counter + 1);
                            console.log(counter);
                            (document.getElementById("contained-button-file") as HTMLInputElement).value = "";
                        }}
                    >
                        <Avatar alt="Remy Sharp" className={classes.upload}>
                            <BackupIcon />
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </label>
        </div>
    );
}