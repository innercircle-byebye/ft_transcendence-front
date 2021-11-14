import React, { useEffect, useState, VFC } from 'react';
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
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {dataTest?.map((data) => (
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

export default FriendList;
