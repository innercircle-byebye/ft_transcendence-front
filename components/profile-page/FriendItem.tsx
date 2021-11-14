import {
  useCallback, useEffect, useState, VFC,
} from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IGameRoom, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  friendData: IUser;
  listType?: string;
  onClickDeleteFriend?: (friendData: IUser) => void;
  onClickAcceptFriend?: (friendData: IUser) => void;
  onClickCancelReqFriend?: (friendData: IUser) => void;
}

const FriendItem: VFC<IProps> = ({
  friendData, listType, onClickDeleteFriend, onClickAcceptFriend, onClickCancelReqFriend,
}) => {
  const router = useRouter();
  const { data: checkUserGameroom } = useSWR<IGameRoom>(friendData.status === 'in_game' ? `/api/game/room/find_user/${friendData.userId}` : null, fetcher);

  const [gameRoomId, setGameRoomId] = useState<number | null>(null);

  const onClickSendDM = useCallback(() => {
    router.push(`/chat/dm/${friendData.nickname}`);
  }, [friendData.nickname, router]);

  const onClickInviteGame = useCallback(() => {
    router.push(`/play/create-room?invite=${friendData.nickname}`);
  }, [friendData.nickname, router]);

  const onClickParticipate = useCallback(() => {
    axios.post(`/api/game/room/${gameRoomId}/join`, {
      role: 'observer',
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      router.push(`/play/room/${gameRoomId}`);
    }).catch(() => {
      toast.error('빠른관전 입장에 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
    });
  }, [gameRoomId, router]);

  useEffect(() => {
    if (checkUserGameroom) {
      const foundGameRoomId = checkUserGameroom.gameRoomId;
      setGameRoomId(foundGameRoomId || null);
    }
  }, [checkUserGameroom]);

  return (
    <div className="bg-amber-50 flex justify-between p-3 rounded-lg">
      <span className="col-span-2 justify-self-start">
        {`${friendData.nickname} [${friendData.status}]`}
      </span>
      <div className="flex gap-3">
        <span className="bg-green-300 rounded-full px-2 py-1">
          {listType === 'friendList' && onClickDeleteFriend && (
            <button type="button" onClick={() => onClickDeleteFriend(friendData)}>
              친구삭제하기
            </button>
          )}
          {listType === 'friendNewList' && onClickAcceptFriend && (
            <button type="button" onClick={() => onClickAcceptFriend(friendData)}>
              요청수락하기
            </button>
          )}
          {listType === 'friendWaitList' && onClickCancelReqFriend && (
            <button type="button" onClick={() => onClickCancelReqFriend(friendData)}>
              요청취소하기
            </button>
          )}
        </span>
        <span className="bg-red-300 rounded-full px-2 py-1">
          {friendData.status === 'online'
            && <button type="button" onClick={onClickInviteGame}>게임신청</button>}
          {friendData.status === 'in_game'
            && <button type="button" onClick={onClickParticipate}>참여하기</button>}
        </span>
        <span className="bg-sky-300 rounded-full px-2 py-1">
          <button type="button" onClick={onClickSendDM}>DM보내기</button>
        </span>
      </div>
    </div>
  );
};
export default FriendItem;
