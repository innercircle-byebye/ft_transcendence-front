import { useRouter } from 'next/router';
import React, {
  useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { IChannel, IChannelMember, IUser } from '@/typings/db';
import InviteMemberModal from '@/components/chat-page/channel/InviteMemberModal';
import MembersModal from '@/components/chat-page/channel/MembersModal';
import ChannelInfoModal from '@/components/chat-page/channel/ChannelInfoModal';

const ChannelButtons: VFC = () => {
  const router = useRouter();
  const channelName = router.query.name;
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: allUserData } = useSWR<IUser[]>(
    userData ? '/api/user/all' : null,
    fetcher,
  );
  const { data: channelData } = useSWR<IChannel>(
    userData ? `/api/channel/${channelName}` : null, fetcher,
  );
  const { data: channelMemberData } = useSWR<IChannelMember[]>(
    userData ? `/api/channel/${channelName}/member` : null, fetcher,
  );

  const onClickInviteMemberIcon = useCallback(() => {
    setShowInviteMemberModal((prev) => !prev);
    setShowMembersModal(false);
    setShowSettingModal(false);
  }, []);

  const onClickMembersIcon = useCallback(() => {
    setShowMembersModal((prev) => !prev);
    setShowInviteMemberModal(false);
    setShowSettingModal(false);
  }, []);

  const onClickSettingIcon = useCallback(() => {
    setShowSettingModal((prev) => !prev);
    setShowInviteMemberModal(false);
    setShowMembersModal(false);
  }, []);

  const onClickExit = useCallback(() => {
    router.push('/chat');
  }, [router]);

  useEffect(() => {
    setShowInviteMemberModal(false);
    setShowMembersModal(false);
    setShowSettingModal(false);
  }, [channelName]);

  if (!userData || !allUserData || !channelData || !channelMemberData) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <div className="absolute right-16 flex flex-row">
        <button type="button" className={`hover:bg-sky-700 hover:text-white p-1 ${showInviteMemberModal ? 'bg-sky-700 text-white' : ''}`} onClick={onClickInviteMemberIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </button>
        <button type="button" className={`hover:bg-sky-700 hover:text-white p-1 ${showMembersModal ? 'bg-sky-700 text-white' : ''}`} onClick={onClickMembersIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </button>
        <button type="button" className={`hover:bg-sky-700 hover:text-white p-1 ${showSettingModal ? 'bg-sky-700 text-white' : ''}`} onClick={onClickSettingIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
        <button type="button" className="hover:bg-sky-700 hover:text-white p-1" onClick={onClickExit}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {showInviteMemberModal && (
      <InviteMemberModal
        memberData={allUserData}
        channelData={channelData}
        channelMemberData={channelMemberData}
      />
      )}
      {showMembersModal && (
      <MembersModal />
      )}
      {showSettingModal && (
      <ChannelInfoModal
        setShowSettingModal={setShowSettingModal}
        userData={userData}
        channelData={channelData}
        channelMemberData={channelMemberData}
      />
      )}
    </>
  );
};

export default ChannelButtons;
