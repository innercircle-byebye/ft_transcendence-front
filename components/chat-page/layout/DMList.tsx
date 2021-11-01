import React, { useCallback, useState, VFC } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';

const DMList: VFC = () => {
  const router = useRouter();
  const { name } = router.query;
  const { data: dmMembersDatas } = useSWR<IUser[]>(
    '/api/dm/users',
    fetcher,
  );
  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  console.log('test GET /api/dm/users', dmMembersDatas);

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
      <div className="flex flex-col max-h-80 overflow-y-auto">
        {!channelCollapse
          && dmMembersDatas?.map((member) => (
            <Link
              // href={`/chat/dm/${member.nickname}`}
              href={`/chat/dm/${member.userId}`}
              key={member.intraUsername}
            >
              <a>
                <span
                  className={`w-full px-2 py-1.5 border-b-2 flex justify-between hover:bg-gray-300 ${
                    name
                      && name === member.nickname
                      ? 'bg-sky-200'
                      : ''
                  }`}
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
                    {member.status === 'online' ? (
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    )}
                  </div>
                </span>
              </a>
            </Link>
          ))}
        {/* </div> */}
      </div>
    </div>
  );
};

export default DMList;
