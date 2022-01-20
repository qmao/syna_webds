import React, { useState, useContext, useEffect, useRef } from 'react';
import { requestAPI } from './handler';
import { UserContext } from './context';

import { Box, Typography } from '@mui/material';

import FlashOnIcon from '@mui/icons-material/FlashOn';


import Fab from '@mui/material/Fab';

//import DownloadBlob, { BlobFile } from './packrat/packrat'

interface ButtonProps {
    children?: React.ReactNode;
    index?: any;
    value?: any;
    title?: any;
    alert?: any;
    error: any;
    list: any;
    onStart: any;
    onProgress: any;
    onMessage: any;
}

declare global {
    var source: EventSource;
}


export default function ButtonProgram(props: ButtonProps) {
    const { children, value, index, title, alert, error, list, onStart, onProgress, onMessage, ...other } = props;
    const [disable, setDisable] = useState(false);
    const [progress, setProgress] = React.useState(0);
    const [isStart, setStart] = React.useState(false);

    const context = useContext(UserContext);
    const link = useRef("");

    interface ProgramResponse {
        status: string;
        message: string;
    }

    const eventHandler = (event: any) => {
        let obj = JSON.parse(event.data);
        //console.log(obj)

        if (obj.progress) {
            setProgress(obj.progress);
        }
        if (obj.status && obj.message) {
            setProgramStatus(false, obj.status == 'success', JSON.stringify(obj.message));
        }
    }

    const go = (file: string) => {
        setProgramStatus(true);
        globalThis.source = new window.EventSource('/webds/reprogram');
        console.log(globalThis.source);
        if (globalThis.source != null) {
            globalThis.source.addEventListener('reprogram', eventHandler, false);
        }
        else {
            console.log("event source is null");
        }
        start_program(file)
            .then(res => {
                setProgramStatus(true);
            })
            .catch((error) => {
                console.log(error, 'Promise error');
                setProgramStatus(false, false, error);
         })
    }

    useEffect(() => {
        props.onProgress(progress);
    }, [progress]);

    useEffect(() => {
        let file: string;

        props.onStart(isStart);

        if (isStart) {
            let cache = "PR" + context.packrat + ".hex"
            let exist = props.list.includes(cache);
            console.log(props.list);
            console.log(cache);
            console.log(exist);

            if (!exist) {
                console.log("download hex from packrat server");
                file = context.packrat;
                start_fetch(file).then(res => {
                    let filePath = file + "/PR" + file + '.hex';
                    go(filePath);
                })
                .catch((error) => {
                    console.log(error, 'Promise error');
                    setProgramStatus(false, false, error);
                })
            }
            else {
                file = context.packrat + "/" + cache;
                if (file == "") {
                    setProgramStatus(false, false, "Please choose a HEX file");
                }
                go(file);
            }
        }
    }, [isStart]);

    const setProgramStatus = (start: boolean, status?: boolean, result?: string) => {
        if (start) {
            link.current = "";
        }
        else {
            console.log(result);
            show_result(status!, result || '');
            setStart(false);
            console.log(globalThis.source)
            if (globalThis.source != undefined && globalThis.source.addEventListener != null) {
                globalThis.source.removeEventListener('reprogram', eventHandler, false);
                globalThis.source.close();
                console.log("close event source");
            }
        }

        setProgress(0);
        setDisable(start);
    }

    const show_result = (pass: boolean, message: string) => {
        console.log("pass:", pass);

        onMessage(pass ? "success" : "error", message, link.current);

        console.log(pass);
    }

    const start_program = async (file_name: string): Promise<ProgramResponse | undefined> => {
        const action = "start";
        const dataToSend = {
            filename: file_name,
            action: action
        };

        console.log("filename:", file_name);

        try {
            const reply = await requestAPI<any>('reprogram', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);
            return Promise.resolve(reply);
        } catch (e) {
            console.error(
                `Error on POST ${dataToSend}.\n${e}`
            );
            return Promise.reject((e as Error).message);
        }
    }

    const is_intranet = async (): Promise<Boolean | undefined> => {
        let url = 'https://packrat.synaptics.com/packrat/login.cgi'

        try {
            await fetch(url, {
                mode: 'no-cors', // no-cors, *cors, same-origin
                credentials: 'include', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'text/plain'
                },
            })
            return Promise.resolve(true);
        }
        catch (e) {
            console.log(e);
            return Promise.resolve(false);
        }
    }

    const start_fetch = async (packrat: string): Promise<string | undefined> => {

        try {
            console.log(packrat);

            let url = 'https://packrat.synaptics.com/packrat/gethex.cgi?packrat_id=' + packrat
            await fetch(url, {
                //mode: 'no-cors', // no-cors, *cors, same-origin
                //credentials: 'include', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'text/plain'
                },
            })
                .then(res => res.blob()) // Gets the response and returns it as a blob
                .then(function (blob) {
                    console.log(blob)
                    const formData = new FormData();
                    formData.append("blob", blob, 'test');

                    const reply = requestAPI<any>('packrat', {
                        body: formData,
                        method: 'POST',
                    });
                    console.log(reply);

                    return Promise.resolve(reply);

                })
        } catch (e) {
            console.log((e as Error).message);
            let intranet = await is_intranet();
            if (intranet) {
                link.current = "https://confluence.synaptics.com/x/u4ovCw";
                return Promise.reject("Packrat Fetch Error. Please see ");
            }
            else {
                link.current = "https://packrat.synaptics.com/";
                return Promise.reject("Unable to access ");
            }
        }
    }

    return (
        <div {...other}>
            <Box sx={{
                m: 1, display: 'flex',
                flexDirection: 'row-reverse'
            }}>
                <Fab variant="extended" color="primary" disabled={disable || error}
                    onClick={() => setStart(true)}
                    sx={{ maxWidth: 145 }}>
                    { isStart ?
                        <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                sx={{mr:1}}
                        >{`${Math.round(progress)}%`}
                        </Typography>
                        :
                        <FlashOnIcon sx={{ mr: 1 }} />
                    }
                    { title }
                </Fab>
            </Box>
        </div>
    );
}


