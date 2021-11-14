import useSWR from 'swr';
import type { VFC } from 'react';
import fetcher from '@/utils/fetcher';
import type { IRank } from '@/typings/db';
import RankPagination from './RankPagination';

interface IProps {
  userId: number | null;
}

const paginationData = {
  totalPage: 5,
  currentPage: 1,
};

const RankContentRight: VFC<IProps> = ({ userId }) => {
  const { data: ranks, error } = useSWR<IRank[]>('/api/game/ranking', fetcher);
  return (
    <div className="p-4 rounded-md bg-gray-300 ">
      <div className="text-lg">
        {ranks && (
          <ul>
            <li>{`Rank | Name | Experience (temp: ${userId ?? 'null'})`}</li>
            {ranks.length > 0 ? (
              ranks.map(({ user, experience }, index) => (
                <li key={user.nickname}>
                  {`${index + 1} | ${user.nickname} | ${experience}`}
                </li>
              ))
            ) : (
              <li>No data.</li>
            )}
          </ul>
        )}
        {error && <div>Something wrong.</div>}
      </div>
      <div className="flex justify-center">
        <RankPagination paginationData={paginationData} />
      </div>
    </div>
  );
};

export default RankContentRight;
