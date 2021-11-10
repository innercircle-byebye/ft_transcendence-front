import React, { VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';
import FriendItem from './FriendItem';
import fetcher from '@/utils/fetcher';

// interface IProps {
//   userId: number;
//   perPage: number;
//   page: number;
// }

const FriendWaitList: VFC = () => {
  const { data: friendWaitData } = useSWR<IUser[]>('/api/friend/wait', fetcher);

  return (
    <div className="space-y-3">
      {friendWaitData?.map((data) => (
        <>
          <FriendItem friendData={data} listType="friendWaitList" />
        </>
      ))}
    </div>
  );
};

export default FriendWaitList;
