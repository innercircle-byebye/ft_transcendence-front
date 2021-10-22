import useSWR from 'swr';
import FriendItem from '@/components/main-page/FriendItem';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

const OnlineFriendList = () => {
  // 이건 어떻게 해결해야합니까?
  /* axios 를 사용하면 userData type 이 array 가 아니라고 나옵니다.
  const userData: IUser[] = axios
    .get('http://localhost:3000/api/members')
    .then((response) => response.data);
  */
  const { data: userData } = useSWR<IUser[]>(
    'http://localhost:3000/api/members',
    fetcher,
  );

  return (
    <div className="rounded-xl bg-sky-700 text-center flex flex-col space-y-2 w-1/4">
      {/* title */}
      <div className="text-white py-2">접속중인 친구목록</div>
      {/* content list */}
      <div className="flex flex-col space-y-4 mx-4 py-2">
        <div className="space-y-2">
          {userData?.map((item: IUser) => (
            <FriendItem key={item.userId} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnlineFriendList;
