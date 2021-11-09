import {
  useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  profileUser: IUser;
}

const ProfileCardButtons: VFC<IProps> = ({ profileUser }) => {
  const router = useRouter();
  const { data: friendList } = useSWR<IUser[]>('/api/friend/list', fetcher);
  const { data: friendWaitList } = useSWR<IUser[]>('/api/friend/wait', fetcher);
  const { data: friendNewList } = useSWR<IUser[]>('/api/friend/new', fetcher);
  const { data: blockList } = useSWR<IUser[]>('/api/block/list', fetcher);
  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  const onClickInviteGame = useCallback(() => {
    router.push(`/play/create-room?invite=${profileUser.userId}`);
  }, [profileUser.userId, router]);

  const onClickSendDM = useCallback(() => {
    router.push(`/chat/dm/${profileUser.nickname}`);
  }, [profileUser.nickname, router]);

  const onClickReqFriend = useCallback(() => {
    axios.post(`/api/friend/${profileUser.userId}/request`, {}, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      setFriendStatus('wait');
      toast.success(`${profileUser.nickname}님에게 친구요청을 보냈습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${profileUser.nickname}님에게 친구요청을 보내기에 실패했습니다..`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [profileUser]);

  const onClickCancelReqFriend = useCallback(() => {
    axios.delete(`/api/friend/${profileUser.userId}/request_cancel`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      setFriendStatus('nothing');
      toast.success(`${profileUser.nickname}님께 보낸 친구요청을 취소했습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${profileUser.nickname}님께 보낸 친구요청취소하기에 실패했습니다..`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [profileUser.nickname, profileUser.userId]);

  const onClickAcceptFriend = useCallback(() => {
    axios.patch(`/api/friend/${profileUser.userId}/approve`, {}, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      setFriendStatus('friend');
      toast.success(`${profileUser.nickname}님에게 친구요청을 수락했습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${profileUser.nickname}님에게 친구요청을 수락에 실패했습니다..`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [profileUser.nickname, profileUser.userId]);

  const onClickDeleteFriend = useCallback(() => {
    axios.delete(`/api/friend/${profileUser.userId}`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      setFriendStatus('nothing');
      toast.success(`${profileUser.nickname}님께 보낸 친구요청을 취소했습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${profileUser.nickname}님께 보낸 친구요청취소하기에 실패했습니다..`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [profileUser.nickname, profileUser.userId]);

  const onClickBlockUser = useCallback(() => {
    axios.post(`/api/block/${profileUser.userId}`, {}, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      setBlocked(true);
      toast.success(`${profileUser.nickname}님을 차단했습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${profileUser.nickname}님 차단에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [profileUser.nickname, profileUser.userId]);

  const onClickCancelBlockUser = useCallback(() => {
    axios.delete(`/api/block/${profileUser.userId}`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      setBlocked(false);
      toast.success(`${profileUser.nickname}님을 차단을 풀었습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${profileUser.nickname}님 차단풀기에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [profileUser.nickname, profileUser.userId]);

  useEffect(() => {
    if (friendList && friendList.map((v) => v.userId).includes(profileUser.userId)) {
      setFriendStatus('friend');
    } else if (friendWaitList && friendWaitList.map((v) => v.userId).includes(profileUser.userId)) {
      setFriendStatus('wait');
    } else if (friendNewList && friendNewList.map((v) => v.userId).includes(profileUser.userId)) {
      setFriendStatus('new');
    } else {
      setFriendStatus('nothing');
    }
  }, [friendList, friendNewList, friendWaitList, profileUser.userId]);

  useEffect(() => {
    if (blockList && blockList.map((v) => v.userId).includes(profileUser.userId)) {
      setBlocked(true);
    } else {
      setBlocked(false);
    }
  }, [blockList, profileUser.userId]);

  return (
    <div className="inline-grid grid-cols-2 gap-5">
      <button type="button" onClick={onClickInviteGame} className="bg-blue-400 px-3 py-2 text-xl">게임신청</button>
      <button type="button" onClick={onClickSendDM} className="bg-green-400 px-3 py-2 text-xl">dm보내기</button>
      {
        friendStatus === 'nothing' && (
          <button type="button" onClick={onClickReqFriend} className="bg-amber-400 px-3 py-2 text-xl">친구요청</button>
        )
      }
      {
        friendStatus === 'wait' && (
          <button type="button" onClick={onClickCancelReqFriend} className="bg-amber-400 px-3 py-2 text-xl">친구요청취소</button>
        )
      }
      {
        friendStatus === 'new' && (
          <button type="button" onClick={onClickAcceptFriend} className="bg-amber-400 px-3 py-2 text-xl">친구요청수락</button>
        )
      }
      {
        friendStatus === 'friend' && (
          <button type="button" onClick={onClickDeleteFriend} className="bg-amber-400 px-3 py-2 text-xl">친구끊기</button>
        )
      }
      {
        blocked ? <button type="button" onClick={onClickCancelBlockUser} className="bg-red-400 px-3 py-2 text-xl">차단풀기</button>
          : <button type="button" onClick={onClickBlockUser} className="bg-red-400 px-3 py-2 text-xl">차단하기</button>
      }
    </div>
  );
};

export default ProfileCardButtons;
