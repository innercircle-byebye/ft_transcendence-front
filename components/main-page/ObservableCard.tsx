import useSWR from 'swr';
// import FriendItem from '@/components/main-page/FriendItem';
import { IGameRoom } from '@/typings/db';
import fetcher from '@/utils/fetcher';

const ObservableCard = () => {
  const { data: observableData } = useSWR<IGameRoom>('/api/game/observable', fetcher);

  return (
    <div className="rounded-xl bg-yellow-300 text-center flex flex-grow flex-col space-y-2">
      {/* title */}
      {/* <div className="text-white font-medium text-xl pt-3 pb-2">접속중인 친구목록</div> */}
      {/* content list */}
      <div className="flex flex-col  mx-4 py-2 space-y-2">
        {/* {friendData?.map((item: IUser) => {
          if (item.status === 'offline' || item.status === 'not_registed') {
            return null;
          }
          return <FriendItem key={item.userId} nickname={item.nickname} />;
        })} */}
        <p>{observableData?.title}</p>
        <p>{observableData?.gameMembers.find((v) => v.status === 'player1')?.nickname}</p>
        <p>{observableData?.gameMembers.find((v) => v.status === 'player2')?.nickname}</p>
      </div>
    </div>
  );
};

export default ObservableCard;
