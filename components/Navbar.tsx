import Link from "next/link";
import React, { VFC } from "react";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

const Navbar: VFC = () => {
  return (
    <div className="flex flex-row h-auto bg-blue-100 justify-between">
      <div className="w-auto">Logo image</div>
      <div className="flex flex-row">
        <div className="w-16">
          <Link href="/TestSamplePage">list 1</Link>
        </div>
        <div className="w-16">
          <Link href="/TestSamplePage">list 2</Link>
        </div>
        <div className="w-16">
          <Link href="/TestSamplePage">list 3</Link>
        </div>
        <div className="w-16">
          <Link href="/TestSamplePage">list 4</Link>
        </div>
      </div>
      <div className="focus:border-indigo-500">
        <SearchInput></SearchInput>
      </div>
      <div className="flex">
        <div className="w-16">ID</div>
        <Dropdown></Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
