import Link from "next/link";
import React, { VFC } from "react";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

interface IListItem {
  name: string;
  href: string;
  current: boolean;
}

const Navbar: VFC = () => {
  // navlist component
  const NavList = (props: { list: IListItem[] }) => {
    const lists = props.list;
    const listItems = lists.map((item: IListItem) => (
      <Link key={item.name} href={item.href}>
        <a>{item.name}</a>
      </Link>
    ));

    return <>{listItems}</>;
  };

  // list
  // const ref = useRef(initialValue)
  const navigationList: IListItem[] = [
    { name: "HOME", href: "/", current: true },
    { name: "PLAY", href: "/", current: false },
    { name: "RANK", href: "/", current: false },
    { name: "CHAT", href: "/", current: false },
  ];

  return (
    <div className="flex flex-row flex-wrap px-12 py-3 bg-blue-100">
      <div className="px-6 justify-start">Logo image</div>
      <div className="px-12 mx-12 flex flex-row">
        <div className="mx-6">
          {/* <Link href="/">
            <a>HOME</a>
          </Link> */}
          {navigationList.map((item) => (
            <Link key={item.name} href={item.href}>
              <a>{item.name}</a>
            </Link>
          ))}
          {/* <NavList list={navigationList} /> */}
        </div>
        <div className="mx-6">
          {/* <Link href="/">
            <a>PLAY</a>
          </Link> */}
          {navigationList.map((item) => (
            <Link key={item.name} href={item.href}>
              <a>{item.name}</a>
            </Link>
          ))}
          {/* <NavList list={navigationList} /> */}
        </div>
        <div className="mx-6">
          {navigationList.map((item) => (
            <Link key={item.name} href={item.href}>
              <a>{item.name}</a>
            </Link>
          ))}
          {/* <NavList list={navigationList} /> */}
          {/* <Link href="/">
            <a>RANK</a>
          </Link> */}
        </div>
        <div className="mx-6">
          {/* <NavList list={navigationList} /> */}
          {navigationList.map((item) => (
            <Link key={item.name} href={item.href}>
              <a>{item.name}</a>
            </Link>
          ))}
          {/* <Link href="/">
            <a>CHAT</a>
          </Link> */}
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
