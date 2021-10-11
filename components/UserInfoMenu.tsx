import { Menu } from "@headlessui/react";
import Link from "next/link";
import { MenuIcon } from "@heroicons/react/solid";

// DropdownMenuButton -> UserInfoMenu 로 변경하겠습니다.
// const DropdownMenuButton = () => {
const UserInfoMenu = () => {
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
              <a className={`${active && "bg-blue-500 text-white"}`}>
                <Link href="/">Profile</Link>
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a className={`${active && "bg-blue-500 text-white"}`}>
                <Link href="/">History</Link>
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a className={`${active && "bg-blue-500 text-white"}`}>
                <Link href="/">Log out</Link>
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default UserInfoMenu;
