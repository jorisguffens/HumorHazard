import {createTheme} from "@mui/material";

export default createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ff412c",
            contrastText: "#fff"
        },
        background: {
            default: "#191414",
            paper: "#191414"
        },
        text: {
            secondary: "#aaa"
        }
    },
    components: {
        MuiInputBase: {
           styleOverrides: {
               root: {
                   background: "#3d3d3d"
               }
           }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: "none",
                    "&:hover": {
                        color: "#ffa399"
                    }
                }
            }
        }
    }
});