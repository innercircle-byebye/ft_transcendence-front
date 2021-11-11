import Image from 'next/image';
import React, { VFC } from 'react';
import Link from 'next/link';
import { IUser } from '@/typings/db';

interface IProps {
  user: IUser
}

const SearchProfileCard: VFC<IProps> = ({ user: { nickname, imagePath } }) => (
  <Link href={`/profile/${nickname}`}>
    <a className="flex flex-col items-center bg-gray-200">
      <div className="relative w-28 h-28">
        <Image alt="profile-image" src={imagePath} layout="fill" />
      </div>
      <span className="p-2">{nickname}</span>
    </a>
  </Link>
);

export default SearchProfileCard;
