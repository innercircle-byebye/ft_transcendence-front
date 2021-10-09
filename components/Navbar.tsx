import Link from "next/link";
import React, { VFC } from "react";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

const Navbar: VFC = () => {
  return (
    // navbar 높이는 고정 크기를 갖도록
    <div className="flex flex-row px-3 py-3 h-12 bg-blue-100 justify-between">
      <div className="">Logo image</div>
      <div className="space-x-6 flex flex-row">
        <div className="w-16">
          <Link href="/">
            <a>HOME</a>
          </Link>
        </div>
        <div className="w-16">
          <Link href="/">
            <a>PLAY</a>
          </Link>
        </div>
        <div className="w-16">
          <Link href="/">
            <a>RANK</a>
          </Link>
        </div>
        <div className="w-16">
          <Link href="/">
            <a>CHAT</a>
          </Link>
        </div>
      </div>
      <div className="">
        <SearchInput></SearchInput>
      </div>
      <div className="flex w-1/12 justify-end">
        <div className="w-16">ID</div>
        <Dropdown></Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
