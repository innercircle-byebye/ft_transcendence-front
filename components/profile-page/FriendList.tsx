import React, { VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';

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
          <li>
            {`${data.nickname} ${data.status}`}
          </li>
        </>
      ))}
    </div>
  );
};

export default FriendList;
