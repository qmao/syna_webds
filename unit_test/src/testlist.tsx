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



import Snackbar from '@mui/material/Snackbar';

import { TestGetHexList } from './test_hex_list'
import { TestDownloadFile } from './test_download_file';
import { TestUnit } from './test_interface';



export default function UnitTest() {

    const test_main = async (test: TestUnit) => {
        console.log(test.title);

        test.state = 'start';
        setStart(true);

        await test.run().then(result => {
                console.log(test)
                console.log(result);
                setStart(false);
        });
    }
     
    /*
    const test_reprogram = async (): Promise<TestResult | undefined> => {
        const file_name = "3365253/PR3365253.hex";
        const action = "start";
        const dataToSend = {
            filename: file_name,
            action: action
        };

        console.log("filename:", file_name);

        try {

       
            const reply = await requestAPI<any>('program', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);

            await new Promise(f => setTimeout(f, 5000));

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
*/
    const [start, setStart] = React.useState(false);
    const [reset, setReset] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openMessage, setOpenMessage] = React.useState('');
    const [items, setItems] = React.useState<TestUnit[]>([]);


    React.useEffect(() => {
        console.log("reset:", reset)
        if (reset) {
            items.map((currElement, index) => {
                currElement.state = 'pending';
            });
        }
    }, [reset]);

    React.useEffect(() => {
        console.log("start:", start)
    }, [start]);

    React.useEffect(() => {
        setItems(
            [
                new TestGetHexList(),
                new TestDownloadFile("3080091", "PR3080091.hex")
            ]
        );
    }, []);


    const test = async () => {
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
                {items.map((test) => (
                    <ListItemButton>
                        <ListItemText primary={`Test ${test.title}`} />
                        <IconButton onClick={() => test_main(test)}>
                            {test.state === 'start' &&
                                <PlayCircleOutlineIcon sx={{ color: green[500] }} />
                            }
                            {test.state === 'pending' &&
                                <PendingOutlinedIcon />
                            }
                            {test.state === 'done' && test.result.status === 'pass' &&
                                <CheckCircleOutlineOutlinedIcon sx={{ color: green[500] }} />
                            }
                            {test.state === 'done' && test.result.status === 'fail' &&
                                <DangerousOutlinedIcon sx={{ color: red[500] }} />
                            }
                            {test.state === 'done' && test.result.status === 'warning' &&
                                <ErrorOutlineOutlinedIcon sx={{ color: yellow[500] }} />
                            }
                        </IconButton>
                        <IconButton onClick={() => { setOpenMessage(test.result.info); setOpen(true) }}>
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
