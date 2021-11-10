import React, { VFC } from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import BlockedItem from './BlockedItem';

// interface IProps {
//   userId: number;
//   perPage: number;
//   page: number;
// }

const BlockedList: VFC = () => {
  const { data: blockedData } = useSWR<IUser[]>('/api/block/list', fetcher);

  return (
    <div className="space-y-3">
      {blockedData?.map((data) => (
        <>
          <BlockedItem blockedData={data} />
        </>
      ))}
    </div>
  );
};

export default BlockedList;
