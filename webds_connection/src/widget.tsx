import { ReactWidget } from '@jupyterlab/apputils';
import React /*, { useEffect, useContext, useState, useRef }*/ from 'react';

//import { UserContext } from './context';
//import { requestAPI } from './handler';

import {
    MenuItem, InputLabel, Stack, Collapse, Slider, Paper,
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


const PROTOCOL=["Auto Scan", "I2C", "SPI", "PHONE"]
//const PROTOCOL_GENERAL = ["attn"]
//const PROTOCOL_POWER = ["vdd", "vio", "vled"]
//const PROTOCOL_SPI = ["address"]
//const PROTOCOL_I2C = ["mode", "speed"]
//const PROTOCOL_Phone = ["phone1", "phone2"]


function SelectSpiMode() {
    const [mode, setMode] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setMode(event.target.value);
    };

    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="connection-select-spi-mode">SPI Mode</InputLabel>
                <Select
                    labelId="connection-select-spi-mode"
                    id="connection-select-spi"
                    value={mode}
                    onChange={handleChange}
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
            </FormControl>
        </div>
    );
}

function SelectAttn() {
    const [attn, setAttn] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAttn(event.target.value);
    };

    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="connection-select-spi-mode">Attn</InputLabel>
                <Select
                    labelId="connection-select-spi-mode"
                    id="connection-select-spi"
                    value={attn}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>Auto</em>
                    </MenuItem>
                    <MenuItem value={"Interrupt"}>Interrupt</MenuItem>
                    <MenuItem value={"Polling"}>Polling</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
function SelectI2cAddrSlider() {
    const [value, setValue] = React.useState<number | string | Array<number | string>>(
        30,
    );

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue);
    };

    return (
        <Stack spacing={1} sx={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: "center",
            p:1
        }}>
            <Typography id="input-i2c-address" sx={{ pt: 1 }}>
                Slave Address
            </Typography>
            
            <Slider
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                valueLabelDisplay="on"
                step={1}
                min={0}
                max={0xFF}
                sx={{ width: 0x100, ml: 3 }}
            />
        </Stack>
    );
}

export default function VerticalTabs()
{
    //const context = useContext(UserContext);
    const [protocol, setProtocol] = React.useState(PROTOCOL[0]);
    const [isI2c, setI2c] = React.useState(false);
    const [isSpi, setSpi] = React.useState(false);
    const [showProtocol, setShowProtocol] = React.useState(false);
    //const [isPower, setPower] = React.useState(true);
    //const [isAttn, setAttn] = React.useState(true);

    const handleChange = (event: SelectChangeEvent<typeof protocol>) => {
        console.log(event.target.value);
        setProtocol(event.target.value);
        let i2c = false;
        let spi = false;

        if (event.target.value == "I2C") {
            i2c = true;
            spi = false;
        }
        else if (event.target.value == "SPI") {
            i2c = false;
            spi = true;
        }

        setI2c(i2c);
        setSpi(spi);
        setShowProtocol(i2c || spi);
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
                                value={protocol}
                                label="Protocol"
                                onChange={handleChange}
                            >
                                { PROTOCOL.map((value) => {
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
                                    <SelectI2cAddrSlider />
                                </Collapse>

                                <Collapse in={isSpi}>
                                    <Stack spacing={2} sx={{
                                        flexDirection: 'column',
                                        display: 'flex',
                                        alignItems: "left",
                                    }}>
                                        <SelectSpiMode />
                                        <TextField
                                            id="outlined-number"
                                            label="Spi Speed"
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            />
                                    </Stack>
                                </Collapse>
                            </Stack>
                        </Paper>
                    </Collapse>

                    <SelectAttn />

                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        <Fab color="primary" aria-label="reset">
                            <RefreshIcon />
                        </Fab>
                        <Fab variant="extended" color="primary" aria-label="connect">
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
        return <VerticalTabs/>;
    }
}
