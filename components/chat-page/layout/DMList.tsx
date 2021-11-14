import React, { useState, VFC } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';
import CollapseButton from './CollapseButton';

const DMList: VFC = () => {
  const router = useRouter();
  const { name } = router.query;
  const { data: dmMembersDatas } = useSWR<IUser[]>(
    '/api/dm/users',
    fetcher,
  );
  const [dmCollapse, setDMCollapse] = useState(false);

  return (
    <div className="border-2 border-sky-700 bg-sky-50 rounded-lg w-full h-auto p-3 space-y-3">
      <div className="text-gray-800 font-semibold text-xl flex items-center">
        <CollapseButton collapse={dmCollapse} setCollapse={setDMCollapse} />
        DMs
      </div>
      <div className="flex flex-col max-h-80 overflow-y-auto">
        {!dmCollapse
          && dmMembersDatas?.map((member) => (
            <Link
              href={`/chat/dm/${member.nickname}`}
              key={member.userId + member.intraUsername}
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
