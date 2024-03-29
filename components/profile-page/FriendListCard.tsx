import axios from 'axios';
import React, {
  useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { IGameRoom, IStatusPlayer } from '@/typings/db';
import PasswordModal from '@/components/chat-page/PasswordModal';
import BlockedList from '@/components/profile-page/BlockedList';
import FriendList from '@/components/profile-page/FriendList';
import FriendNewList from '@/components/profile-page/FriendNewList';
import FriendWaitList from '@/components/profile-page/FriendWaitList';
import fetcher from '@/utils/fetcher';
import useInput from '@/hooks/useInput';
import useSocket from '@/hooks/useSocket';

interface IProps {
  show: boolean;
}

const FriendListCard: VFC<IProps> = ({ show }) => {
  const router = useRouter();
  const [clickedItem, setClickedItem] = useState('friendList');
  const [gameRoomId, setGameRoomId] = useState<number | null>(null);
  const [enterPrivateGameRoom, setEnterPrivateGameRoom] = useState(false);
  const { data: gameRoomInfo } = useSWR<IGameRoom>(gameRoomId ? `/api/game/room/${gameRoomId}` : null, fetcher);
  const [password, onChangePassword, setPassword] = useInput('');
  const { socket } = useSocket('main');
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [player1List, setPlayer1List] = useState<number[]>([]);
  const [player2List, setPlayer2List] = useState<number[]>([]);

  const handleClick = useCallback((e: any, list: string) => {
    e.preventDefault();
    setClickedItem(list);
  }, []);

  const onClickParticipate = useCallback(() => {
    if (gameRoomInfo) {
      if (gameRoomInfo.isPrivate) {
        setEnterPrivateGameRoom(true);
      } else {
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
      }
    }
  }, [gameRoomId, gameRoomInfo, router]);

  const onSubmitPassword = useCallback((e) => {
    e.preventDefault();
    if (gameRoomInfo) {
      axios.post(`/api/game/room/${gameRoomInfo.gameRoomId}/join`, {
        password,
        role: 'observer',
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setEnterPrivateGameRoom(false);
        router.push(`/play/room/${gameRoomInfo.gameRoomId}`);
      }).catch(() => {
        setPassword('');
        toast.error('틀린 비밀번호 입니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [gameRoomInfo, password, router, setPassword]);

  const onClosePasswordModal = useCallback(() => {
    setEnterPrivateGameRoom(false);
    setPassword('');
  }, [setPassword]);

  const OnlineList = useCallback((data: number[]) => {
    setOnlineList(data);
  }, []);

  const OnPlayerList = useCallback((data: IStatusPlayer) => {
    setPlayer1List(data.player1);
    setPlayer2List(data.player2);
  }, []);

  useEffect(() => {
    socket?.emit('onlineList');
  }, [socket]);

  useEffect(() => {
    socket?.on('onlineList', OnlineList);
    return (() => {
      socket?.off('onlineList');
    });
  }, [OnlineList, socket]);

  useEffect(() => {
    socket?.on('playerList', OnPlayerList);
    return (() => {
      socket?.off('playerList');
    });
  }, [OnPlayerList, socket]);

  if (!show) {
    return null;
  }

  return (
    <div className="w-full">
      {enterPrivateGameRoom && gameRoomInfo
        ? (
          <div className="bg-sky-100 p-5">
            <PasswordModal
              name={gameRoomInfo.title}
              password={password}
              onChangePassword={onChangePassword}
              onSubmitPassword={onSubmitPassword}
              onCloseModal={onClosePasswordModal}
            />
          </div>
        )
        : (
          <>
            <div className="grid grid-cols-4">
              <button
                type="button"
                onClick={(e) => handleClick(e, 'friendList')}
                className={`px-5 py-2 text-xl rounded-t-md ${clickedItem === 'friendList' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'}`}
              >
                친구 목록
              </button>
              <button
                type="button"
                onClick={(e) => handleClick(e, 'friendNewList')}
                className={`px-5 py-2 text-xl rounded-t-md ${clickedItem === 'friendNewList' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'}`}
              >
                요청받은 친구목록
              </button>
              <button
                type="button"
                onClick={(e) => handleClick(e, 'friendWaitList')}
                className={`px-5 py-2 text-xl rounded-t-md ${clickedItem === 'friendWaitList' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'}`}
              >
                요청보낸 친구목록
              </button>
              <button
                type="button"
                onClick={(e) => handleClick(e, 'blockedList')}
                className={`px-5 py-2 text-xl rounded-t-md ${clickedItem === 'blockedList' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'}`}
              >
                차단 목록
              </button>
            </div>
            <div className="bg-sky-700 p-5 space-y-5 rounded-bl-md">
              <FriendList
                show={clickedItem === 'friendList'}
                setGameRoomId={setGameRoomId}
                onClickParticipate={onClickParticipate}
                onlineList={onlineList}
                player1List={player1List}
                player2List={player2List}
              />
              <FriendNewList
                show={clickedItem === 'friendNewList'}
                setGameRoomId={setGameRoomId}
                onClickParticipate={onClickParticipate}
                onlineList={onlineList}
                player1List={player1List}
                player2List={player2List}
              />
              <FriendWaitList
                show={clickedItem === 'friendWaitList'}
                setGameRoomId={setGameRoomId}
                onClickParticipate={onClickParticipate}
                onlineList={onlineList}
                player1List={player1List}
                player2List={player2List}
              />
              <BlockedList show={clickedItem === 'blockedList'} />
            </div>
          </>
        )}
    </div>
  );
};

export default FriendListCard;
