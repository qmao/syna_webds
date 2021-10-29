import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider } from "@mui/material/styles";

import { requestAPI } from './handler';
import { UserContext } from './context';
import FileList from './filelist'
import ButtonProgram from './program'
import UploadButtons from './upload'

import webdsTheme from './webdsTheme';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}


function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2} sx={{
                    minHeight: 140,
                    minWidth: 390,
                }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function VerticalTabs(
    props: {
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
) {
    const [value, setValue] = React.useState(0);
    const [filelist, setFileList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [packrat, setPackrat] = React.useState("");
    const [packratError, setPackratError] = React.useState(false);
    const [packratNumber, setPackratNumber] = React.useState("");

    useEffect(() => {
        if (value == 0)
            get_hex_list();
    }, [value]);

    React.useEffect(() => {
        if (packratNumber === '') {
            setPackratError(false);
        }
        else if (isNaN(+Number(packratNumber))) {
            console.log("invalid!!");
            setPackratError(true);
        }
    }, [packratNumber]);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const upload_hex = async (file: File): Promise<string | undefined> => {
        console.log("upload_hex:", event);

        if (file) {
            setLoading(true);

            const formData = new FormData();
            formData.append("fileToUpload", file);

            console.log(formData);
            try {
                const reply = await requestAPI<any>('upload', {
                    body: formData,
                    method: 'POST',
                });
                
                console.log(reply);
                setLoading(false);

                let filelist = reply['filelist'];
                setFileList(filelist);

                // set select packrat
                filelist.forEach((element: any) => {
                    if (element.includes(reply['upload'])) {
                        setPackrat(element);
                    }
                });

                return reply;
            } catch (error) {
                if (error) {
                    return error.message
                }
                setLoading(false);
            }
        }
    }

    const get_hex_list = async (): Promise<string | undefined> => {
        console.log("get_hex_list:", event);
        const dataToSend = { action:"get-list", extension: "hex" };
        try {
            const reply = await requestAPI<any>('file', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);
            setFileList(reply['filelist']);
            return reply;
        } catch (error) {
			console.log(error);
			setFileList([]);
            return error.message
        }
    }

    const delete_hex = async (filename: string): Promise<string | undefined> => {
        console.log("delete_hex:", event);
        const dataToSend = { action: "delete", extension: "hex", file: filename };
        try {
            const reply = await requestAPI<any>('file', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);
            setFileList(reply['filelist']);
            return reply;
        } catch (error) {
            if (error) {
                return error.message
            }
        }
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("onFileChange:", event.currentTarget.files);

        if (event.currentTarget.files) {
            upload_hex(event.currentTarget.files[0]);
        }
    };

    const onFileDelete = (file: string, index: number) => {
        console.log("onFileDelete:", file);
        delete_hex(file);
    };

    const onFileSelect = (file: string) => {
        console.log("onFileSelect:", file);
        setPackrat(file);
    };

    return (
        <Box sx={{
            flexDirection: 'column',
            backgroundColor: webdsTheme.palette.background.paper,
            display: 'flex',
            width: 600,
            maxHeight: 500,
        }}>
		<ThemeProvider theme={webdsTheme}>
        <UserContext.Provider
            value={{ packrat: packrat }}
        >
            <Paper elevation={0}>
                        <Paper elevation={0} sx={{
                            flexGrow: 1,
                            backgroundColor: webdsTheme.palette.background.paper,
                            display: 'flex',
                        }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        textColor="primary"
                        indicatorColor="primary"
                        id="tabs"
                        sx={{ borderRight: `1px solid ${webdsTheme.palette.divider}`}}
                    >
                            <Tooltip placement="left-start" title="Choose a HEX file on RPi4 packrat cache">
                                <Tab label="Files" {...a11yProps(0)} />
                            </Tooltip>
                            <Tooltip placement="left-start" title="Choose a HEX on Packrat server">
                                <Tab label="Packrat" {...a11yProps(1)} />
                            </Tooltip>
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <FileList list={filelist} onDelete={onFileDelete} onSelect={onFileSelect} />
                                <Box sx={{
                                    m: 1, position: 'relative', display: 'flex',
                                    flexDirection: "row-reverse",
                                    padding: webdsTheme.spacing(0),
                                    margin: webdsTheme.spacing(0),
                                    bgcolor: "background.paper", }}>
                            <UploadButtons onChange={onFileChange} />
                            {loading && <CircularProgress
                                size={50}
                                sx={{
                                    position: 'absolute',
                                    top: 3,
                                    right: 11,
                                }}
                            />}
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <TextField id="filled-basic"
                                    label="Packrat"
                                    onChange={(e) => setPackratNumber(e.target.value)}
                                    error={packratError}
                                    sx={{
                                      margin: webdsTheme.spacing(1),
                                      width: '25ch',
                                    }}
                        />
                    </TabPanel>
                 </Paper>
                 <Box>
                     <ButtonProgram title="PROGRAM" />
                 </Box>
            </Paper>
            </UserContext.Provider>
			</ThemeProvider>
            </Box>
    );
}


 
/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class TabPanelUiWidget extends ReactWidget {
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
