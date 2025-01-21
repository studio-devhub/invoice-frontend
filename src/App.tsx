import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import InvoiceForm from "./components/InvoiceForm";
import Layout from "./components/Layout";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <InvoiceForm isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
