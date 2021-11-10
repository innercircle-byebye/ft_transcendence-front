import React, { VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';
import FriendItem from './FriendItem';

// interface IProps {
//   userId: number;
//   perPage: number;
//   page: number;
// }

const BlockedList: VFC = () => {
  const { data: blockedData } = useSWR<IUser[]>('/api/block/list');

  return (
    <div className="space-y-3">
      {blockedData?.map((data) => (
        <>
          <li>
            <FriendItem friendData={data} listType="blockedList" />
          </li>
        </>
      ))}
    </div>
  );
};

export default BlockedList;
