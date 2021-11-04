import Link from 'next/link';
import Image from 'next/image';
import React, { VFC } from 'react';
import useSWR from 'swr';
import SearchUserNicknameInputBox from '@/components/navigation-bar/SearchUserNicknameInputBox';
import UserInfoMenu from '@/components/navigation-bar/UserInfoMenu';
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
    <div className="flex flex-row flex-wrap justify-evenly items-center bg-sky-700 pb-1 text-white">
      {/* 이미지 */}
      <div className="px-6">
        <Link href="/">
          <a>
            <div className="h-16 w-24 relative">
              <Image
                src="/Logo.png"
                alt="Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
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
