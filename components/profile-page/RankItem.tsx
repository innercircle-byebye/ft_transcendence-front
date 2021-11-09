import { VFC } from 'react';
import Image from 'next/image';
import { IRankInfo } from '@/typings/db';

interface IProps {
  rankInfo: IRankInfo;
}

const RankItem: VFC<IProps> = ({ rankInfo }) => (
  <div className="bg-gray-300 rounded-md">
    <div className="relative w-40 h-40">
      <Image alt="rank-image" src={`/${rankInfo.imagePath}`} layout="fill" />
    </div>
    <p>{rankInfo.title}</p>
    <p>{rankInfo.rankId}</p>
  </div>
);

export default RankItem;
