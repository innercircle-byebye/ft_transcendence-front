import React, {
  useCallback, useEffect, useState, VFC,
} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IChannel, IChannelMember, IUser } from '@/typings/db';
import ChatTwoButtonModal from '@/components/chat-page/common/ChatTwoButtonModal';
import fetcher from '@/utils/fetcher';
import MuteChatModal from '@/components/chat-page/channel/MuteChatModal';

const MembersModal: VFC = () => {
  const router = useRouter();
  const channelName = router.query.name;
  const [ownerNickname, setOwnerNickname] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [muteMember, setMuteMember] = useState<IChannelMember | null>(null);
  const [banMember, setBanMember] = useState<IChannelMember | null>(null);
  const [blockMember, setBlockMember] = useState<IChannelMember | null>(null);
  const [cancelBlockMember, setCancelBlockMember] = useState<IChannelMember | null>(null);
  const [cancelBanMember, setCancelBanMember] = useState<IChannelMember | null>(null);
  const [
    grantChannelAdminMember, setGrantChannelAdminMember,
  ] = useState<IChannelMember | null>(null);
  const [
    cancelChannelAdminMember, setCancelChannelAdminMember,
  ] = useState<IChannelMember | null>(null);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: channelData } = useSWR<IChannel>(
    `/api/channel/${channelName}`, fetcher,
  );
  const {
    data: channelMemberData, revalidate: revalidateChannelMemberData,
  } = useSWR<IChannelMember[]>(
    `/api/channel/${channelName}/member`, fetcher,
  );
  const {
    data: blockMemberData, revalidate: revalidateBlockMemberData,
  } = useSWR<IChannelMember[]>(
    '/api/block/list', fetcher,
  );

  const onClickMuteMember = useCallback((member: IChannelMember) => {
    setMuteMember(member);
  }, []);

  const onClickGrantChannelAdmin = useCallback((member: IChannelMember) => {
    setGrantChannelAdminMember(member);
  }, []);

  const onClickCancelChannelAdmin = useCallback((member: IChannelMember) => {
    setCancelChannelAdminMember(member);
  }, []);

  const onClickBanMember = useCallback((member: IChannelMember) => {
    setBanMember(member);
  }, []);

  const onClickCancelBanMember = useCallback((member: IChannelMember) => {
    setCancelBanMember(member);
  }, []);

  const onClickBlockMember = useCallback((member: IChannelMember) => {
    setBlockMember(member);
  }, []);

  const onClickCancelBlockMember = useCallback((member: IChannelMember) => {
    setCancelBlockMember(member);
  }, []);

  const onClickGrantChannelAdminYes = useCallback(() => {
    if (userData && channelData && grantChannelAdminMember) {
      axios.patch(`/api/channel/${channelData.name}/admin`, {
        isAdmin: true,
        targetUserId: grantChannelAdminMember.userId,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        revalidateChannelMemberData();

        toast.success(`"${grantChannelAdminMember.user.nickname}" 님에게 방장권한을 부여했습니다.`, { position: 'bottom-right', theme: 'colored' });
        setGrantChannelAdminMember(null);
      }).catch(() => {
        toast.error('방장권한부여가 실패되었습니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [channelData, grantChannelAdminMember, revalidateChannelMemberData, userData]);

  const onClickCancelChannelAdminYes = useCallback(() => {
    if (userData && channelData && cancelChannelAdminMember) {
      axios.patch(`/api/channel/${channelData.name}/admin`, {
        isAdmin: false,
        targetUserId: cancelChannelAdminMember.userId,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        revalidateChannelMemberData();
        toast.success(`"${cancelChannelAdminMember.user.nickname}" 의 방장권한을 취소했습니다.`, { position: 'bottom-right', theme: 'colored' });
        setCancelChannelAdminMember(null);
      }).catch(() => {
        toast.error('방장권한취소가 실패되었습니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [userData, channelData, cancelChannelAdminMember, revalidateChannelMemberData]);

  const onClickBanMemberYes = useCallback(() => {
    if (banMember) {
      axios.patch(`/api/channel/${channelName}/member`, {
        banDate: new Date(),
        targetUserId: banMember.userId,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setBanMember(null);
        revalidateChannelMemberData();
        toast.success(`${banMember.user.nickname}님을 추방했습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${banMember.user.nickname}님 추방에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [banMember, channelName, revalidateChannelMemberData]);

  const onClickCancelBanMemberYes = useCallback(() => {
    if (cancelBanMember) {
      axios.patch(`/api/channel/${channelName}/member`, {
        banDate: null,
        targetUserId: cancelBanMember.userId,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setCancelBanMember(null);
        revalidateChannelMemberData();
        toast.success(`${cancelBanMember.user.nickname}님을 추방을 취소했습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${cancelBanMember.user.nickname}님 추방취소에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [cancelBanMember, channelName, revalidateChannelMemberData]);

  const onClickBlockYes = useCallback(() => {
    if (blockMember) {
      axios.post(`/api/block/${blockMember.userId}`, {}, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setBlockMember(null);
        revalidateBlockMemberData();
        toast.success(`${blockMember.user.nickname}님을 차단했습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${blockMember.user.nickname}님 차단에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [blockMember, revalidateBlockMemberData]);

  const onClickCancelBlockYes = useCallback(() => {
    if (cancelBlockMember) {
      axios.delete(`/api/block/${cancelBlockMember.userId}`, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setCancelBlockMember(null);
        revalidateBlockMemberData();
        toast.success(`${cancelBlockMember.user.nickname}님을 차단을 풀었습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${cancelBlockMember.user.nickname}님 차단풀기에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [cancelBlockMember, revalidateBlockMemberData]);

  const onClickGrantChannelAdminNo = useCallback(() => {
    setGrantChannelAdminMember(null);
  }, []);

  const onClickCancelChannelAdminNo = useCallback(() => {
    setCancelChannelAdminMember(null);
  }, []);

  const onClickBanMemberNo = useCallback(() => {
    setBanMember(null);
  }, []);

  const onClickCancelBanMemberNo = useCallback(() => {
    setCancelBanMember(null);
  }, []);

  const onClickBlockNo = useCallback(() => {
    setBanMember(null);
  }, []);

  const onClickCancelBlockNo = useCallback(() => {
    setCancelBlockMember(null);
  }, []);

  useEffect(() => {
    if (channelMemberData && channelData) {
      const nickname = channelMemberData.find((data) => (
        data.userId === channelData.ownerId
      ))?.user?.nickname;
      setOwnerNickname(nickname || null);
    }
  }, [channelData, channelMemberData]);

  useEffect(() => {
    if (userData && channelMemberData) {
      const userChannelData = channelMemberData.find((data) => data.userId === userData.userId);
      setIsUserAdmin(userChannelData?.isAdmin || false);
    }
  }, [channelMemberData, userData]);

  if (!userData || !channelData || !channelMemberData || !blockMemberData) {
    return <div>로딩중...</div>;
  }

  if (channelMemberData.length === 1) {
    return (
      <div className="absolute bg-sky-700 top-32 right-10 w-60 h-auto p-6 flex flex-col items-center space-y-3">
        <div className="text-2xl font-semibold text-amber-50 tracking-wide">{`# ${channelData.name} (1)`}</div>
        <div className="text-amber-50 font-semibold">{`소유자 : ${userData.nickname} (나)`}</div>
        <div className="text-amber-50 text-9xl">텅</div>
      </div>
    );
  }
  return (
    <>
      <div className="absolute bg-sky-700 top-32 right-10 w-auto p-6 h-auto flex flex-col items-center space-y-3">
        <div className="text-2xl font-semibold text-amber-50 tracking-wide">
          {`# ${channelData.name} (${channelData.currentChatMemberCount})`}
        </div>
        <div className="text-amber-50">
          {`소유자: ${ownerNickname} ${userData.userId === channelData.ownerId ? '(나)' : ''}`}
        </div>
        <div className="bg-amber-50 rounded-xl flex flex-col space-y-1 px-3 py-2 max-h-60 overflow-y-auto">
          {channelMemberData.map((data) => {
            if (data.user.nickname === userData.nickname) {
              return null;
            }
            return (
              <div key={data.userId} className="flex flex-row justify-between space-x-2">
                <Link href={`/chat/dm/${data.user.nickname}`}>
                  <a className="font-semibold">
                    {data.user.nickname}
                  </a>
                </Link>
                <button type="button" className="bg-blue-400 font-semibold text-sm rounded-full w-16 h-7">게임신청</button>
                {blockMemberData.map((v) => v.userId).includes(data.userId)
                  ? <button type="button" onClick={() => onClickCancelBlockMember(data)} className="bg-amber-500 font-semibold text-sm rounded-full w-16 h-7">차단풀기</button>
                  : <button type="button" onClick={() => onClickBlockMember(data)} className="bg-yellow-400 font-semibold text-sm rounded-full w-16 h-7">차단하기</button>}
                {channelData.ownerId === userData.userId
                && (data.isAdmin
                  ? <button type="button" onClick={() => onClickCancelChannelAdmin(data)} className="bg-red-400 font-semibold text-sm rounded-full w-16 h-7">방장취소</button>
                  : <button type="button" onClick={() => onClickGrantChannelAdmin(data)} className="bg-green-500 font-semibold text-sm rounded-full w-16 h-7">방장부여</button>
                )}
                {isUserAdmin && (userData.userId === channelData.ownerId || !data.isAdmin)
                && (
                <>
                  <button type="button" onClick={() => onClickMuteMember(data)} className="bg-amber-500 font-semibold text-sm rounded-full w-16 h-7">채팅금지</button>
                  {(data.banDate
                    ? <button type="button" onClick={() => onClickCancelBanMember(data)} className="bg-green-400 font-semibold text-sm rounded-full w-16 h-7">추방취소</button>
                    : <button type="button" onClick={() => onClickBanMember(data)} className="bg-red-500 font-semibold text-sm rounded-full w-16 h-7">추방하기</button>
                  )}
                </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {grantChannelAdminMember
      && (
      <ChatTwoButtonModal
        question={`${grantChannelAdminMember.user.nickname}님께 방장 권한을 부여하시겠습니까?`}
        onClickYes={onClickGrantChannelAdminYes}
        onClickNo={onClickGrantChannelAdminNo}
        yesButtonColor="bg-green-500"
      />
      )}
      {cancelChannelAdminMember
      && (
      <ChatTwoButtonModal
        question={`${cancelChannelAdminMember.user.nickname}님의 방장 권한을 취소하시겠습니까?`}
        onClickYes={onClickCancelChannelAdminYes}
        onClickNo={onClickCancelChannelAdminNo}
        yesButtonColor="bg-red-400"
      />
      )}
      {muteMember
      && (
        <MuteChatModal
          muteMember={muteMember}
          setMuteMember={setMuteMember}
          revalidateChannelMemberData={revalidateChannelMemberData}
        />
      )}
      {banMember
      && (
        <ChatTwoButtonModal
          question={`${banMember.user.nickname}님을 추방하시겠습니까?`}
          onClickYes={onClickBanMemberYes}
          onClickNo={onClickBanMemberNo}
          yesButtonColor="bg-red-500"
        />
      )}
      {cancelBanMember
      && (
        <ChatTwoButtonModal
          question={`${cancelBanMember.user.nickname}님을 추방을 취소하시겠습니까?`}
          onClickYes={onClickCancelBanMemberYes}
          onClickNo={onClickCancelBanMemberNo}
          yesButtonColor="bg-green-400"
        />
      )}
      {blockMember
      && (
        <ChatTwoButtonModal
          question={`${blockMember.user.nickname}님을 차단하시겠습니까?`}
          onClickYes={onClickBlockYes}
          onClickNo={onClickBlockNo}
          yesButtonColor="bg-yellow-400"
        />
      )}
      {cancelBlockMember
      && (
        <ChatTwoButtonModal
          question={`${cancelBlockMember.user.nickname}님을 차단을 푸시겠습니까?`}
          onClickYes={onClickCancelBlockYes}
          onClickNo={onClickCancelBlockNo}
          yesButtonColor="bg-amber-500"
        />
      )}
    </>
  );
};
export default MembersModal;
