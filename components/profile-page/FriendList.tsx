import React, { VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';
import FriendItem from './FriendItem';

// interface IProps {
//   userId: number;
//   perPage: number;
//   page: number;
// }

const FriendList: VFC = () => {
  const { data: friendData } = useSWR<IUser[]>('/api/friend/list');

  return (
    <div className="space-y-3">
      {friendData?.map((data) => (
        <>
          <FriendItem friendData={data} listType="friendList" />
        </>
      ))}
    </div>
  );
};

export default FriendList;
