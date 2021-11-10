import React, { VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';
import FriendItem from './FriendItem';

// interface IProps {
//   userId: number;
//   perPage: number;
//   page: number;
// }

const FriendWaitList: VFC = () => {
  const { data: friendWaitData } = useSWR<IUser[]>('/api/friend/wait');

  return (
    <div className="space-y-3">
      {friendWaitData?.map((data) => (
        <>
          <li>
            <FriendItem friendData={data} listType="friendWaitList" />
          </li>
        </>
      ))}
    </div>
  );
};

export default FriendWaitList;
