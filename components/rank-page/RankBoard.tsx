import Link from 'next/link';
import type { VFC } from 'react';

interface IProps {
  userId: string;
}

const dummyRankDatas = [
  { rank: 1, nickname: 'Jane', xp: 30000 },
  { rank: 2, nickname: 'John', xp: 20000 },
  { rank: 3, nickname: 'Tom1', xp: 20000 },
  { rank: 4, nickname: 'Tom2', xp: 20000 },
  { rank: 5, nickname: 'Tom3', xp: 20000 },
  { rank: 6, nickname: 'Tom4', xp: 20000 },
  { rank: 7, nickname: 'Tom5', xp: 20000 },
  { rank: 8, nickname: 'Tom6', xp: 20000 },
  { rank: 9, nickname: 'Tom7', xp: 20000 },
  { rank: 10, nickname: 'Tom8', xp: 20000 },
  { rank: 11, nickname: 'Tom9', xp: 20000 },
  { rank: 12, nickname: 'Tom10', xp: 20000 },
  { rank: 13, nickname: 'Tom11', xp: 20000 },
];

const dummyPaginationLinkTexts = ['<', '1', '2', '3', '4', '5', '>'];

const RankContentRight: VFC<IProps> = ({ userId }) => (
  <div className="p-4 rounded-md bg-gray-300 ">
    <div className="text-lg">
      <ul>
        <li>{`Rank | Name | Point (temp: ${userId})`}</li>
        {dummyRankDatas.map((rankData) => (
          <li key={rankData.nickname}>
            {`${rankData.rank} | ${rankData.nickname} | ${rankData.xp}`}
          </li>
        ))}
      </ul>
    </div>
    <div className="flex justify-center">
      <div className="inline-block rounded-md border border-gray-50 overflow-hidden bg-gray-50">
        {dummyPaginationLinkTexts.map((paginationLinkText) => (
          <Link href="/" key={paginationLinkText}>
            <a className="mx-px px-2 py-1 bg-amber-300 text-gray-700">
              {paginationLinkText}
            </a>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default RankContentRight;
