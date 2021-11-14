import {
  useCallback, useEffect, useState, VFC,
} from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate, trigger } from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IGameRoom, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  friendData: IUser;
  listType?: string;
}

const FriendItem: VFC<IProps> = ({ friendData, listType }) => {
  const router = useRouter();

  const { data: checkUserGameroom } = useSWR<IGameRoom>(friendData.status === 'in_game' ? `/api/game/room/find_user/${friendData.userId}` : null, fetcher);
  const [gameRoomId, setGameRoomId] = useState<number | null>(null);

  const onClickSendDM = useCallback(() => {
    router.push(`/chat/dm/${friendData.nickname}`);
  }, [friendData.nickname, router]);
  const onClickInviteGame = useCallback(() => {
    router.push(`/play/create-room?invite=${friendData.userId}`);
  }, [friendData.userId, router]);

  const onClickDeleteFriend = useCallback(() => {
    axios.delete(`/api/friend/${friendData.userId}`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${friendData.nickname}을 친구에서 삭제했습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${friendData.nickname}의 친구 삭제가 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [friendData.nickname, friendData.userId]);

  const onClickAcceptFriend = useCallback(() => {
    axios.patch(`/api/friend/${friendData.userId}/approve`, {}, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${friendData.nickname}님에게 친구요청을 수락했습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${friendData.nickname}님에게 친구요청을 수락에 실패했습니다..`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [friendData.nickname, friendData.userId]);

  const onClickCancelReqFriend = useCallback(() => {
    axios.delete(`/api/friend/${friendData.userId}/request_cancel`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${friendData.nickname}님께 보낸 친구요청을 취소했습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${friendData.nickname}님께 보낸 친구요청취소하기에 실패했습니다..`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [friendData.nickname, friendData.userId]);

  const onClickCancelBlockUser = useCallback(() => {
    axios.delete(`/api/block/${friendData.userId}`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${friendData.nickname}님을 차단을 풀었습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${friendData.nickname}님 차단풀기에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [friendData.nickname, friendData.userId]);

  const onClickParticipate = useCallback(() => {
    console.log(gameRoomId);
    console.log('관전하기');
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
      console.log(checkUserGameroom);
      const foundGameRoomId = checkUserGameroom.gameRoomId;
      setGameRoomId(foundGameRoomId || null);
    }
  }, [checkUserGameroom]);

  return (
    <div className="bg-amber-50 text-md rounded-md px-5 py-2 grid grid-cols-6 justify-items-center">
      <span className="col-span-2 justify-self-start">
        {`${friendData.nickname} [${friendData.status}]`}
      </span>
      <span className="col-span-1" />
      <span className="col-span-1">
        {listType === 'friendList' ? (
          <button
            type="button"
            onClick={() => {
              onClickDeleteFriend();
              mutate('/api/friend/list');
            }}
          >
            친구 삭제하기
          </button>
        ) : ''}
        {listType === 'friendNewList' ? (
          <button
            type="button"
            onClick={() => {
              onClickAcceptFriend();
              trigger('/api/friend/new');
            }}
          >
            요청 수락하기
          </button>
        ) : ''}
        {listType === 'friendWaitList' ? (
          <button
            type="button"
            onClick={() => {
              onClickCancelReqFriend();
              trigger('/api/friend/wait', false);
            }}
          >
            요청 취소하기
          </button>
        ) : ''}
      </span>
      <span className="col-span-1 bg-red-300">
        {
          (() => {
            if (friendData.status === 'online') {
              return (
                <>
                  <button type="button" onClick={onClickInviteGame}>게임신청</button>
                </>
              );
            }
            if (friendData.status === 'in_game') {
              return (
                <>
                  <button type="button" onClick={onClickParticipate}>참여하기</button>
                </>
              );
            }
            return (null);
          })()
        }
      </span>
      <span className="col-span-1 bg-sky-300">
        {listType !== 'blockedList' ? (<button type="button" onClick={onClickSendDM}>DM보내기</button>) : (
          <button
            type="button"
            onClick={() => {
              onClickCancelBlockUser();
              mutate('/api/block/list');
            }}
          >
            차단 해제하기
          </button>
        )}
      </span>
    </div>
  );
};
export default FriendItem;
