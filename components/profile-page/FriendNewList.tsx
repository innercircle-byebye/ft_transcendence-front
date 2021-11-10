import React, { VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';

// interface IProps {
//   userId: number;
//   perPage: number;
//   page: number;
// }

const FriendNewList: VFC = () => {
  const { data: friendNewData } = useSWR<IUser[]>('/api/friend/new');

  return (
    <div className="space-y-3">
      {friendNewData?.map((data) => (
        <>
          <li>
            {`${data.nickname} ${data.status}`}
          </li>
        </>
      ))}
    </div>
  );
};

export default FriendNewList;
