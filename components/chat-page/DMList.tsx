import { useCallback, useState, VFC } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';

const DMList: VFC = () => {
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(
    userData ? 'http://localhost:3000/api/members' : null,
    fetcher,
  );

  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <div className="border-2 border-sky-700 bg-sky-50 rounded-lg w-full h-auto p-3 space-y-3">
      <div className="text-gray-800 font-semibold text-xl flex items-center">
        <button type="button" onClick={toggleChannelCollapse} className="px-1">
          {channelCollapse ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
        DMs
      </div>
      <div className="flex flex-col space-y-1">
        {!channelCollapse
          && memberData?.map((member) => (
            <span
              key={member.intraUsername}
              className="w-full px-2 py-1 border-b-2 flex justify-between items-center hover:bg-gray-300"
            >
              <div className="flex flex-row items-center space-x-1">
                <div className="relative bg-blue-300 w-5 h-5 rounded-full shadow-lg mr-2">
                  <Image
                    src={member.imagePath}
                    alt="previewImage"
                    objectFit="cover"
                    layout="fill"
                    className="rounded-full"
                  />
                </div>
                {member.nickname}
                {member.intraUsername === userData?.intraUsername && <span> (나)</span>}
                {member.status === 'online' ? (
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                ) : <div className="w-2 h-2 rounded-full bg-red-600" />}
              </div>
            </span>
          ))}
      </div>
      <button type="button" className="w-full bg-sky-700 text-sky-100 hover:bg-gray-300 hover:text-sky-700 flex flex-row justify-between items-center rounded-full px-3 py-1">
        <div>Search members</div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default DMList;
