import { VFC } from 'react';
import Image from 'next/image';
import { IRankInfo } from '@/typings/db';

interface IProps {
  rankInfo: IRankInfo;
  bgColor?: string;
}

const RankItem: VFC<IProps> = ({ rankInfo, bgColor = 'bg-gray-300' }) => (
  <div className={`${bgColor} rounded-md flex flex-col items-center w-full`}>
    <div className="relative w-52 h-52">
      <Image loader={() => rankInfo.imagePath} alt="rank-image" src={`${rankInfo.imagePath}`} layout="fill" />
    </div>
    <p className="text-xl">{rankInfo.title.toUpperCase()}</p>
  </div>
);

export default RankItem;
