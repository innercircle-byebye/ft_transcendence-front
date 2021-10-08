import { Menu } from "@headlessui/react";
import Link from "next/link";
import { FC, VFC } from "react";

export default function Dropdown(){
  return (
    <div className="w-16">
      <Menu>
        <Menu.Button className="ml-2 bg-color-500">
          <MenuIcon></MenuIcon>
        </Menu.Button>
        <Menu.Items className="w-16 divide-y divide-fuchsia-300">
          <div className="group hover:bg-white hover:border-transparent">
            <div className="px-1 flex flex-col">
              <Menu.Item>
                {({ active }) => (
                  <Link href="/profile">
                    {/* 여기에 border 추가하면 될 듯합니다. */}
                    <a
                      className={`${
                        active
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      Profile
                    </a>
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 flex flex-col">
              <Menu.Item>
                {({ active }) => (
                  <Link href="/history">
                    <a className={`${active && "bg-blue-500"}`}>History</a>
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 flex flex-col">
              <Menu.Item>
                {({ active }) => (
                  <Link href="/logout">
                    <a className={`${active && "bg-blue-500"}`}>Logout</a>
                  </Link>
                )}
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
