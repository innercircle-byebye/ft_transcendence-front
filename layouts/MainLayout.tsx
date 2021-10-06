import React, { FC } from "react";
import Navbar from "../components/navbar";

const MainLayout: FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
