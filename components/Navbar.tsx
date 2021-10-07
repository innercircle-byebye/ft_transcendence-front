import React, { VFC } from "react";
import Dropdown from "./Dropdown";

const Navbar: VFC = () => {
  return (
    <div className="flex flex-row h-auto bg-blue-100">
      <div className="flex-grow w-16 justify-start">image</div>
      <div className="flex flex-row justify-center">
        <div className="w-16">list 1</div>
        <div className="w-16">list 2</div>
        <div className="w-16">list 3</div>
        <div className="w-16">list 4</div>
      </div>
      <div className="flex flex-grow justify-end">
        <div className="w-16">ID</div>
        <Dropdown></Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
