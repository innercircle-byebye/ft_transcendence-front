import { Menu } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';

// DropdownMenuButton -> UserInfoMenu 로 변경하겠습니다.
// const DropdownMenuButton = () => {
const UserInfoMenu = () => (
  <div className="relative">
    <Menu>
      <Menu.Button>
        {/* MenuIcon size 를 어떻게 맞춰야하는지 모르겠습니다... */}
        <MenuIcon className="w-12 h-1/12 px-4" />
      </Menu.Button>
      <Menu.Items className="absolute w-20 flex flex-col divide-y divide-gray-50 bg-white">
        <Menu.Item>
          {({ active }) => (
            <Link href="/">
              <a className={`${active && 'bg-blue-500 text-white'}`}>
                Profile
              </a>
            </Link>
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
            <Link href="/">
              <a className={`${active && 'bg-blue-500 text-white'}`}>
                Log out
              </a>
            </Link>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  </div>
);

export default UserInfoMenu;
