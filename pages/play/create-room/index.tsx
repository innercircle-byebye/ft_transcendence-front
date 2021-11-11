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
import InputName from '@/components/inputs/InputName';
import InputNumber from '@/components/inputs/InputNumber';
import PageContainer from '@/components/create-page/PageContainer';
import ContentContainerWithTitle from '@/components/create-page/ContentContainerWithTitle';

const CreateRoom = ({ allRoomList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { invite } = router.query;
  const [roomName, onChangeRoomName] = useInput('');
  const [roomNameError, setRoomNameError] = useState(false);
  const [difficulty, onChangeDifficulty] = useInput(0);
  const [ballSpeed, setBallSpeed] = useState('slow');
  const [winScore, onChangeWinScore, setWinScore] = useInput(5);
  const [numOfSpectator, onChangeNumOfSpectator, setNumOfSpectator] = useInput(5);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, onChangePassword, setPassword] = useInput('');
  const [passwordError, setPasswordError] = useState(false);

  const onClickCancel = useCallback(() => {
    router.push('/play');
  }, [router]);

  const onClickMake = useCallback(() => {
    axios.post(invite ? `/api/game/room?invitedUserId=${invite}` : '/api/game/room', {
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
  }, [ballSpeed, invite, isPrivate, numOfSpectator, password, roomName, router, winScore]);

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

  useEffect(() => {
    if (winScore < 1) setWinScore(1);
    if (winScore > 10) setWinScore(10);
  }, [setWinScore, winScore]);

  useEffect(() => {
    if (numOfSpectator < 2) setNumOfSpectator(2);
    if (numOfSpectator > 8) setNumOfSpectator(8);
  }, [numOfSpectator, setNumOfSpectator]);

  return (
    <PageContainer>
      <ContentContainerWithTitle isPrivate={isPrivate} title="Create Game Room">
        <div className="col-span-2">
          <InputName type="게임방이름" name={roomName} onChangeName={onChangeRoomName} nameError={roomNameError} />
        </div>
        <span>
          난이도(하 / 중 / 상)
        </span>
        <input type="range" min="0" max="2" value={difficulty} onChange={onChangeDifficulty} list="tickmarks" className="outline-none" />
        <datalist id="tickmarks">
          <option value="0" label="0%" />
          <option value="1" label="50%" />
          <option value="2" label="100%" />
        </datalist>
        <InputNumber type="승리점수(1 ~ 10)" value={winScore} onChangeValue={onChangeWinScore} min={1} max={10} />
        <InputNumber type="인원수(2 ~ 8)" value={numOfSpectator} onChangeValue={onChangeNumOfSpectator} min={2} max={8} />
        <SwitchPublicPrivate
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
          password={password}
          onChangePassword={onChangePassword}
          setPassword={setPassword}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
        />
        <button
          className="bg-gray-400 text-white py-3 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClickCancel}
        >
          CANCEL
        </button>
        <button
          className="bg-amber-600 text-white py-3 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClickMake}
          disabled={!roomName.trim().length || roomNameError || (isPrivate && passwordError)}
        >
          SAVE
        </button>
      </ContentContainerWithTitle>
      <ToastContainer />
    </PageContainer>
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
