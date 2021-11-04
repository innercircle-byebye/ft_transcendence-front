import { useRouter } from 'next/dist/client/router';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import useInput from '@/hooks/useInput';
import SwitchPublicPrivate from '@/components/chat-page/common/SwitchPublicPrivate';
import Navbar from '@/components/navigation-bar/Navbar';
import { IGameRoom } from '@/typings/db';

const CreateRoom = ({ allRoomList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [roomName, onChangeRoomName] = useInput('');
  const [roomNameError, setRoomNameError] = useState(false);
  const [difficulty, onChangeDifficulty] = useInput(0);
  const [ballSpeed, setBallSpeed] = useState('slow');
  const [winScore, onChangeWinScore] = useInput(5);
  const [numOfSpectator, onChangeNumOfSpectator] = useInput(5);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, onChangePassword, setPassword] = useInput('');
  const [passwordError, setPasswordError] = useState(false);

  const onClickCancel = useCallback(() => {
    router.push('/play');
  }, [router]);

  const onClickMake = useCallback(() => {
    axios.post('/api/game/room', {
      title: roomName,
      password: isPrivate ? password : null,
      maxParticipantNum: numOfSpectator,
      winPoint: winScore,
      ballSpeed,
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      router.push('/play');
    }).catch(() => {
      toast.error('방만들기에 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
    });
  }, [ballSpeed, isPrivate, numOfSpectator, password, roomName, router, winScore]);

  useEffect(() => {
    if (difficulty === 0) { setBallSpeed('slow'); }
    if (difficulty === 1) { setBallSpeed('medium'); }
    if (difficulty === 2) { setBallSpeed('fast'); }
  }, [difficulty]);

  useEffect(() => {
    if (allRoomList.map((v: IGameRoom) => v.title).includes(roomName)) {
      setRoomNameError(true);
    } else {
      setRoomNameError(false);
    }
  }, [allRoomList, roomName]);

  return (
    <div className="flex-1 bg-gray-200">
      <div className="flex flex-col items-center gap-10 pt-28">
        <p className="text-5xl">Create Game Room</p>
        <div className="relative">
          <input type="text" placeholder="방이름" value={roomName} onChange={onChangeRoomName} className="col-span-2 w-80 px-6 py-4 rounded-full bg-gray-100 text-xl outline-none" />
          {!roomName.trim().length && (
          <div className="absolute left-5 text-red-500 text-xs italic">
            채널명을 입력해주세요
          </div>
          )}
          {roomNameError && (
          <div className="absolute left-5 text-red-500 text-xs italic">
            이미 존재하는 채널명입니다.
          </div>
          )}
        </div>
        <form className="grid grid-cols-2 gap-8 items-center">
          <span>
            난이도(하 / 중 / 상)
          </span>
          <input type="range" min="0" max="2" value={difficulty} onChange={onChangeDifficulty} list="tickmarks" className="outline-none" />
          <datalist id="tickmarks">
            <option value="0" label="0%" />
            <option value="1" label="50%" />
            <option value="2" label="100%" />
          </datalist>
          <span>
            승리점수
          </span>
          <input type="number" value={winScore} onChange={onChangeWinScore} className="px-6 py-2 w-24 rounded-full bg-gray-100 text-xl outline-none" />
          <span>
            최대관전자수
          </span>
          <input type="number" value={numOfSpectator} onChange={onChangeNumOfSpectator} className="px-6 py-2 w-24 rounded-full bg-gray-100 text-xl outline-none" />
          <SwitchPublicPrivate
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            password={password}
            onChangePassword={onChangePassword}
            setPassword={setPassword}
            passwordError={passwordError}
            setPasswordError={setPasswordError}
          />
        </form>
        <div className="space-x-4">
          <button
            className="bg-gray-400 text-white py-3 px-8 rounded-full focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onClickCancel}
          >
            CANCEL
          </button>
          <button
            className="bg-amber-600 text-white py-3 px-10 rounded-full focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onClickMake}
            disabled={!roomName.trim().length || roomNameError || (isPrivate && passwordError)}
          >
            SAVE
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

CreateRoom.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      {page}
    </div>
  );
};

interface IProps {
  allRoomList: IGameRoom[];
}

export const getServerSideProps: GetServerSideProps<IProps> = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';

  const allRoomList: IGameRoom[] = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/game/room/list`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  return {
    props: {
      allRoomList,
    },
  };
};

export default CreateRoom;
