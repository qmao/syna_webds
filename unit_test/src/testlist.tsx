import { ReactWidget } from '@jupyterlab/apputils';

//import * as React from 'react';
import React from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RunCircleOutlinedIcon from '@mui/icons-material/RunCircleOutlined';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Box from '@mui/material/Box';
import { red, green, yellow } from '@mui/material/colors';



import { requestAPI } from './handler';

import Snackbar from '@mui/material/Snackbar';

import { TestGetHexList } from './test_hex_list'
import { TestDownloadFile } from './test_download_file'




export default function UnitTest() {

    interface TestUnit {
        run: () => Promise<TestResult>;
        Name: string;
    }

    interface Item {
        title: string;
        function: () => Promise<TestResult | undefined>;
        result: TestResult;
    }

    interface Item1 {
        test: TestUnit;
    }

    interface TestResult {
        status: string;
        info: string;
    }

    const test_main = async (test: Item) => {
        console.log(test.title);

        items.map((currElement, index) => {
            if (currElement.title == test.title) {
                currElement.result.status = 'start'
                setStart(true)
            }
        });

        await test.function().then(result => {
            items.map((currElement, index) => {
                if (currElement.title == test.title) {
                    console.log(test)
                    console.log(result);
                    currElement.result.info = result!.info
                    currElement.result.status = result!.status
                    console.log(currElement.result)
                    setStart(false)
                }
            });
        })
    }
    /*
    const eventHandler = (event: any) => {
        let obj = JSON.parse(event.data);

        console.log(obj)

        if (obj.status && obj.message) {
            setProgramStatus(obj.status);
        }
    }
    */

    const test_reprogram = async (): Promise<TestResult | undefined> => {
        const file_name = "3365253/PR3365253.hex";
        const action = "start";
        const dataToSend = {
            filename: file_name,
            action: action
        };

        console.log("filename:", file_name);

        try {

            /*
            let source = new window.EventSource('/webds/program');
            console.log(source);

            if (source != null) {
                source.addEventListener('program', eventHandler, false);
            }
            else {
                test_result.status = 'fail'
                test_result.info = "event source is null"
                return Promise.resolve(test_result);
            }
            */
            const reply = await requestAPI<any>('program', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);

            /*
            for (var i = 0; i < 100; i++) {
                console.log(programStatus);
                if (programStatus != '')
                    break;
                await new Promise(f => setTimeout(f, 500));
            }
            */
            await new Promise(f => setTimeout(f, 5000));
            /*
            if (source != null) {
                source.removeEventListener('program', eventHandler, false);
            }
            */

            return Promise.resolve({
                status: 'pass',
                info: reply
            });

        } catch (e) {
            console.error(
                `Error on POST ${dataToSend}.\n${e}`
            );

            return Promise.reject({
                status: 'fail',
                info: (e as Error).message
            });
        }
    }

    const test_download = async (): Promise<TestResult | undefined> => {
        try {
            var myRequest = new Request('/webds/packrat?packrat-id=3080091&filename=PR3080091.hex');

            const response = await fetch(myRequest);
            const blob = await response.blob();

            return Promise.resolve({
                status: 'pass',
                info: "File Size: " + blob.size.toString()
            });
        } catch (error) {
            console.log("error!!!", error.message);
            return Promise.reject({
                status: 'fail',
                info: error.message
            });
        }

    }

    const test_fail_function = async (): Promise<TestResult | undefined> => {
        console.log("get_hex_list:", event);

        const test = item1[0].test;

        console.log(test.Name);
        let result = test.run();

        return Promise.resolve(result);
    }

    const test_warning_function = async (): Promise<TestResult | undefined> => {
        console.log("get_hex_list:", event);

        return Promise.resolve({
            status: 'warning',
            info: "Test warning message"
        });
    }

    const [start, setStart] = React.useState(false);
    const [reset, setReset] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openMessage, setOpenMessage] = React.useState('');
    //const [programStatus, setProgramStatus] = React.useState('');

    const [items, setItems] = React.useState<Item[]>(
        [
            { title: 'Download packrat file', function: test_download, result: { status: 'pending', info: "" } },
            //{ title: 'Get Extension List', function: test_extension_list, result: { status: 'pending', info: "" } },
            { title: 'Program', function: test_reprogram, result: { status: 'pending', info: "" } },
            { title: 'Fail Sample', function: test_fail_function, result: { status: 'pending', info: "" } },
            { title: 'Warning Sample', function: test_warning_function, result: { status: 'pending', info: "" } },
        ]);

    const item1: Item1[] = 
        [
            { test: new TestGetHexList() },
            { test: new TestDownloadFile("test name") }
        ];

    React.useEffect(() => {
        console.log("reset:", reset)
        if (reset) {
            items.map((currElement, index) => {
                currElement.result.status = 'pending';
            });
        }
    }, [reset]);

    /*
    React.useEffect(() => {
        console.log("programStatus:", programStatus)
    }, [programStatus]);
    */

    React.useEffect(() => {
        console.log("start:", start)
        items.map((currElement, index) => {
            console.log(currElement.title)
            console.log(currElement.result)
        });
    }, [start]);

    const test = async () => {
        setItems(items);
        setReset(true);

        for (let value of items) {
            await test_main(value);
        }
        setReset(false)
    }

    return (
        <Box sx={{
            flexDirection: 'column',
            display: 'flex',
            width: 400,
            maxHeight: 500,
        }}>
            <IconButton onClick={() => test()}>
                <RunCircleOutlinedIcon />
            </IconButton>
            <List
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        WebDS API Test
                    </ListSubheader>
                }
            >
                {items.map((value) => (
                    <ListItemButton>
                        <ListItemText primary={`Test ${value.title}`} />
                        <IconButton onClick={() => test_main(value)}>
                            {value.result.status === 'start' &&
                                <PlayCircleOutlineIcon sx={{ color: green[500] }} />
                            }
                            {value.result.status === 'pass' &&
                                <CheckCircleOutlineOutlinedIcon sx={{ color: green[500] }}/>
                            }
                            {value.result.status === 'fail' &&
                                <DangerousOutlinedIcon sx={{ color: red[500] }}/>
                            }
                            {value.result.status === 'warning' &&
                                <ErrorOutlineOutlinedIcon sx={{ color: yellow[500] }}/>
                            }
                            {value.result.status === 'pending' &&
                                <PendingOutlinedIcon />
                            }
                        </IconButton>
                        <IconButton onClick={() => { setOpenMessage(value.result.info); setOpen(true) }}>
                            <InfoIcon />
                        </IconButton>
                    </ListItemButton>
                ))}

                <Snackbar
                    //anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    autoHideDuration={6000}
                    onClose={() => { setOpen(false) }}
                    message={openMessage}
                />

            </List>

        </Box>
    );
}

export class TestList extends ReactWidget {
    /**
    * Constructs a new CounterWidget.
    */
    constructor() {
        super();
        this.addClass('content-widget');
        console.log("TabPanelUiWidget is created!!!");
    }

    render(): JSX.Element {
        return <UnitTest />;
    }
}
