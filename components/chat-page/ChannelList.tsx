import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  useCallback, useState, VFC,
} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import fetcher from '@/utils/fetcher';
import { IChannel, IUser } from '@/typings/db';
import ChatTwoButtonModal from './ChatTwoButtonModal';

const ChannelList: VFC = () => {
  const router = useRouter();
  const channelName = router.query.name;
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: myChannelData, mutate: mutateMyChannelData } = useSWR<IChannel[]>('/api/channel/me', fetcher);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const onClickExitChannel = useCallback(async (name: string) => {
    await router.push(`/chat/channel/${name}`);
    setShowExitModal(true);
  }, [router]);

  const onClickExitYes = useCallback(() => {
    mutateMyChannelData(
      (prevMyChannelData) => prevMyChannelData?.filter((data) => data.name !== channelName), false,
    ).then(() => {
      router.push('/chat');
      axios.delete(`/api/channel/${channelName}/member`, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setShowExitModal(false);
      });
    });
  }, [channelName, mutateMyChannelData, router]);

  const onClickExitNo = useCallback(() => {
    setShowExitModal(false);
  }, []);

  return (
    <div className="border-2 border-sky-700 bg-sky-50 rounded-lg w-full h-auto p-3 space-y-3">
      <div className="border-2 border-gray-500 bg-white rounded-2xl p-2 flex flex-row items-center space-x-2">
        <Link href="/chat/create-channel">
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-sky-700 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </Link>
        <div>Create New</div>
      </div>
      <div className="text-gray-800 font-semibold text-xl flex items-center">
        <button type="button" onClick={toggleChannelCollapse} className="px-1">
          {channelCollapse ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
        Channels
      </div>
      <div className="flex flex-col max-h-80 overflow-y-auto">
        {!channelCollapse
          && myChannelData?.map((channel) => (
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
                    <button type="button" onClick={() => onClickExitChannel(channel.name)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </span>
              </a>
            </Link>
          ))}
      </div>
      {showExitModal && (
        <ChatTwoButtonModal question={`${channelName} 채널에서 나가시겠습니까?`} onClickYes={onClickExitYes} onClickNo={onClickExitNo} yesButtonColor="bg-red-500" />
      )}
    </div>
  );
};

export default ChannelList;
