import axios from 'axios';
import Link from 'next/link';
import router from 'next/router';
import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { Menu } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/solid';

const UserInfoMenu = () => {
  const onClickLogout = useCallback((e) => {
    e.preventDefault();
    axios
      .get('/auth/logout')
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);

  return (
    <div className="relative text-blue-900">
      <Menu>
        <Menu.Button>
          {/* MenuIcon size 를 어떻게 맞춰야하는지 모르겠습니다... */}
          <MenuIcon className="w-14 h-1/6 px-4" />
        </Menu.Button>
        <Menu.Items className="absolute flex flex-col divide-y divide-gray-100 bg-gray-100">
          <Menu.Item>
            {({ active }) => (
              <div className={`${active && 'bg-blue-500 text-white'} py-1`}>
                <Link href="/">
                  <a className="px-3">Profile</a>
                </Link>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className={`${active && 'bg-blue-500 text-white'} py-1`}>
                <Link href="/">
                  <a className="px-3">History</a>
                </Link>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className={`${active && 'bg-blue-500 text-white'} py-1`}>
                <a className="px-3">
                  <button type="button" onClick={onClickLogout}>
                    Log out
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
