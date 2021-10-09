import Link from "next/link";
import Image from "next/image";
import React, { VFC } from "react";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

interface IListItem {
  name: string;
  href: string;
  current: boolean;
}

/*
// navlist component
const NavList = (props: { list: IListItem[] }) => {
  const lists = props.list;
  const listItems = lists.map((item: IListItem) => (
    <div key={item.name} className="mx-10">
      <Link href={item.href}>
        <a>{item.name}</a>
      </Link>
    </div>
  ));

  return <>{listItems}</>;
};
*/

const Navbar: VFC = () => {
  // list 향후 State 로 관리해야합니다.
  const navigationList: IListItem[] = [
    { name: "HOME", href: "/", current: true },
    { name: "PLAY", href: "/", current: false },
    { name: "RANK", href: "/", current: false },
    { name: "CHAT", href: "/", current: false },
  ];

  return (
    <div className="flex flex-row flex-wrap px-12 py-3 bg-blue-100">
      <div className="px-6 justify-start">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={"100"}
          height={"21"}
          objectFit="contain"
        />
      </div>

      <div className="px-12 mx-6 flex flex-row flex-wrap">
        {/* <NavList list={navigationList} /> */}
        {navigationList.map((item: IListItem) => (
          <div key={item.name} className="mx-10">
            <Link href={item.href}>
              <a>{item.name}</a>
            </Link>
          </div>
        ))}
      </div>
      <div className="px-12">
        <div className="justify-center">
          <SearchInput />
        </div>
      </div>
      <div className="flex flex-auto flex-wrap justify-end">
        <div className="mx-2">ID</div>
        <Dropdown />
      </div>
    </div>
  );
};

export default Navbar;
