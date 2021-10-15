import Link from "next/link";
import Image from "next/image";
import React, { VFC } from "react";
import SearchUserNicknameInputBox from "./SearchUserNicknameInputBox";
import UserInfoMenu from "./UserInfoMenu";

interface IListItem {
  name: string;
  href: string;
  current: boolean;
}

const Navbar: VFC = () => {
  // list 향후 State 로 관리해야합니다.
  const navigationList: IListItem[] = [
    { name: "HOME", href: "/", current: true },
    { name: "PLAY", href: "/", current: false },
    { name: "RANK", href: "/", current: false },
    { name: "CHAT", href: "/chat", current: false },
  ];

  return (
    <div className="flex flex-row flex-wrap px-12 py-3 bg-blue-100 h-1/12">
      {/* 이미지 */}
      <div className="px-6 justify-start">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={"100"}
          height={"21"}
          objectFit="contain"
        />
      </div>
      {/* page lists */}
      <div className="px-12 mx-6 flex flex-row flex-wrap">
        {navigationList.map((item: IListItem) => (
          <div key={item.name} className="mx-10">
            <Link href={item.href}>
              <a>{item.name}</a>
            </Link>
          </div>
        ))}
      </div>
      {/* user search input box */}
      <div className="px-12">
        <div className="justify-center">
          <SearchUserNicknameInputBox />
        </div>
      </div>
      {/* ID 와 Dropdown button */}
      <div className="flex flex-auto flex-wrap justify-end">
        <div className="mx-2">ID</div>
        <UserInfoMenu />
      </div>
    </div>
  );
};

export default Navbar;
