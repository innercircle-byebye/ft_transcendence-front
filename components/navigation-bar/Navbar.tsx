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

// interface IProp {
//   userNickName: string;
// }

// const Navbar: VFC<IProp> = ({ userNickName }) => {
const Navbar: VFC = () => {
  // list 향후 State 로 관리해야합니다.
  const navigationList: IListItem[] = [
    { name: 'HOME', href: '/', current: true },
    { name: 'PLAY', href: '/play', current: false },
    { name: 'RANK', href: '/rank', current: false },
    { name: 'CHAT', href: '/chat', current: false },
  ];

  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  console.log('userData:', userData);

  return (
    <div className="flex flex-row flex-wrap px-12 py-3 bg-sky-700 h-1/12 text-white">
      {/* 이미지 */}
      <div className="px-6">
        <Image
          src="/Logo.png"
          alt="Logo"
          width="100"
          height="20"
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
        <div className="mx-2">{userData?.nickname}</div>
        <UserInfoMenu />
      </div>
    </div>
  );
};

export default Navbar;
