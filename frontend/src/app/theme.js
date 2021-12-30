import {createTheme} from "@mui/material";

export default createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ff412c",
            contrastText: "#000"
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
        },
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    padding: "8px 15px"
                }
            }
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    transform: "translateX(-12px)"
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    padding: "5px 15px"
                }
            }
        },
    }
});