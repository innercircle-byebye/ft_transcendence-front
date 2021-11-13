import React, { useEffect, VFC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  member: IUser;
}

const EachDM: VFC<IProps> = ({ member }) => {
  const router = useRouter();
  const dMUserName = router.query.name;
  const date = localStorage.getItem(`dm-${dMUserName}`) || '0';
  const { data: count, mutate: mutateCount } = useSWR<number>(
    member ? `/api/dm/${member.userId}/unreads?after=${date}` : null, fetcher,
  );

  useEffect(() => {
    if (dMUserName === member.nickname) {
      mutateCount(0);
    }
  }, [dMUserName, member.nickname, mutateCount]);

  return (
    <Link
      href={`/chat/dm/${member.nickname}`}
      key={member.userId + member.intraUsername}
    >
      <a>
        <span
          className={`w-full px-2 py-1.5 border-b-2 flex justify-between hover:bg-gray-300 ${
            dMUserName && dMUserName === member.nickname
              ? 'bg-sky-200'
              : ''
          }`}
        >
          <div className="flex flex-row items-center space-x-1">
            <div className="relative bg-blue-300 w-5 h-5 rounded-full shadow-lg mr-2">
              <Image
                src={member.imagePath}
                alt="previewImage"
                objectFit="cover"
                layout="fill"
                className="rounded-full"
              />
            </div>
            {member.nickname}
            {count && count > 0 ? <>{`(${count})`}</> : null}
            {member.status === 'online' ? (
              <div className="w-2 h-2 rounded-full bg-green-600" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-red-600" />
            )}
          </div>
        </span>
      </a>
    </Link>
  );
};

export default EachDM;