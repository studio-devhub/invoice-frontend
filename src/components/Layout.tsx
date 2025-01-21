import { Box, styled } from "@mui/material";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BodyWraper>
      <AppWrapper>{children}</AppWrapper>
    </BodyWraper>
  );
};

export default Layout;

const BodyWraper = styled(Box)(() => ({
  display: "flex",
  padding: "2rem",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 400,
}));
const AppWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "700px",
}));
