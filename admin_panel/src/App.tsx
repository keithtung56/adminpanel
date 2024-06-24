import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme as createMuiTheme,
} from "@mui/material";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { AuthProvider } from "./context";

const MuiTheme = createMuiTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={MuiTheme}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

export default App;
