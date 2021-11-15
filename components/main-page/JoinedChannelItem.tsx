import { VFC } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { IChannel } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  channelData: IChannel;
}

const JoinedChannelItem: VFC<IProps> = ({ channelData }) => {
  const date = localStorage.getItem(`${channelData.name}`) || '0';
  const { data: count } = useSWR<number>(
    `/api/channel/${channelData.name}/unreads?after=${date}`, fetcher,
  );

  return (
    <div className="bg-amber-50 rounded-md w-full py-1.5 px-4 flex justify-between">
      <Link href={`/chat/channel/${channelData.name}`}>
        <a className="w-full flex justify-between">
          <div>{`# ${channelData.name}`}</div>
          <div>{`(${count})`}</div>
        </a>
      </Link>
    </div>
  );
};

export default JoinedChannelItem;
