import {
    createTheme,
} from "@mui/material/styles";

const webdsTheme = createTheme({
    palette: {
        primary: {
            main: "#007DC3"
        },
        secondary: {
            main: "#90CAF9"
        },
    },

    typography: {
        fontFamily: [
            'Arial',
            '"Segoe UI"',
            '-apple-system',
            'BlinkMacSystemFont',
            'Roboto',
            '"Helvetica Neue"',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: { padding: 5 },
            },
        },
        MuiAvatar: {
            defaultProps: {
                sx: {
                    bgcolor: "#007DC3"
                },
            }
        }
    },
});


export default webdsTheme