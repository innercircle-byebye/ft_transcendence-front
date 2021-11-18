import {
  Dispatch,
  SetStateAction,
  useCallback, useEffect, VFC,
} from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { RiPingPongFill } from 'react-icons/ri';
import { IGameRoom, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  friendData: IUser;
  listType: string;
  onClickDeleteFriend?: (friendData: IUser) => void;
  onClickAcceptFriend?: (friendData: IUser) => void;
  onClickCancelReqFriend?: (friendData: IUser) => void;
  setGameRoomId?: Dispatch<SetStateAction<number | null>>;
  onClickParticipate?: () => void;
  status?: string;
}

const FriendItem: VFC<IProps> = ({
  friendData, listType, setGameRoomId, onClickParticipate,
  onClickDeleteFriend, onClickAcceptFriend, onClickCancelReqFriend,
  status,
}) => {
  const router = useRouter();
  const { data: checkUserGameroom } = useSWR<IGameRoom>(friendData.status === 'in_game' ? `/api/game/room/find_user/${friendData.userId}` : null, fetcher);

  const onClickSendDM = useCallback(() => {
    router.push(`/chat/dm/${friendData.nickname}`);
  }, [friendData.nickname, router]);

  const onClickInviteGame = useCallback(() => {
    router.push(`/play/create-room?invite=${friendData.nickname}`);
  }, [friendData.nickname, router]);

  useEffect(() => {
    if (setGameRoomId && checkUserGameroom) {
      setGameRoomId(checkUserGameroom.gameRoomId);
    }
  }, [checkUserGameroom, setGameRoomId]);

  return (
    <div className="bg-amber-50 flex justify-between p-3 rounded-lg">
      <div className="flex items-center space-x-2">
        <div>{friendData.nickname}</div>
        {status === 'offline' && <div className="w-2 h-2 rounded-full bg-gray-500" />}
        {status === 'online' && <div className="w-2 h-2 rounded-full bg-green-600" />}
        {status === 'player1' && <RiPingPongFill className="text-blue-600" />}
        {status === 'player2' && <RiPingPongFill className="text-red-500" />}
      </div>
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
        {status === 'online'
            && <button type="button" onClick={onClickInviteGame} className="bg-red-300 rounded-full px-2 py-1">게임신청</button>}
        {(status === 'player1' || status === 'player2') && onClickParticipate
            && <button type="button" onClick={onClickParticipate} className="bg-red-300 rounded-full px-2 py-1">참여하기</button>}
        <button type="button" onClick={onClickSendDM} className="bg-sky-300 rounded-full px-2 py-1">DM보내기</button>
      </div>
    </div>
  );
};
export default FriendItem;
