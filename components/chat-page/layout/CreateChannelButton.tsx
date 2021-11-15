import Link from 'next/link';
import { VFC } from 'react';

const CreateChannelButton: VFC = () => (
  <div className="border-2 border-gray-500 bg-white rounded-2xl p-2 flex flex-row items-center space-x-2">
    <Link href="/chat/create-channel">
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-sky-700 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </Link>
    <div>Create New</div>
  </div>
);

export default CreateChannelButton;
