import React, { VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';

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
            {`${data.nickname} ${data.status}`}
          </li>
        </>
      ))}
    </div>
  );
};

export default BlockedList;
