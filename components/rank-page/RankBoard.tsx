import type { VFC } from 'react';
import RankPagination from '@/components/rank-page/RankPagination';

interface IProps {
  userId: number;
}

const dummyRankDatas = [
  { rankId: 1, nickname: 'Jane', experience: 30000 },
  { rankId: 2, nickname: 'John', experience: 20000 },
  { rankId: 3, nickname: 'Tom1', experience: 20000 },
  { rankId: 4, nickname: 'Tom2', experience: 20000 },
  { rankId: 5, nickname: 'Tom3', experience: 20000 },
  { rankId: 6, nickname: 'Tom4', experience: 20000 },
  { rankId: 7, nickname: 'Tom5', experience: 20000 },
  { rankId: 8, nickname: 'Tom6', experience: 20000 },
  { rankId: 9, nickname: 'Tom7', experience: 20000 },
  { rankId: 10, nickname: 'Tom8', experience: 20000 },
  { rankId: 11, nickname: 'Tom9', experience: 20000 },
  { rankId: 12, nickname: 'Tom10', experience: 20000 },
  { rankId: 13, nickname: 'Tom11', experience: 20000 },
];

const paginationData = {
  totalPage: 5,
  currentPage: 1,
};

const RankContentRight: VFC<IProps> = ({ userId }) => (
  <div className="p-4 rounded-md bg-gray-300 ">
    <div className="text-lg">
      <ul>
        <li>{`Rank | Name | Point (temp: ${userId})`}</li>
        {dummyRankDatas.map((rankData) => (
          <li key={rankData.nickname}>
            {`${rankData.rankId} | ${rankData.nickname} | ${rankData.experience}`}
          </li>
        ))}
      </ul>
    </div>
    <div className="flex justify-center">
      <RankPagination paginationData={paginationData} />
    </div>
  </div>
);

export default RankContentRight;
