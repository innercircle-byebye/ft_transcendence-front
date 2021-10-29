import React, {
  useCallback, useEffect, useState, VFC,
} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IChannel, IChannelMember, IUser } from '@/typings/db';
import ChatTwoButtonModal from '../common/ChatTwoButtonModal';
import fetcher from '@/utils/fetcher';

const MembersModal: VFC = () => {
  const router = useRouter();
  const channelName = router.query.name;
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: channelData } = useSWR<IChannel>(
    `/api/channel/${channelName}`, fetcher,
  );
  const { data: channelMemberData, revalidate } = useSWR<IChannelMember[]>(
    `/api/channel/${channelName}/member`, fetcher,
  );
  const [ownerNickname, setOwnerNickname] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [
    grantChannelAdminMember, setGrantChannelAdminMember,
  ] = useState<IChannelMember | null>(null);
  const [
    cancelChannelAdminMember, setCancelChannelAdminMember,
  ] = useState<IChannelMember | null>(null);

  const onClickGrantChannelAdmin = useCallback((member: IChannelMember) => {
    setGrantChannelAdminMember(member);
  }, []);

  const onClickCancelChannelAdmin = useCallback((member: IChannelMember) => {
    setCancelChannelAdminMember(member);
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
        revalidate();
        toast.success(`"${grantChannelAdminMember.user.nickname}" 님에게 방장권한을 부여했습니다.`, { position: 'bottom-right', theme: 'colored' });
        setGrantChannelAdminMember(null);
      }).catch(() => {
        toast.error('방장권한부여가 실패되었습니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [channelData, grantChannelAdminMember, revalidate, userData]);

  const onClickGrantChannelAdminNo = useCallback(() => {
    setGrantChannelAdminMember(null);
  }, []);

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
        revalidate();
        toast.success(`"${cancelChannelAdminMember.user.nickname}" 의 방장권한을 취소했습니다.`, { position: 'bottom-right', theme: 'colored' });
        setCancelChannelAdminMember(null);
      }).catch(() => {
        toast.error('방장권한취소가 실패되었습니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [userData, channelData, cancelChannelAdminMember, revalidate]);

  const onClickCancelChannelAdminNo = useCallback(() => {
    setCancelChannelAdminMember(null);
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

  if (!userData || !channelData || !channelMemberData) {
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
            console.log(`${data.user.nickname} ${data.isAdmin}`);
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
                <button type="button" className="bg-yellow-400 font-semibold text-sm rounded-full w-16 h-7">차단하기</button>
                {isUserAdmin
                && <button type="button" className="bg-amber-500 font-semibold text-sm rounded-full w-16 h-7">채팅금지</button>}
                {channelData.ownerId === userData.userId
              && (
              <>
                {(data.isAdmin
                  ? <button type="button" onClick={() => onClickCancelChannelAdmin(data)} className="bg-red-400 font-semibold text-sm rounded-full w-16 h-7">방장취소</button>
                  : <button type="button" onClick={() => onClickGrantChannelAdmin(data)} className="bg-green-500 font-semibold text-sm rounded-full w-16 h-7">방장부여</button>
                )}
                <button type="button" className="bg-red-500 font-semibold text-sm rounded-full w-16 h-7">추방하기</button>
              </>
              )}
              </div>
            );
          })}
        </div>
      </div>
      {grantChannelAdminMember
      && (
        <div>
          <ChatTwoButtonModal
            question={`${grantChannelAdminMember.user.nickname}님께 방장 권한을 부여하시겠습니까?`}
            onClickYes={onClickGrantChannelAdminYes}
            onClickNo={onClickGrantChannelAdminNo}
            yesButtonColor="bg-green-500"
          />
        </div>
      )}
      {cancelChannelAdminMember
      && (
        <div>
          <ChatTwoButtonModal
            question={`${cancelChannelAdminMember.user.nickname}님의 방장 권한을 취소하시겠습니까?`}
            onClickYes={onClickCancelChannelAdminYes}
            onClickNo={onClickCancelChannelAdminNo}
            yesButtonColor="bg-green-500"
          />
        </div>
      )}
    </>
  );
};
export default MembersModal;
