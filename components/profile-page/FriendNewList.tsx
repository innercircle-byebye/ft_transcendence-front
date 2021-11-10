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

const FriendNewList: VFC = () => {
  const { data: friendNewData } = useSWR<IUser[]>('/api/friend/new', fetcher);

  return (
    <div className="space-y-3">
      {friendNewData?.map((data) => (
        <>
          <FriendItem friendData={data} listType="friendNewList" />
        </>
      ))}
    </div>
  );
};

export default FriendNewList;
