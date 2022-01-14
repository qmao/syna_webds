import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ButtonProgram from './program'
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';


import { ThemeProvider } from "@mui/material/styles";
//import { requestAPI } from './handler';
//import { UserContext } from './context';
import webdsTheme from './webdsTheme';


export default function VerticalTabs(
    props: {
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
) {

    const [packrat, setPackrat] = React.useState("12345678");
    const [packratError, setPackratError] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState<PopperPlacementType>();

    useEffect(() => {
        if (true) {
            console.log(packrat);
            if (packrat === '') {
                setPackratError(false);
            }
            else if (isNaN(+Number(packrat))) {
                console.log("invalid!!");
                setPackratError(true);
            }
            else
                setPackratError(false);
        }
    }, [packrat]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
        setPlacement('right-start');
    };

    return (
        <div>
            <ThemeProvider theme={webdsTheme}>
                <Box sx={{
                    flexDirection: 'row',
                    backgroundColor: webdsTheme.palette.background.paper,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: "center",
                    m: 4
                }}>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Paper>
                                    <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
                                </Paper>
                            </Fade>
                        )}
                    </Popper>

                    <TextField id="filled-basic"
                        label="Packrat"
                        value={packrat}
                        onChange={(e) => setPackrat(e.target.value)}
                        error={packratError}
                        sx={{
                            margin: webdsTheme.spacing(1),
                            width: '25ch',
                        }}
                    />
                </Box>
                <Box sx={{
                    backgroundColor: webdsTheme.palette.background.paper,
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <ButtonProgram title="PROGRAM" error={packratError} />
                </Box>
            </ThemeProvider>
            </div>
            );

}
 
/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class ShellWidget extends ReactWidget {
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
        return <VerticalTabs onFileChange={this.handleChangeFile} />;
    }
}
