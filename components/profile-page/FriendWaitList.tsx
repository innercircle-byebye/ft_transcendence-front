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

const FriendWaitList: VFC = () => {
  const { data: friendWaitData } = useSWR<IUser[]>('/api/friend/wait', fetcher);

  return (
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {friendWaitData?.map((data) => (
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

export default FriendWaitList;
