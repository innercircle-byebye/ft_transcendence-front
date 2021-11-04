import Image from 'next/image';
import { VFC } from 'react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { IHistory, IUser } from '@/typings/db';

interface Props {
  userData: IUser;
}

const ProfileCard: VFC<Props> = ({ userData }) => {
  // test 전적 정보 받아오는 api 적용
  const { data: history } = useSWR<IHistory>(
    'http://localhost:3000/api/history',
    fetcher,
  );
  console.log('history:', history);

  return (
    <div className="bg-gray-200 flex flex-col space-y-2 text-center rounded-2xl h-1/2">
      <div className="flex justify-center">
        {/* 상위 width 1/5 의 1/2 를 적용하고, 중앙 정렬을 위해서 상위 div 설정했습니다. */}
        <div className="w-56 h-56 py-4 relative">
          <Image
            className="rounded-full"
            src={`${userData.imagePath}`}
            alt="Profile Image"
            layout="fill"
          />
        </div>
      </div>
      <div className="p-1">{userData.nickname}</div>
      <div className="p-1">{`${history?.count}전 ${history?.win}승 ${history?.lose}패`}</div>
      <div className="p-1">{`${(Number(history?.win) / Number(history?.count)) * 100}%`}</div>
    </div>
  );
};

export default ProfileCard;
