import useSWR from 'swr';
import type { VFC } from 'react';
import fetcher from '@/utils/fetcher';
import type { IRank, IUser } from '@/typings/db';

interface IProps {
  rankNumber: number;
  rankData: IRank;
  textColor?: string;
}

const RankItem: VFC<IProps> = ({
  rankData,
  rankNumber,
  textColor = 'text-sky-700',
}) => {
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);

  return (
    <div
      className={`${textColor} bg-amber-50 text-xl rounded-md px-5 py-2 grid grid-cols-4 justify-items-center m-3 ${
        userData?.userId === rankData.user.userId && 'bg-amber-200'
      }`}
    >
      <span>{rankNumber}</span>
      <span>{rankData.user.nickname}</span>
      <span>{`${rankData.winCount}승 ${rankData.loseCount}패`}</span>
      <span>{rankData.experience}</span>
    </div>
  );
};
export default RankItem;
