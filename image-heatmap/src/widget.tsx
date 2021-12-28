import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import HeatMap from 'heatmap-ts'

//import { ThemeProvider } from "@mui/material/styles";

import { requestAPI } from './handler';
//import { UserContext } from './context';


//import webdsTheme from './webdsTheme';

//const SSE_CONNECTING = 0
//const SSE_OPEN = 1
const SSE_CLOSED = 2


function matrixIndexed(details: number[][]) {
    let dataPoints = [];

    globalThis.max = -1000;
    globalThis.min = 1000;

    for (let i = 0; i < details.length; i++) {
        // get the length of the inner array elements
        let innerArrayLength = details[i].length;

        // looping inner array elements
        for (let j = 0; j < innerArrayLength; j++) {
            //console.log(details[i][j]);
            let dataPoint = {
                x: j * globalThis.distance,
                y: i * globalThis.distance,
                value: details[i][j],
            };
            dataPoints.push(dataPoint);
            if (dataPoint.value > globalThis.max)
                globalThis.max = dataPoint.value;
            if (dataPoint.value < globalThis.min)
                globalThis.min = dataPoint.value;
        }
    }
    //console.log(dataPoints);

    return dataPoints;
}

declare global {
    var source: EventSource;
    var heatMap: HeatMap;

    var p1FrameCount: number;
    var p1T0: number;
    var p1T1: number;
    var event_data: number[][];

    var max: number;
    var min: number;

    var col: number;
    var row: number;

    var distance: number;
}

const eventHandler = (event: any) => {
    let report = JSON.parse(event.data);
    globalThis.event_data = report.image;
}

function prepare() {
    globalThis.distance = 10;

    globalThis.heatMap = new HeatMap({
        container: document.getElementById('mybox')!,
        maxOpacity: .3,
        radius: globalThis.distance * 1.5,
        blur: 0.8,
    })

    /************
    //let canvas: HTMLElement = document.getElementById('mybox')!.children[0];
    let e = document.getElementById('mybox');

    console.log(e!.firstChild!.nodeName);
    let test = e!.firstElementChild! as HTMLElement;
    console.log(test!.offsetTop);

    test!.style.left = "10px";
    test!.style.top = "10px";
    test!.style.position = "absolute";
    test!.style.margin = 'auto';
    *************/

    console.log(globalThis.heatMap);
    let x = (globalThis.row - 1) * globalThis.distance;
    let y = (globalThis.col - 1) * globalThis.distance;
    globalThis.heatMap.renderer.setDimensions(x, y);

    let e = document.getElementById('mybox');
    let paper = e! as HTMLElement;
    console.log(paper);
    paper!.style.width = x.toString();
    paper!.style.height = y.toString();
    console.log(paper);

    // set event handler
    globalThis.p1T0 = Date.now();
    globalThis.event_data = [[]];

    set_report([REPORT_TOUCH, REPORT_RAW], [REPORT_DELTA]);
    /* debug
    let data = [[100, 20, 40, 80,  0,  0,  0,  0, 0,   100],
                [ 11, 22, 33, 44, 55, 66,  0,  1, 10,  100],
                [ 1 ,  2,  3,  4,  5,  6, 20,  0,  0,  100],
                [ 11, 22, 33, 44, 55, 66,  0,100,  0,  100],
                [  1,  2, 30,  0,  0,  0,  1,  4,  5,  50],
                [  0,  1, 20, 10, 11, 22, 33, 44, 55, 99]];
    update(data);
    */
}

function addEvent() {
    globalThis.source = new window.EventSource('/webds/report');
    console.log(globalThis.source);

    // set event handler
    if (globalThis.source != null) {
        globalThis.source.addEventListener('report', eventHandler, false);

        globalThis.source.addEventListener("open", function (e) {
            console.log("Connecting...");
            update();
        });

        globalThis.source.addEventListener("error", function (e) {
            console.log(e);
            alert("Error");
        });

        globalThis.source.addEventListener("close", function (e) {
            console.log(e);
            alert("Close!");
        });
    }
    else {
        console.log("event source is null");
    }
}

