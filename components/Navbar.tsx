import Link from "next/link";
import React, { VFC } from "react";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

const Navbar: VFC = () => {
  return (
    <div className="flex flex-row flex-wrap px-12 py-3 bg-blue-100">
      <div className="px-6 justify-start">Logo image</div>
      <div className="px-12 mx-12 flex flex-row">
        <div className="mx-6">
          <Link href="/">
            <a>HOME</a>
          </Link>
        </div>
        <div className="mx-6">
          <Link href="/">
            <a>PLAY</a>
          </Link>
        </div>
        <div className="mx-6">
          <Link href="/">
            <a>RANK</a>
          </Link>
        </div>
        <div className="mx-6">
          <Link href="/">
            <a>CHAT</a>
          </Link>
        </div>
      </div>
      <div className="px-12 mx-12">
        <div className="justify-center">
        <SearchInput />
        </div>
      </div>
      <div className="flex flex-auto justify-end">
        <div className="mx-2">ID</div>
        <Dropdown />
      </div>
    </div>
  );
};

export default Navbar;
