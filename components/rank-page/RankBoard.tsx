import useSWR from 'swr';
import type { VFC } from 'react';
import fetcher from '@/utils/fetcher';
import RankPagination from './RankPagination';
import type { IRank } from '@/typings/db';

interface IProps {
  userId: number;
}

const paginationData = {
  totalPage: 5,
  currentPage: 1,
};

const RankContentRight: VFC<IProps> = ({ userId }) => {
  const { data: ranks } = useSWR<IRank[]>('/api/rank', fetcher);
  return (
    <div className="p-4 rounded-md bg-gray-300 ">
      <div className="text-lg">
        <ul>
          <li>{`Rank | Name | Experience (temp: ${userId})`}</li>
          {ranks
            && ranks.map(({ user, experience }, index) => (
              <li key={user.nickname}>
                {`${index + 1} | ${user.nickname} | ${experience}`}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex justify-center">
        <RankPagination paginationData={paginationData} />
      </div>
    </div>
  );
};

export default RankContentRight;
