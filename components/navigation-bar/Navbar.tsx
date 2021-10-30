import Link from 'next/link';
import Image from 'next/image';
import React, { VFC } from 'react';
import useSWR from 'swr';
import SearchUserNicknameInputBox from './SearchUserNicknameInputBox';
import UserInfoMenu from './UserInfoMenu';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IListItem {
  name: string;
  href: string;
  current: boolean;
}

const Navbar: VFC = () => {
  // list 향후 State 로 관리해야합니다.
  const navigationList: IListItem[] = [
    { name: 'HOME', href: '/', current: true },
    { name: 'PLAY', href: '/play', current: false },
    { name: 'RANK', href: '/rank', current: false },
    { name: 'CHAT', href: '/chat', current: false },
  ];

  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);

  return (
    <div className="flex flex-row flex-wrap justify-evenly items-center bg-sky-700 h-auto py-5 text-white">
      {/* 이미지 */}
      <div className="px-6">
        <Link href="/">
          <a>
            <Image
              src="/Logo.png"
              alt="Logo"
              width="150"
              height="40"
              objectFit="contain"
            />
          </a>
        </Link>
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
        <SearchUserNicknameInputBox />
      </div>
      {/* ID 와 Dropdown button */}
      <div className="flex items-center">
        <div className="mx-2">{userData?.nickname}</div>
        <UserInfoMenu />
      </div>
    </div>
  );
};

export default Navbar;
