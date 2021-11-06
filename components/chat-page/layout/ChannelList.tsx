import { useRouter } from 'next/router';
import React, {
  useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import fetcher from '@/utils/fetcher';
import { IChannel, IUser } from '@/typings/db';
import ChatTwoButtonModal from '@/components/chat-page/common/ChatTwoButtonModal';
import EachChannel from './EachChannel';
import CollapseButton from './CollapseButton';
import CreateChannelButton from './CreateChannelButton';

const ChannelList: VFC = () => {
  const router = useRouter();
  const channelName = router.query.name;
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: myChannelData, mutate: mutateMyChannelData } = useSWR<IChannel[]>('/api/channel/me', fetcher);

  const onClickExitChannel = useCallback(async (exitChannel: IChannel) => {
    if (channelName !== exitChannel.name) { await router.push(`/chat/channel/${exitChannel.name}`); }
    if (userData?.userId === exitChannel.ownerId) {
      setShowDeleteChannelModal(true);
    } else {
      setShowExitModal(true);
    }
  }, [channelName, router, userData?.userId]);

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

  const onClickDeleteChannelYes = useCallback(() => {
    axios.delete(`/api/channel/${channelName}`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      setShowDeleteChannelModal(false);
      router.push('/chat');
    }).catch(() => {
      toast.error(`${channelName} 채널 삭제에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [channelName, router]);

  const onClickDeleteChannelNo = useCallback(() => {
    setShowDeleteChannelModal(false);
  }, []);

  useEffect(() => {
    // console.log('hello');
  }, [channelName]);

  return (
    <div className="border-2 border-sky-700 bg-sky-50 rounded-lg w-full h-auto p-3 space-y-3">
      <CreateChannelButton />
      <div className="text-gray-800 font-semibold text-xl flex items-center">
        <CollapseButton collapse={channelCollapse} setCollapse={setChannelCollapse} />
        Channels
      </div>
      <div className="flex flex-col max-h-80 overflow-y-auto">
        {!channelCollapse
          && myChannelData?.map((channel) => (
            <EachChannel
              key={channel.channelId}
              channel={channel}
              onClickExitChannel={onClickExitChannel}
            />
          ))}
      </div>
      {showExitModal && (
        <ChatTwoButtonModal question={`${channelName} 채널에서 나가시겠습니까?`} onClickYes={onClickExitYes} onClickNo={onClickExitNo} yesButtonColor="bg-red-500" />
      )}
      {showDeleteChannelModal && (
        <ChatTwoButtonModal question={`${channelName} 채널을 삭제하시겠습니까?`} onClickYes={onClickDeleteChannelYes} onClickNo={onClickDeleteChannelNo} yesButtonColor="bg-red-500" />
      )}
    </div>
  );
};

export default ChannelList;
