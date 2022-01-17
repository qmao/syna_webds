import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect, useContext } from 'react';
import { UserContext } from './context';
import { requestAPI } from './handler';

import { TextField, Box, IconButton, Stack, Divider, Paper } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { ThemeProvider } from "@mui/material/styles";
import ButtonProgram from './program'
import FileList from './filelist'
import webdsTheme from './webdsTheme';

export default function VerticalTabs(
    props: {
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
) {

    const [packrat, setPackrat] = React.useState("12345678");
    const [packratError, setPackratError] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [filelist, setFileList] = React.useState([]);
    const [select, setSelect] = React.useState("");

    const context = useContext(UserContext);

    useEffect(() => {
        console.log(packrat);
        if (packrat === '') {
            setPackratError(false);
        }
        else if (isNaN(+Number(packrat))) {
            console.log("invalid!!");
            setPackratError(true);
        }
        else {
            setPackratError(false);
            context.packrat = packrat;
            console.log(context.packrat);
        }
    }, [packrat]);

    useEffect(() => {
        if (open) {
            get_hex_list();
        }
    }, [open]);

    useEffect(() => {
        let file = select.split(".")[0].substr(2);
        console.log("onFileSelect:", file);
        setPackrat(file);
    }, [select]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(!open);
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

    const onFileDelete = (file: string, index: number) => {
        console.log("onFileDelete:", file);
        delete_hex(file);
    };

    const onFileSelect = (file: string) => {
        setSelect(file);
        setOpen(!open);
        console.log("onFileSelect:", file);
    };

    const delete_hex = async (filename: string): Promise<string | undefined> => {
        console.log("delete_hex");
        let packrat = filename.split(".")[0].substr(2);
        const dataToSend = { file: filename };

        console.log(packrat);
        console.log(dataToSend);

        try {
            const reply = await requestAPI<any>('packrat/' + packrat, {
                body: JSON.stringify(dataToSend),
                method: 'DELETE',
            });
            console.log(reply);
            await get_hex_list().then(list => {
                if (list!.indexOf(packrat) == -1) {
                    setPackrat("");
                }
            });

            return reply;
        } catch (error) {
            if (error) {
                return error.message
            }
        }
    }

    const get_hex_list = async (): Promise<string[] | undefined> => {
        try {
            const reply = await requestAPI<any>('packrat?extension=hex', {
                method: 'GET',
            });
            console.log(reply);

            let hexlist = reply["filelist"].map((value: string) => {
                let res = value.split("/");
                return res[1];
            });

            setFileList(hexlist);
            return hexlist;
        } catch (error) {
            console.log(error);
            setFileList([]);
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
                get_hex_list().then(() => { setSelect(filename) });
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
                        mt: 6
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
                                    accept=".hex"
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
                            </div>
                        }
                    </Stack>

                    <Stack spacing={1} sx={{
                        flexDirection: 'column',
                        display: 'flex',
                        alignItems: "center",
                        width: 245
                    }}>
                        <Divider>
                            <Box sx={{ textAlign: 'center', m: 1 }}>{open ? "Hex Files" : "Packrat"}</Box>
                        </Divider>

                        {open ?
                            <Paper variant="outlined" sx={{m:0, p:0}}>
                                <FileList list={filelist} onDelete={onFileDelete} onSelect={onFileSelect} select={select}/>
                            </Paper>
                            :
                            <TextField id="filled-basic"
                                value={packrat}
                                onChange={(e) => setPackrat(e.target.value)}
                                error={packratError}
                                sx={{
                                    margin: webdsTheme.spacing(1),
                                    width: '29ch',
                                }}
                            />
                        }
                        <ButtonProgram title="PROGRAM" list={filelist} error={packratError} />
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
