import React, { useEffect, VFC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { IChannel, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  channel: IChannel;
  onClickExitChannel: (exitChannel: IChannel) => Promise<void>;
}

const EachChannel: VFC<IProps> = ({ channel, onClickExitChannel }) => {
  const router = useRouter();
  const channelName = router.query.name;
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const date = localStorage.getItem(`${channel.name}`) || '0';
  const { data: count, mutate: mutateCount } = useSWR<number>(
    `/api/channel/${channel.name}/unreads?after=${date}`, fetcher,
  );

  useEffect(() => {
    if (channelName === channel.name) {
      mutateCount(0);
    }
  }, [channel.createdAt, channel.name, channelName, count, date, mutateCount]);

  return (
    <Link key={channel.channelId} href={`/chat/channel/${channel.name}`}>
      <a>
        <span
          className={`w-full px-2 py-1.5 border-b-2 flex justify-between hover:bg-gray-300 ${
            channelName && typeof channelName === 'string' && channelName === channel.name
              ? 'bg-sky-200'
              : ''
          }`}
        >
          <div className="flex items-center">
            {`# ${channel.name} `}
            {userData?.userId === channel.ownerId ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ) : <></>}
            {count && count > 0 ? <>{`(${count})`}</> : null}
          </div>
          <div className="flex">
            {channel.isPrivate && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            )}
            <button type="button" onClick={() => onClickExitChannel(channel)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </span>
      </a>
    </Link>
  );
};

export default EachChannel;
