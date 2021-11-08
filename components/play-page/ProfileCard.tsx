import { VFC } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { IGameResultWinRate, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  userInitialData: IUser;
}

const ProfileCard: VFC<IProps> = ({ userInitialData }) => {
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher, {
    initialData: userInitialData,
  });
  const { data: winData } = useSWR<IGameResultWinRate>(`/api/game/${userInitialData.userId}/win_rate`, fetcher);

  return (
    <div className="py-10 px-8 rounded-md bg-gray-200">
      <div className="flex justify-center mb-4 p-2">
        <div className="w-60 h-60 rounded-full overflow-hidden">
          <Image src="/favicon.ico" width={300} height={300} alt="Avatar" />
        </div>
      </div>
      <div className="py-2 text-center mb-4">
        <h2 className="text-5xl">{userData?.nickname}</h2>
      </div>
      <div className="py-2 text-center flex flex-col bg-gray-400 mx-16 rounded-md">
        <p className="text-xl">{`승률: ${winData?.winRate}%`}</p>
        <p className="text-xl">{`${winData?.totalPlayCount}전 ${winData?.winCount}승 ${winData?.loseCount}패`}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
