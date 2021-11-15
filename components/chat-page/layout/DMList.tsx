import React, { useState, VFC } from 'react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';
import CollapseButton from './CollapseButton';
import EachDM from '@/components/chat-page/dm/EachDM';

const DMList: VFC = () => {
  const { data: dmMembersDatas } = useSWR<IUser[]>('/api/dm/users', fetcher);
  const [dmCollapse, setDMCollapse] = useState(false);
  const { data: blockMemberData } = useSWR<IUser[]>('/api/block/list', fetcher);

  return (
    <div className="border-2 border-sky-700 bg-sky-50 rounded-lg w-full h-auto p-3 space-y-3">
      <div className="text-gray-800 font-semibold text-xl flex items-center">
        <CollapseButton collapse={dmCollapse} setCollapse={setDMCollapse} />
        DMs
      </div>
      <div className="flex flex-col max-h-80 overflow-y-auto">
        {!dmCollapse
          && dmMembersDatas?.map((member) => {
            if (blockMemberData?.map(
              (blockMember) => blockMember.userId,
            ).includes(member.userId)) {
              return null;
            }
            return (
              <EachDM key={member.userId + member.nickname} member={member} />
            );
          })}
      </div>
    </div>
  );
};

export default DMList;
