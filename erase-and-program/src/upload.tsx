import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import BackupIcon from '@material-ui/icons/Backup';
import webdsTheme from './webds_theme';
import {
  ThemeProvider,
} from "@mui/material/styles";

const useStyles = makeStyles(webdsTheme =>
    createStyles({
        root: {
            '& > *': {
                margin: webdsTheme.spacing(1),
            },
        },
        input: {
            display: 'none',
        },
        upload: {
            width: webdsTheme.spacing(5),
            height: webdsTheme.spacing(5),
        },
    }),
);

export default function UploadButtons(
  props: {
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
        title?: string;
  })
{
    const classes = useStyles(webdsTheme);
    const [counter, setCounter] = useState(0);

    return (
	<ThemeProvider theme={webdsTheme}>
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
                <Tooltip placement="right-end" title="Click button to upload a hex file to RPi4" arrow>
                    <IconButton aria-label="delete" component="span"
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
		</ThemeProvider>
    );
}