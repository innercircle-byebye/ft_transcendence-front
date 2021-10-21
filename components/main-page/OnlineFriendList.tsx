import useSWR from 'swr';
import FriendItem from '@/components/main-page/FriendItem';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

const OnlineFriendList = () => {
  const { data: userData } = useSWR<IUser[]>(
    '/api/friend/list',
    fetcher,
  );

  console.log('userData:', userData);

  return (
    <div className="rounded-xl bg-sky-700 text-center flex flex-col space-y-2 w-1/4">
      {/* title */}
      <div className="text-white py-2">접속중인 친구목록</div>
      {/* content list */}
      <div className="flex flex-col space-y-4 mx-4 py-2">
        <div className="space-y-2">
          {userData?.map((item: IUser) => (
            <FriendItem
              key={item.userId}
              nickname={item.nickname}
              status={item.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnlineFriendList;
