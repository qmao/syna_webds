import { createContext } from 'react';

export const UserContext = createContext({
    interfaces: ["i2c"],
    i2cAddr: 55,
    spiMode: -1,
    spiSpeed: 333,
    attn: false,
});