import { Menu } from "@headlessui/react";
import Link from "next/link";
import { MenuIcon } from "@heroicons/react/solid";

const DropdownMenuButton = () => {
  return (
    <Menu>
      <Menu.Button>
        {/* MenuIcon size 를 어떻게 맞춰야하는지 모르겠습니다... */}
        <MenuIcon className="w-12 h-12 px-4" />
      </Menu.Button>
      <Menu.Items className="w-20 px-2 flex flex-col divide-y divide-gray-50 bg-white">
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
  );
};

export default DropdownMenuButton;

{
  /* Profile dropdown */
}
{
  /*
<Menu as="div" className="ml-3 relative">
  <div>
    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
      <span className="sr-only">Open user menu</span>
      <img
        className="h-8 w-8 rounded-full"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
    </Menu.Button>
  </div>
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? "bg-gray-100" : "",
              "block px-4 py-2 text-sm text-gray-700"
            )}
          >
            Your Profile
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? "bg-gray-100" : "",
              "block px-4 py-2 text-sm text-gray-700"
            )}
          >
            Settings
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? "bg-gray-100" : "",
              "block px-4 py-2 text-sm text-gray-700"
            )}
          >
            Sign out
          </a>
        )}
      </Menu.Item>
    </Menu.Items>
  </Transition>
</Menu>;
            */
}
