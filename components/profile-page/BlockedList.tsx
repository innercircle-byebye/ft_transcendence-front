import React, { VFC } from 'react';
import useSWR from 'swr';
import Scrollbars from 'react-custom-scrollbars-2';
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
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {blockedData?.map((data) => (
          <>
            <div className="py-1">
              <BlockedItem blockedData={data} />
            </div>
          </>
        ))}
      </Scrollbars>
    </div>
  );
};

export default BlockedList;
