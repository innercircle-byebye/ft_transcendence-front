import { Menu } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/solid';
import axios from 'axios';
import router from 'next/router';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

// DropdownMenuButton -> UserInfoMenu 로 변경하겠습니다.
// const DropdownMenuButton = () => {
const UserInfoMenu = () => {
  const onClickLogout = useCallback(
    (e) => {
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
    },
    [],
  );

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
              <a className={`${active && 'bg-blue-500 text-white'}`} href="#">
                Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a className={`${active && 'bg-blue-500 text-white'}`} href="#">
                History
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a className={`${active && 'bg-blue-500 text-white'}`} href="#">
                <button onClick={onClickLogout}>
                Log out
                </button>
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default UserInfoMenu;
