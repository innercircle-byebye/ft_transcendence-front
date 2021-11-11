import { VFC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Link from 'next/link';
import { IGameResultWinRate, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import ProfileCardButtons from './profile-page/ProfileCardButtons';

interface IProps {
  profileUserData: IUser;
}

const ProfileCard: VFC<IProps> = ({ profileUserData }) => {
  const router = useRouter();
  const { pathname } = router;
  const { nickname, imagePath } = profileUserData;
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: winData } = useSWR<IGameResultWinRate>(
    pathname === '/play' ? `/api/game/${profileUserData.userId}/win_rate` : null, fetcher,
  );

  return (
    <div className="py-10 px-10 rounded-md bg-gray-200">
      <div className="flex justify-center mb-4">
        <div className="relative w-72 h-72 rounded-full overflow-hidden">
          <Image src={imagePath} alt="profile-image" layout="fill" />
        </div>
      </div>
      <div className="py-2 text-center">
        <h2 className="text-5xl">{nickname}</h2>
      </div>
      {
        pathname === '/play'
        && (
          <div className="mt-5 text-xl py-2 text-center flex flex-col bg-gray-400 mx-16 rounded-md">
            <p>
              승률:
              <span className="text-3xl">{winData?.winRate}</span>
              %
            </p>
            <p className="text-xl">{`${winData?.totalPlayCount}전 ${winData?.winCount}승 ${winData?.loseCount}패`}</p>
          </div>
        )
      }
      {
        pathname === '/profile/[name]' && userData?.nickname === profileUserData.nickname
          ? (
            <div className="text-center mt-5">
              <Link href="/edit-profile">
                <a className="bg-gray-400 px-3 py-1 rounded-full">
                  Edit Profile
                </a>
              </Link>
            </div>
          ) : (
            <div className="text-center mt-5">
              <ProfileCardButtons profileUser={profileUserData} />
            </div>
          )
      }
    </div>
  );
};

export default ProfileCard;
