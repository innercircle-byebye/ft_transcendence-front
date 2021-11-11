import { VFC } from 'react';
import Image from 'next/image';
import { IRankInfo } from '@/typings/db';

interface IProps {
  rankInfo: IRankInfo;
}

const RankItem: VFC<IProps> = ({ rankInfo }) => (
  <div className="bg-gray-300 rounded-md flex flex-col items-center">
    <div className="relative w-52 h-52">
      <Image alt="rank-image" src={`${rankInfo.imagePath}`} layout="fill" />
    </div>
    <p className="text-xl">{rankInfo.title}</p>
  </div>
);

export default RankItem;