function waitForClosed() {
    setTimeout(function () {
        console.log(globalThis.source.readyState);
        if (globalThis.source.readyState != SSE_CLOSED) { 
            waitForClosed();
        }
    }, 5000)
}

function removeEvent() {
    console.log(globalThis.source);
    if (globalThis.source != undefined && globalThis.source.addEventListener != null && globalThis.source.readyState != SSE_CLOSED) {
        globalThis.source.removeEventListener('report', eventHandler, false);
        globalThis.source.close();
        waitForClosed();
        console.log("close event source");
    }
}

function update() {
    let data = globalThis.event_data;

    if (globalThis.event_data != [[]]) {
        let points = matrixIndexed(data);
        //console.log(points);

        globalThis.heatMap.setData({
            max: globalThis.max,
            min: globalThis.min,
            data: points
        })
    }

    globalThis.p1FrameCount++;
    globalThis.p1T1 = Date.now();
    if (globalThis.p1T1 - globalThis.p1T0 >= 1000) {
        globalThis.p1T0 = globalThis.p1T1;
        console.log(`Lorenz attractor FPS = ${globalThis.p1FrameCount}`);
        globalThis.p1FrameCount = 0;

        console.log(data);
        console.log(`max=${globalThis.max}, min=${globalThis.min}`);

        console.log(globalThis.source.readyState);
    }

    //check if component exsit every 1 sec
    let e = document.getElementById('mybox');
    if (e == null) {
        console.log("ready to close event handler");
        //close event handler
        removeEvent();
        return;
    }

    //if event source is closed because user change report
    if (globalThis.source.readyState == SSE_CLOSED)
        return;

    requestAnimationFrame(update);
}

const options = [
    'DELTA',
    'RAW',
];

const ITEM_HEIGHT = 20;

const REPORT_TOUCH = 17;
const REPORT_DELTA = 18;
const REPORT_RAW = 19;

const get_dimension = async (): Promise<number[]> => {
    try {
        const reply = await requestAPI<any>('command?query=app-info', {
            method: 'GET',
        });
        console.log(reply['numRows']);
        console.log(reply['numCols']);
        return Promise.resolve([reply['numRows'], reply['numCols']]);
    } catch (error) {
        console.log(error);
        return Promise.reject([0, 0]);
    }
}

const set_report = async (disable: number[], enable: number[]): Promise<string | undefined> => {
    const dataToSend = {
        enable: enable,
        disable: disable
    };
    console.log(dataToSend);
    try {
        console.log("[QMAO] remove event");
        removeEvent();

        console.log("[QMAO] set report");
        const reply = await requestAPI<any>('report', {
            body: JSON.stringify(dataToSend),
            method: 'POST',
        });

        console.log("[QMAO] add event");
        addEvent();

        console.log(reply);
        return Promise.resolve("ok");
    } catch (error) {
        console.log(error);
        console.log(error.message);
        return Promise.reject(error.message);
    }
}

export default function MyButton () {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (
        event: React.MouseEvent<HTMLElement>,
        option: string,
    ) => {
        console.log(option);
        if (option == 'DELTA')
            set_report([REPORT_TOUCH, REPORT_RAW], [REPORT_DELTA]);
        else if (option == 'RAW')
            set_report([REPORT_TOUCH, REPORT_DELTA], [REPORT_RAW]);

        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                width: 600,
                height: 400,
                flexDirection: "column",
                display: "flex",
                alignItems: "flex-start",
                ml: 5,
                mt: 5
            }}
        >
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls="long-menu"
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option} selected={option === 'DELTA'} onClick={(event) => handleClose(event, option)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
            <Paper className="mybox" id='mybox'></Paper>
        </Box>
    );
}



/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class MainWidget extends ReactWidget {
    /**
    * Constructs a new CounterWidget.
    */
    constructor() {
        super();
        this.addClass('content-widget');
        console.log("TabPanelUiWidget is created!!!");


        get_dimension().then((data) => {
            globalThis.col = data[0];
            globalThis.row = data[1];
            prepare();
        })
    }

    handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.currentTarget.files);
    }

    render(): JSX.Element {
        return <MyButton />;
    }
}