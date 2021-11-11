import React, { useEffect, useState, VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';
import FriendItem from './FriendItem';
import fetcher from '@/utils/fetcher';

// interface IProps {
//   userId: number;
//   perPage: number;
//   page: number;
// }

const FriendList: VFC = () => {
  const [dataTest, setData] = useState<IUser[] | null>(null);
  const { data: friendData } = useSWR<IUser[]>('/api/friend/list', fetcher);

  useEffect(() => {
    if (friendData) {
      console.log(friendData);
      setData(friendData);
    }
  }, [friendData]);
  return (
    <div className="space-y-3">
      {dataTest?.map((data) => (
        <>
          <FriendItem friendData={data} listType="friendList" />
        </>
      ))}
    </div>
  );
};

export default FriendList;
