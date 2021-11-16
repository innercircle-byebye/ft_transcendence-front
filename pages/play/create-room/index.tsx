import { useRouter } from 'next/dist/client/router';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import useSWR from 'swr';
import useInput from '@/hooks/useInput';
import SwitchPublicPrivate from '@/components/chat-page/common/SwitchPublicPrivate';
import { IGameOption, IGameRoom, IUser } from '@/typings/db';
import InputName from '@/components/inputs/InputName';
import InputNumber from '@/components/inputs/InputNumber';
import PageContainer from '@/components/create-page/PageContainer';
import ContentContainerWithTitle from '@/components/create-page/ContentContainerWithTitle';
import fetcher from '@/utils/fetcher';
import MainLayout from '@/layouts/MainLayout';

const CreateRoom = ({ allRoomList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  // 해당 부분이 문제인것 같습니다.
  const { invite } = router.query;
  const { data: inviteMemberData } = useSWR<IUser>(invite ? `/api/user/nickname/${invite}` : null, fetcher);
  const [roomName, onChangeRoomName] = useInput<string>('');
  const [roomNameError, setRoomNameError] = useState(false);
  const [difficulty, onChangeDifficulty] = useInput(0);
  const [ballSpeed, setBallSpeed] = useState<string>('slow');
  const [winScore, onChangeWinScore, setWinScore] = useInput<number>(5);
  const [numOfSpectator, onChangeNumOfSpectator, setNumOfSpectator] = useInput<number>(5);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, onChangePassword, setPassword] = useInput<string>('');
  const [passwordError, setPasswordError] = useState(false);

  const onClickCancel = useCallback(() => {
    router.push('/play');
  }, [router]);

  const onClickMake = useCallback(() => {
    // IGameOption type 를 지정하기 위해서 newPostData 사용
    const newPostData: IGameOption = {
      title: roomName,
      password: isPrivate ? password : null,
      maxParticipantNum: Number(numOfSpectator),
      winPoint: Number(winScore),
      ballSpeed,
    };
    axios.post((invite && inviteMemberData) ? `/api/game/room?invitedUserId=${inviteMemberData.userId}` : '/api/game/room',
      newPostData, {
        headers: {
          withCredentials: 'true',
        },
      }).then((res) => {
      // 게임방 생성과 동시에 게임방으로 이동
      router.push(`/play/room/${res.data.gameRoomId}`);
    }).catch(() => {
      toast.error('방만들기에 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
    });
  }, [
    ballSpeed, invite, inviteMemberData,
    isPrivate, numOfSpectator, password, roomName, router, winScore,
  ]);

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
    if (winScore < 2) setWinScore(2);
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
        <InputNumber type="승리점수(2 ~ 10)" value={winScore} onChangeValue={onChangeWinScore} min={2} max={10} />
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
  return <MainLayout>{page}</MainLayout>;
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
