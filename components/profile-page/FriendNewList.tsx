import React, { VFC } from 'react';
import useSWR from 'swr';
import Scrollbars from 'react-custom-scrollbars-2';
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
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {friendNewData?.map((data) => (
          <>
            <div className="py-1">
              <FriendItem friendData={data} listType="friendList" />
            </div>
          </>
        ))}
      </Scrollbars>
    </div>
  );
};

export default FriendNewList;
