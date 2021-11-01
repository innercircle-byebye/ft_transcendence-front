import Image from 'next/image';

import type { VFC } from 'react';

interface IProps {
  nickname: string;
  imagePath: string;
}

const ProfileCard: VFC<IProps> = ({ nickname, imagePath }) => (
  <div className="py-12 mb-6 rounded-md bg-gray-200">
    <div className="flex justify-center mb-4">
      <div className="w-72 h-72 rounded-full overflow-hidden">
        <Image src={imagePath} width={300} height={300} alt="Avatar" />
      </div>
    </div>
    <div className="py-2 text-center">
      <h2 className="text-5xl">{nickname}</h2>
    </div>
  </div>
);

export default ProfileCard;
