import { useRouter } from 'next/router';
import React, { useCallback, useState, VFC } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';
import ChatTwoButtonModal from '../common/ChatTwoButtonModal';

const DMMemberModal: VFC = () => {
  const router = useRouter();
  const dmUserNickname = router.query.id;
  const { data: dmUserData } = useSWR<IUser>(`/api/user/nickname/${dmUserNickname}`, fetcher);
  const {
    data: blockMemberData, revalidate: revalidateBlockMemberData,
  } = useSWR<IUser[]>(
    '/api/block/list', fetcher,
  );
  const [showBlockUserModal, setShowBlockUserModal] = useState(false);
  const [showCancelBlockUserModal, setShowCancelBlockUserModal] = useState(false);

  const onClickInviteGame = useCallback(() => {
    if (dmUserData) {
      router.push(`/play/create-room?invite=${dmUserData.nickname}`);
    }
  }, [dmUserData, router]);

  const onClickShowBlockUserModal = useCallback(() => {
    setShowBlockUserModal(true);
  }, []);

  const onClickShowCancelBlockUserModal = useCallback(() => {
    setShowCancelBlockUserModal(true);
  }, []);

  const onClickBlockYes = useCallback(() => {
    if (dmUserData) {
      axios.post(`/api/block/${dmUserData.userId}`, {}, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setShowBlockUserModal(false);
        revalidateBlockMemberData();
        toast.success(`${dmUserData.nickname}님을 차단했습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${dmUserData.nickname}님 차단에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [dmUserData, revalidateBlockMemberData]);

  const onClickCancelBlockYes = useCallback(() => {
    if (dmUserData) {
      axios.delete(`/api/block/${dmUserData.userId}`, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setShowCancelBlockUserModal(false);
        revalidateBlockMemberData();
        toast.success(`${dmUserData.nickname}님을 차단을 풀었습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${dmUserData.nickname}님 차단풀기에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [dmUserData, revalidateBlockMemberData]);

  const onClickBlockNo = useCallback(() => {
    setShowBlockUserModal(false);
  }, []);

  const onClickCancelBlockNo = useCallback(() => {
    setShowCancelBlockUserModal(false);
  }, []);

  if (!blockMemberData || !dmUserData) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <div className="absolute bg-sky-700 top-7 right-16 w-auto p-6 h-auto flex flex-col items-center space-y-3">
        <div className="text-2xl font-semibold text-amber-50 tracking-wide">
          {dmUserNickname}
        </div>
        <button type="button" onClick={onClickInviteGame} className="bg-blue-400 font-semibold text-sm rounded-full w-16 h-7">게임신청</button>
        {blockMemberData.map((v) => v.userId).includes(dmUserData.userId)
          ? <button type="button" onClick={onClickShowCancelBlockUserModal} className="bg-amber-500 font-semibold text-sm rounded-full w-16 h-7">차단풀기</button>
          : <button type="button" onClick={onClickShowBlockUserModal} className="bg-yellow-400 font-semibold text-sm rounded-full w-16 h-7">차단하기</button>}
      </div>
      {showBlockUserModal
      && (
        <ChatTwoButtonModal
          question={`${dmUserData.nickname}님을 차단하시겠습니까?`}
          onClickYes={onClickBlockYes}
          onClickNo={onClickBlockNo}
          yesButtonColor="bg-yellow-400"
        />
      )}
      {showCancelBlockUserModal
      && (
        <ChatTwoButtonModal
          question={`${dmUserData.nickname}님을 차단을 푸시겠습니까?`}
          onClickYes={onClickCancelBlockYes}
          onClickNo={onClickCancelBlockNo}
          yesButtonColor="bg-amber-500"
        />
      )}
    </>
  );
};

export default DMMemberModal;
