import React, {
  Dispatch,
  SetStateAction,
  useCallback, useEffect, VFC,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Link from 'next/link';
import useInput from '@/hooks/useInput';
import { IChannel } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import useSocket from '@/hooks/useSocket';

interface IProps {
  allChannelInitialData: IChannel[];
  myChannelInitialData: IChannel[];
  setPrivateChannelToJoin: Dispatch<SetStateAction<IChannel | null>>;
}

const SearchChannel: VFC<IProps> = ({
  allChannelInitialData, myChannelInitialData, setPrivateChannelToJoin,
}) => {
  const router = useRouter();
  const { socket } = useSocket('chat');
  const [searchChannelName, onChangeSearchChannelName] = useInput('');
  const { data: allChannelData, mutate: mutateAllChannelData } = useSWR<IChannel[]>('/api/channel', fetcher, {
    initialData: allChannelInitialData,
  });
  const { data: myChannelData, mutate: mutateMyChannelData } = useSWR<IChannel[]>('/api/channel/me', fetcher, {
    initialData: myChannelInitialData,
  });

  const onClickJoin = useCallback((data: IChannel) => {
    if (data.isPrivate) {
      setPrivateChannelToJoin(data);
    } else {
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
    }
  }, [mutateMyChannelData, router, setPrivateChannelToJoin]);

  const onChannelCreate = useCallback(
    (data: IChannel) => {
      mutateAllChannelData((channel) => {
        channel?.push(data);
        return channel;
      }, false);
    },
    [mutateAllChannelData],
  );

  useEffect(() => {
    socket?.on('channelList', onChannelCreate);
    return () => {
      socket?.off('channelList', onChannelCreate);
    };
  }, [socket, onChannelCreate]);

  if (!myChannelData) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <div>
        <div className="w-full bg-white border border-gray-900 flex flex-row items-center rounded-full px-3 py-1 space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-sky-700"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input type="text" value={searchChannelName} onChange={onChangeSearchChannelName} placeholder="Search Channel" className="text-lg font-semibold text-sky-700 w-full outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-3">
          {allChannelData?.map((data) => {
            if (searchChannelName) {
              if (!data.name.includes(searchChannelName)) {
                return null;
              }
            }
            return (
              <div key={data.channelId}>
                <div className="grid grid-cols-3 justify-items-center items-center w-full h-auto border-2 border-coolGray-500 bg-coolGray-100 rounded-xl px-5 py-2 text-lg">
                  <div className="w-full flex justify-start">{`# ${data.name}`}</div>
                  {!data.isPrivate ? <div>{`${data.currentChatMemberCount} / ${data.maxParticipantNum}`}</div> : (
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
                  <div className="w-full flex justify-end">
                    {myChannelData.map((v) => v.channelId).includes(data.channelId) ? (
                      <Link href={`/chat/channel/${data.name}`}>
                        <a className="flex items-center bg-green-500 text-gray-900 px-3 py-2 rounded-xl text-xs sm:text-sm md:text-base">
                          채팅하러가기
                        </a>
                      </Link>
                    )
                      : (
                        <button
                          type="button"
                          onClick={() => onClickJoin(data)}
                          className={`${data.currentChatMemberCount === data.maxParticipantNum ? 'bg-red-500' : 'bg-amber-500'} flex items-center  text-gray-900 px-3 py-2 rounded-xl text-xs sm:text-sm md:text-base`}
                          disabled={data.currentChatMemberCount === data.maxParticipantNum}
                        >
                          {data.currentChatMemberCount === data.maxParticipantNum ? '정원초과' : '입장하기'}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SearchChannel;
