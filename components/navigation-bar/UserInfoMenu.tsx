import axios from 'axios';
import Link from 'next/link';
import router from 'next/router';
import React, { useCallback, VFC } from 'react';
import { toast } from 'react-toastify';
import { Menu } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/solid';
import useSWR from 'swr';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import useSocket from '@/hooks/useSocket';

const UserInfoMenu: VFC = () => {
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  // const { socket: mainSocket } = useSocket('main');
  const { disconnect } = useSocket('main');

  const onClickLogout = useCallback((e) => {
    e.preventDefault();
    axios
      .get('/auth/logout')
      .then(() => {
        router.push('/login');
        disconnect();
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [disconnect]);

  if (!userData) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="relative text-white z-20">
      <Menu>
        <Menu.Button className="flex items-center">
          <MenuIcon className="w-8 h-8" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 flex flex-col divide-y divide-gray-100 bg-gray-100 text-blue-900 font-medium">
          <Menu.Item>
            {({ active }) => (
              <div className={`${active && 'bg-blue-500 text-white'} py-1`}>
                <Link href={`/profile/${userData.nickname}`}>
                  <a className="px-3">Profile</a>
                </Link>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className={`${active && 'bg-blue-500 text-white'} py-1`}>
                <Link href={`/history/${userData.nickname}`}>
                  <a className="px-3">History</a>
                </Link>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className={`${active && 'bg-blue-500 text-white'} py-1`}>
                <a className="px-3">
                  <button className="font-medium" type="button" onClick={onClickLogout}>
                    Logout
                  </button>
                </a>
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default UserInfoMenu;
