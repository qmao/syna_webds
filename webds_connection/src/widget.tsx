import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect, /*useRef,*/ useState, useContext } from 'react';

import { UserContext } from './context';
import { requestAPI } from './handler';

import {
    MenuItem, InputLabel, Stack, Collapse, Paper,
    Typography, TextField,
    FormControl,
    Fab,
    Box
    //Divider, Chip
} from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import Select, { SelectChangeEvent } from '@mui/material/Select';


import { ThemeProvider } from "@mui/material/styles";
import webdsTheme from './webdsTheme';

const I2C_ADDR_WIDTH = 150
const SPI_SPEED_WIDTH = 150

interface ConnectionSettings {
    action: string;
    value?: string;
}

async function ResetDefault() {
    await Post({action: "reset"})
}

async function UpdateSettings() {
    await Post({ action: "update", value: "{1111111111}" })
}

const Post = async (dataToSend: ConnectionSettings): Promise<string | undefined> => {
    try {
        const reply = await requestAPI<any>('settings/connection', {
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

const Get = async (section: string): Promise<string | undefined> => {
    try {
        let url = 'settings/connection?query=' + section;

        const reply = await requestAPI<any>(url, {
            method: 'GET',
        });
        console.log(reply);
        return Promise.resolve(reply);
    } catch (e) {
        console.error(
            `Error on GET.\n${e}`
        );
        return Promise.reject((e as Error).message);
    }
}

function SelectSpiMode(
    props: {
        mode: string;
        handleChange: (e: SelectChangeEvent) => void;
    }){

    return (
        <Stack spacing={0} sx={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: "center",
            p: 1
        }}>
            <Typography id="input-spi-speed" sx={{ p: 1 }}>
                SPI Mode
            </Typography>

            <Select
                id="connection-select-spi"
                value={props.mode}
                onChange={props.handleChange}
            >
                <MenuItem value="">
                    <em>Auto</em>
                </MenuItem>
                {[0,1,2,3].map((value) => {
                    return (
                        <MenuItem value={value}>{value}</MenuItem>
                    );
                })}
            </Select>
        </Stack>
    );
}

function SelectAttn(
    props: {
        attn: string;
        handleChange: (e: SelectChangeEvent) => void;
    }) {

    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="connection-select-spi-mode">Attn</InputLabel>
                <Select
                    labelId="connection-select-spi-mode"
                    id="connection-select-spi"
                    value={props.attn}
                    onChange={props.handleChange}
                >
                    <MenuItem value={"1"}>Interrupt</MenuItem>
                    <MenuItem value={"0"}>Polling</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

function SelectI2cAddr(
    props: {
        addr: string;
        error: boolean;
        handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    }) {
   
    return (
        <Stack spacing={0} sx={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: "center",
            p:1
        }}>
            <Typography id="input-i2c-address" sx={{ p: 1 }}>
                Slave Address
            </Typography>

            <TextField id="filled-basic"
                value={props.addr}
                onChange={props.handleChange}
                error={props.error}
                type="number"
                size="small"
                sx={{
                    width: I2C_ADDR_WIDTH,
                }}
            />
        </Stack>
    );
}

function SelectSpiSpeed(
    props: {
        speed: string;
        error: boolean;
        handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    }) {

    return (
        <Stack spacing={0} sx={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: "center",
            p: 1
        }}>
            <Typography id="input-spi-speed" sx={{ p: 1 }}>
                SPI Speed
            </Typography>

            <TextField id="filled-basic"
                value={props.speed}
                onChange={props.handleChange}
                error={props.error}
                type="number"
                size="small"
                sx={{
                    width: SPI_SPEED_WIDTH,
                }}
            />
        </Stack>
    );
}

export default function ConnectionWidget()
{
    //const context = useContext(UserContext);
    const [interfaces, setInterfaces] = React.useState(["i2c", "spi", "phone"]);
    const [protocol, setProtocol] = React.useState("i2c");
    const [isI2c, setI2c] = React.useState(false);
    const [isSpi, setSpi] = React.useState(false);
    const [showProtocol, setShowProtocol] = React.useState(false);

    const [mode, setMode] = React.useState('');
    const [attn, setAttn] = React.useState("0");
    const [addr, setAddr] = React.useState('30');
    const [addrError, setAddrError] = React.useState(false);


    const [speed, setSpeed] = React.useState('30');
    const [speedError, setSpeedError] = useState(false);

    //const [isPower, setPower] = React.useState(true);
    //const [isAttn, setAttn] = React.useState(true);

    //const jsonCustomRef = useRef("");
    //const jsonDefaultRef = useRef("");
    //const jsonMergeRef = useRef({});

    const context = useContext(UserContext);

    useEffect(() => {
        getJson();
    }, []);

    useEffect(() => {
        setProtocol(interfaces[0]);
        console.log("[interfaces]");
        context.interfaces = interfaces;
        console.log(context.interfaces);
    }, [interfaces]);

    useEffect(() => {
        console.log("[mode]");
        context.spiMode = Number(mode);
        console.log(context.spiMode);
    }, [mode]);

    useEffect(() => {
        console.log("[attn]");
        if (attn == "0")
            context.attn = false;
        else if (attn == "1")
            context.attn = true;
        console.log(context.attn);
    }, [attn]);

    useEffect(() => {
        console.log("[addr]");
        console.log(addr);

        if (addr === '') {
            setAddrError(true);
        }
        else if (isNaN(+Number(addr))) {
            console.log("invalid!!");
            setAddrError(true);
        }
        else {
            if (Number(addr) > 128)
                setAddr('128');
            else if (Number(addr) < 0)
                setAddr('0');
            setAddrError(false);

            context.i2cAddr = Number(addr);
        }
        console.log(context.i2cAddr);
    }, [addr]);

    useEffect(() => {
        console.log("[addr]");
        console.log(speed);

        if (speed === '') {
            setSpeedError(true);
        }
        else if (isNaN(+Number(speed))) {
            console.log("invalid!!");
            setSpeedError(true);
        }
        else {
            if (Number(speed) < 0)
                setSpeed('0');
            setSpeedError(false);

            context.spiSpeed = Number(speed);
        }
        console.log(context.spiSpeed);
    }, [speed]);

    const getJson = async () => {
        const fetchData = async (section: string) => {
            const data = await Get(section);
            console.log('data', data);
            return data;
        };

        let data = await fetchData("default");
        let jsonDefaultString = JSON.stringify(data);
        data = await fetchData("custom");
        let jsonCustomString = JSON.stringify(data);

        let jsonDefault = JSON.parse(jsonDefaultString);
        let jsonCustom = JSON.parse(jsonCustomString);
        let jsonMerge = Object.assign(jsonDefault, jsonCustom);
        console.log(jsonMerge);
        //jsonMergeRef.current = jsonMerge;

        let jprotocol = jsonMerge['interfaces'];
        let ji2cAddr = jsonMerge['i2cAddr'];
        let jspiMode = jsonMerge['spiMode'];
        let jspiSpeed = jsonMerge['speed'];
        let jattn = jsonMerge['useAttn'];

        console.log(jprotocol);
        console.log(ji2cAddr);
        console.log(jspiMode);
        console.log(jspiSpeed);
        console.log(jattn);

        setInterfaces(jprotocol);
        setAddr(ji2cAddr.toString());
        setMode(jspiMode.toString());
        setSpeed(jspiSpeed.toString());
        if (jattn)
            setAttn("1");
        else
            setAttn("0");
    };

    const handleChange = (event: SelectChangeEvent<typeof protocol>) => {
        console.log(event.target.value);
        setProtocol(event.target.value);
        let i2c = false;
        let spi = false;

        if (event.target.value == "i2c") {
            i2c = true;
            spi = false;
        }
        else if (event.target.value == "spi") {
            i2c = false;
            spi = true;
        }

        setProtocol(event.target.value);
        setI2c(i2c);
        setSpi(spi);
        setShowProtocol(i2c || spi);
    };

    const handleSpiModeChange = (event: SelectChangeEvent) => {
        setMode(event.target.value);
    };

    const handleAttnChange = (event: SelectChangeEvent) => {
        setAttn(event.target.value);
    };

    const handleI2cAddrChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAddr(event.target.value);
    };

    const handleSpeedChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSpeed(event.target.value);
    };

    return (
        <div>
            <ThemeProvider theme={webdsTheme}>
                <Stack spacing={1} sx={{
                    flexDirection: 'column',
                    display: 'flex',
                    alignItems: "left",
                    width: 400,
                    ml: 3
                }}>
                    <div>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="connection-helper-label">Protocol</InputLabel>
                            <Select
                                labelId="connection-helper-label"
                                id="connection-select"
                                label="Protocol"
                                onChange={handleChange}
                                value={protocol}
                            >
                                {interfaces.map((value) => {
                                    return (
                                        <MenuItem value={value}>{value}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </div>

                    <Collapse in={showProtocol}>
                        <Paper variant="outlined" square>
                            <Stack spacing={1} sx={{
                                flexDirection: 'column',
                                display: 'flex',
                                alignItems: "left",
                                p: 2
                            }}>

                                <Collapse in={isI2c}>
                                    <SelectI2cAddr handleChange={handleI2cAddrChange} addr={addr} error={addrError} />
                                </Collapse>

                                <Collapse in={isSpi}>
                                    <Stack spacing={2} sx={{
                                        flexDirection: 'column',
                                        display: 'flex',
                                        alignItems: "left",
                                    }}>
                                        <SelectSpiMode handleChange={handleSpiModeChange} mode={mode} />
                                        <SelectSpiSpeed handleChange={handleSpeedChange} speed={speed} error={speedError} />
                                    </Stack>
                                </Collapse>
                            </Stack>
                        </Paper>
                    </Collapse>

                    <SelectAttn handleChange={handleAttnChange} attn={attn}/>

                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        <Fab color="primary" aria-label="reset" onClick={() => ResetDefault()}>
                            <RefreshIcon />
                        </Fab>
                        <Fab variant="extended" color="primary" aria-label="connect" onClick={() => UpdateSettings()}>
                            Connect
                        </Fab>
                    </Box>
                </Stack>
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
        return <ConnectionWidget/>;
    }
}
