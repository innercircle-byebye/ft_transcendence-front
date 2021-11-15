import useSWR from 'swr';
import { IChannel } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import JoinedChannelItem from './JoinedChannelItem';

const JoinedChannelList = () => {
  const { data: myChannelData } = useSWR<IChannel[]>(
    '/api/channel/me',
    fetcher,
  );

  return (
    <div className="rounded-xl bg-sky-700 text-center flex flex-col w-full space-y-2">
      {/* title */}
      <div className="text-white font-medium text-xl pt-3 pb-2">참여중인 채널목록</div>
      {/* content list */}
      <div className="flex flex-col space-y-2 mx-4 py-2">
        {myChannelData?.map((channelData: IChannel) => (
          <JoinedChannelItem
            key={channelData.createdAt + channelData.name}
            channelData={channelData}
          />
        ))}
      </div>
    </div>
  );
};

export default JoinedChannelList;
