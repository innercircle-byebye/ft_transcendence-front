import useSWR from 'swr';
import { IChannel } from '@/typings/db';
import fetcher from '@/utils/fetcher';

const JoinedChannelList = () => {
  const { data: channelData } = useSWR<IChannel[]>(
    '/api/channel/me',
    fetcher,
  );

  return (
    <div className="rounded-xl bg-sky-700 text-center flex flex-col w-1/2 space-y-2">
      {/* title */}
      <div className="text-white font-medium text-xl pt-3 pb-2">참여중인 채널목록</div>
      {/* content list */}
      <div className="flex flex-col space-y-2 mx-4 py-2">
        {channelData?.map((item: IChannel) => (
          <button type="button" key={item.channelId} className="bg-amber-50 rounded-md w-full py-1.5 px-4 flex justify-between">
            <div>{`# ${item.name}`}</div>
            <div>count</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default JoinedChannelList;
