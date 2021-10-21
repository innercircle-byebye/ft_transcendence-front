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
    <div className="relative">
      <Menu>
        <Menu.Button>
          {/* MenuIcon size 를 어떻게 맞춰야하는지 모르겠습니다... */}
          <MenuIcon className="w-12 h-1/12 px-4" />
        </Menu.Button>
        <Menu.Items className="absolute w-20 flex flex-col divide-y divide-gray-50 bg-white">
          <Menu.Item>
            {({ active }) => (
              <div className={`${active && 'bg-blue-500 text-white'}`}>
                <Link href="/">
                  <a>Profile</a>
                </Link>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link href="/">
                <a className={`${active && 'bg-blue-500 text-white'}`}>
                  History
                </a>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className={`${active && 'bg-blue-500 text-white'}`}>
                <Link href="/">
                  <a>
                    <button type="button" onClick={onClickLogout}>
                      Log out
                    </button>
                  </a>
                </Link>
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default UserInfoMenu;
