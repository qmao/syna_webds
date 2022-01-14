import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect } from 'react';

import { TextField, Box, IconButton, Paper, Fade, Typography, Stack } from '@mui/material';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import ButtonProgram from './program'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ThemeProvider } from "@mui/material/styles";
import { requestAPI } from './handler';
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
        if (open) {
            setAnchorEl(null);
            setOpen(false);
        }
        else {
            setAnchorEl(event.currentTarget);
            setOpen(true);
            setPlacement('right-start');
        }
    };

    const handleUpload = (event: React.MouseEvent<HTMLElement>) => {
        (document.getElementById("icon-button-hex") as HTMLInputElement).value = "";
    }

    const handlFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event);

        if (event.currentTarget.files) {
            upload_hex(event.currentTarget.files[0])
                .then((file) => {
                    console.log(file);
                    ////setLoading(false);
                })
                .catch(err => {
                    ////setLoading(false);
                    alert(err)
                });
        }
    }

    const get_hex_list = async (): Promise<string[] | undefined> => {
        console.log("get_hex_list:", event);
        try {
            const reply = await requestAPI<any>('packrat?extension=hex', {
                method: 'GET',
            });
            console.log(reply);
            ////setFileList(reply['filelist']);
            return reply['filelist'];
        } catch (error) {
            console.log(error);
            ////setFileList([]);
            return error.message
        }
    }

    const upload_hex = async (file: File): Promise<string | undefined> => {
        console.log("upload_hex:", file);


        if (file) {
            ////setLoading(true);

            const formData = new FormData();
            formData.append("fileToUpload", file);

            console.log(formData);
            try {
                const reply = await requestAPI<any>('packrat', {
                    body: formData,
                    method: 'POST',
                });

                console.log(reply);

                let filename = reply['filename'];
                get_hex_list().then(filelist => {
                    // set select packrat
                    filelist!.forEach((element: any) => {
                        if (element.includes(filename)) {
                            setPackrat(element);
                        }
                    });
                })
                return Promise.resolve(filename);
            } catch (error) {
                console.log(error);
                console.log(error.message);
                return Promise.reject(error.message);
            }
        }
    }

    return (
        <div>
            <ThemeProvider theme={webdsTheme}>
                <Box sx={{
                    flexDirection: 'row',
                    display: 'flex',
                    justifyContent: 'center',
                    //alignItems: "center",
                    mt: 4
                }}>
                    <Stack spacing={1} sx={{
                        flexDirection: 'column',
                        display: 'flex',
                        m: 2
                    }}>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            {open ? <CloseIcon /> : <MoreVertIcon />}
                        </IconButton>
                        {open &&
                            <div>
                            <input
                                accept="hex"
                                id="icon-button-hex"
                                onChange={handlFileChange}
                                type="file"
                                hidden
                            />
                            <label htmlFor="icon-button-hex">
                                <IconButton component="span"
                                    aria-label="more"
                                    id="hex-button"
                                    onClick={handleUpload}
                                >
                                    <CloudUploadIcon />
                                </IconButton>
                            </label>



                                <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
                                    {({ TransitionProps }) => (
                                        <Fade {...TransitionProps} timeout={350}>
                                            <Paper>
                                                <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
                                            </Paper>
                                        </Fade>
                                    )}
                                </Popper>
                            </div>
                        }
                    </Stack>

                    <Stack spacing={1} sx={{
                        flexDirection: 'column',
                        display: 'flex',
                        alignItems: "center",
                    }}>
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
                        <ButtonProgram title="PROGRAM" error={packratError} />
                    </Stack>
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
