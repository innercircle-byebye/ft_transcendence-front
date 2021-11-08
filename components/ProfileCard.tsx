import { VFC } from 'react';
import Image from 'next/image';
import { IUser } from '@/typings/db';

interface IProps {
  profileUserData: IUser;
}

const ProfileCard: VFC<IProps> = ({ profileUserData }) => {
  const { nickname, imagePath } = profileUserData;
  return (
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
};

export default ProfileCard;
