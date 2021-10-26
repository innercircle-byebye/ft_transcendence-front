import React, { ReactElement, useCallback } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/router';
import ChatLayout from '@/layouts/ChatLayout';
import fetcher from '@/utils/fetcher';
import { IChannel } from '@/typings/db';

const Chat = () => {
  const router = useRouter();
  const { data: channelData } = useSWR<IChannel[]>('/api/channel', fetcher);
  const { data: myChannelData, mutate: mutateMyChannelData } = useSWR<IChannel[]>('/api/channel/me', fetcher);

  const onClickJoin = useCallback((data: IChannel) => {
    axios.post(`/api/channel/${data.name}/member`, {}, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      mutateMyChannelData((prevMyChannelData) => {
        prevMyChannelData?.push(data);
        return prevMyChannelData;
      }, false).then(() => {
        router.push(`/chat/channel/${data.name}`);
      });
    });
  }, [mutateMyChannelData, router]);

  if (!channelData || !myChannelData) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="h-full flex flex-col pl-6 space-y-2">
      <div className="font-semibold text-2xl">
        채널 목록
      </div>
      <div className="flex flex-wrap gap-4">
        {channelData.map((data) => {
          if (myChannelData.filter((v) => v.channelId === data.channelId).length) { return null; }
          return (
            <div key={data.channelId}>
              <div className="flex flex-row justify-between items-center w-80 h-12 bg-blueGray-300 rounded-xl px-5 text-lg">
                <div>{`# ${data.name}`}</div>
                {!data.isPrivate ? <div>{`1 / ${data.maxParticipantNum}`}</div> : (
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
                <button type="button" onClick={() => onClickJoin(data)} className=" bg-amber-500 px-2 py-1 rounded-sm">
                  입장하기
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Chat;
