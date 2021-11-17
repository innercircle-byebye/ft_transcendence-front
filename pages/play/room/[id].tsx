import { useRouter } from 'next/router';
import {
  useCallback, useEffect, useState, VFC,
} from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import GameScreen from '@/components/play-room-page/GameScreen';
import RoomButtonList from '@/components/play-room-page/RoomButtonList';
import PlayerInfo from '@/components/play-room-page/PlayerInfo';
import useSocket from '@/hooks/useSocket';
import {
  IGameChat, IGameOption, IGameRoom, IGameRoomData, IGameUpdateData, IParticipant, IUser,
} from '@/typings/db';
import ChatInputBox from '@/components/play-room-page/ChatInputBox';
import useInput from '@/hooks/useInput';
import GameChatList from '@/components/play-room-page/GameChatList';
import ParticipantList from '@/components/play-room-page/ParticipantList';
import setParticipantListData from '@/utils/setParticipantListData';
import GameResultModal from '@/components/play-room-page/GameResult';
import ChatTwoButtonModal from '@/components/chat-page/common/ChatTwoButtonModal';
import GameOptionModal from '@/components/play-room-page/GameOptionModal';
import checkRoleMoveDisabled from '@/utils/checkRoleMoveDisabled';

interface IProps {
  userInitialData: IUser;
  roomData: IGameRoom;
}
const Room: VFC<IProps> = ({
  userInitialData,
  roomData,
}: {
  userInitialData: IUser,
  roomData: IGameRoom,
}) => {
  const router = useRouter();
  const roomNumber = router.query.id;
  const [isChatting, setIsChatting] = useState(true);
  const { socket, disconnect } = useSocket('game');
  const [updateData, setUpdateData] = useState<IGameUpdateData[] | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameChat, onChangeGameChat, setGameChat] = useInput('');
  // player Info
  const [name1P, setName1P] = useState<string>('');
  const [name2P, setName2P] = useState<string>('');
  const [isReady1P, setIsReady1P] = useState(false);
  const [isReady2P, setIsReady2P] = useState(false);
  // my role
  const [myRole, setMyRole] = useState<string>('');
  // participant data
  const [participantData, setParticipantData] = useState<IParticipant[]>([]);
  // game result modal
  const [gameResultMessage, setGameResultMessage] = useState<string>('');
  const [isShowGameResultModal, setIsShowGameResultModal] = useState<boolean>(false);
  // game room exit modal
  const [isShowExitRoomModal, setIsShowExitRoomModal] = useState<boolean>(false);
  // game option modal
  const [isShowGameOptionModal, setIsShowGameOptionModal] = useState<boolean>(false);
  // public | private state
  const [
    isShowPasswordInputBox, setIsShowPasswordInputBox,
  ] = useState<boolean>(false);
  // game option
  const [resetData, setResetData] = useState<IGameRoom>();
  const [ballSpeed, setBallSpeed] = useState<string>('');
  const [title, onChangeTitle, setTitle] = useInput<string>('');
  const [roomPassword, onChangeRoomPassword, setRoomPassword] = useInput<string>('');
  const [difficulty, onChangeDifficulty, setDifficulty] = useInput<string>('');
  const [winScore, onChangeWinScore, setWinScore] = useInput<number>(0);
  const [
    numOfParticipant,
    onChangeNumOfParticipant,
    setNumOfParticipant,
  ] = useInput(0);
  // leave event 추가
  const [isShowInvalidAccessModal, setIsShowInvalidAccessModal] = useState<boolean>(false);
  // RoleMoveDisable 체크 변수, false 면 해당 버튼 클릭가능
  const [isRoleMoveDisabled, setIsRoleMoveDisabled] = useState<boolean>(false);

  // 방 시작할때,
  useEffect(() => {
    console.log('시작! roomData', roomData);
    // 방 터진상황
    if (roomData === null) {
      router.push('/play');
    }
    // 방 존재
    setResetData(roomData);
    setBallSpeed(roomData.gameResults[roomData.gameResults.length - 1].ballSpeed);
    if (ballSpeed === 'slow') {
      setDifficulty('0');
    } else if (ballSpeed === 'medium') {
      setDifficulty('1');
    } else if (ballSpeed === 'fast') {
      setDifficulty('2');
    }
    setTitle(roomData.title);
    setWinScore(roomData.gameResults[roomData.gameResults.length - 1].winPoint);
    setNumOfParticipant(roomData.maxParticipantNum);
    setIsShowPasswordInputBox(roomData.isPrivate);
  }, [ballSpeed, roomData, router, setDifficulty, setNumOfParticipant, setTitle, setWinScore]);

  useEffect(() => {
    // initSetting -> gameRoomData
    socket?.on('gameRoomData', (data: IGameRoomData) => {
      console.log('gameRoomData', data);
      if (data.participants.player1) {
        setName1P(data.participants.player1.nickname);
      } else {
        setName1P('');
      }
      if (data.participants.player2) {
        setName2P(data.participants.player2.nickname);
      } else {
        setName2P('');
      }
      setMyRole(data.role);
      console.log('myRole', myRole);
      if (data.isPlaying) {
        setIsPlaying(true);
      }
      if (data.player1Ready) {
        setIsReady1P(true);
      }
      if (data.player2Ready) {
        setIsReady2P(true);
      }
      // set participant data
      setParticipantListData(setParticipantData, data);
      // check role move disable
      checkRoleMoveDisabled(setIsRoleMoveDisabled, data);
    });
  }, [disconnect, myRole, router.query.id, socket, userInitialData.userId]);

  useEffect(() => {
    socket?.emit('joinGameRoom', {
      gameRoomId: router.query.id,
      userId: userInitialData.userId,
    });
  }, [router.query.id, socket, userInitialData.userId]);

  // playing
  useEffect(() => {
    // data update
    socket?.on('update', (data) => setUpdateData(data));
  });

  const showInvalidAccess = useCallback(() => {
    setIsShowInvalidAccessModal(true);
  }, []);

  useEffect(() => {
    socket?.on('leave', showInvalidAccess);
  });

  const onClickLeaveButton = useCallback(() => {
    setIsShowInvalidAccessModal(false);
    disconnect();
    router.push('/play');
    console.log('여기인가요?!');
  }, [disconnect, router]);

  // not playing
  // on ready unReady
  useEffect(() => {
    socket?.on('ready', (data) => {
      if (data === 'player1') {
        setIsReady1P(true);
      } else if (data === 'player2') {
        setIsReady2P(true);
      }
    });
    socket?.on('unReady', (data) => {
      if (data === 'player1') {
        setIsReady1P(false);
      } else if (data === 'player2') {
        setIsReady2P(false);
      }
    });
  });

  // 나가기 button event handler
  const onClickExit = useCallback(() => {
    if (isPlaying && (myRole !== 'observer')) {
      setIsShowExitRoomModal(true);
    } else {
      disconnect();
      router.push('/play');
    }
  }, [disconnect, isPlaying, myRole, router]);

  // 관전하기 참여하기 button event handler
  const onClickMove = useCallback(() => {
    if (myRole === 'observer') {
      // socket?.emit('toPlayer');
      axios.patch(`/api/game/room/${roomNumber}/move/player`, {}, {
        headers: {
          withCredentials: 'true',
        },
      });
    } else {
      // socket?.emit('toObserver');
      axios.patch(`/api/game/room/${roomNumber}/move/observer`, {}, {
        headers: {
          withCredentials: 'true',
        },
      });
      // then catch 가 필요없다.
      // gameRoomData event 에 결과가 반영되기떄문에
    }
  }, [myRole, roomNumber]);

  // 게임 옵션 button event handler
  const onClickOption = useCallback(() => {
    setIsShowGameOptionModal(true);
  }, []);

  // Ready event
  const onClickReady1P = useCallback(() => {
    if (isReady1P) {
      setIsReady1P(false);
      socket?.emit('unReady');
    } else {
      setIsReady1P(true);
      socket?.emit('ready');
    }
  }, [isReady1P, socket]);

  const onClickReady2P = useCallback(() => {
    if (isReady2P) {
      setIsReady2P(false);
      socket?.emit('unReady');
    } else {
      setIsReady2P(true);
      socket?.emit('ready');
    }
  }, [isReady2P, socket]);

  // set isPlaying
  useEffect(() => {
    socket?.on('playing', () => {
      setIsPlaying(true);
      setIsReady1P(false);
      setIsReady2P(false);
    });
    socket?.on('gameover', (data) => {
      // 기존에 열려있을 수 있는 모든 modal 창 닫기
      setIsShowGameResultModal(false);
      setIsShowExitRoomModal(false);
      setIsPlaying(false);
      setIsReady1P(false);
      setIsReady2P(false);
      setGameResultMessage(data);
      setIsShowGameResultModal(true);
    });
  }, [socket]);

  // game result modal button event handler
  const onClickOKButton = useCallback(() => {
    setIsShowGameResultModal(false);
  }, []);

  // game room exit modal button event handler
  const onClickExitRoomButton = useCallback(() => {
    setIsShowExitRoomModal(false);
    disconnect();
    router.push('/play');
  }, [disconnect, router]);

  const onSubmitPassword = useCallback(() => {
    console.log('이것도 됩니까?');
    setRoomPassword('');
  }, [setRoomPassword]);

  const onClickShowPasswordInputBox = useCallback(
    () => {
      if (isShowPasswordInputBox) {
        setIsShowPasswordInputBox(false);
      } else {
        setIsShowPasswordInputBox(true);
      }
    },
    [isShowPasswordInputBox],
  );

  // useEffect(() => {
  //   if (difficulty === '0') { setBallSpeed('slow'); }
  //   if (difficulty === '1') { setBallSpeed('medium'); }
  //   if (difficulty === '2') { setBallSpeed('fast'); }
  // }, [difficulty, setBallSpeed]);

  useEffect(() => {
    if (winScore < 1) setWinScore(1);
    if (winScore > 10) setWinScore(10);
  }, [setWinScore, winScore]);

  useEffect(() => {
    if (numOfParticipant) {
      if (numOfParticipant < 2) setNumOfParticipant(2);
      if (numOfParticipant > 8) setNumOfParticipant(8);
    }
  }, [numOfParticipant, setNumOfParticipant]);

  const onClickGameOptionApplyButton = useCallback(() => {
    console.log('onclick Game Option Apply');
    console.log('difficulty', difficulty);
    console.log('ballSpeed', ballSpeed);
    if (difficulty === '0') {
      setBallSpeed('slow');
    } else if (difficulty === '1') {
      setBallSpeed('medium');
    } else if (difficulty === '2') {
      setBallSpeed('fast');
    }
    console.log('ball speed', ballSpeed);
    const newPatchData: IGameOption = {
      title,
      maxParticipantNum: numOfParticipant,
      winPoint: winScore,
      ballSpeed,
      password: undefined,
    };
    if (!isShowPasswordInputBox) {
      newPatchData.password = null;
    } else if (roomPassword) {
      newPatchData.password = roomPassword;
    }
    axios.patch(`/api/game/room/${roomNumber}`,
      newPatchData,
      {
        headers: {
          withCredentials: 'true',
        },
      })
      .then(() => {
        setIsShowGameOptionModal(false);
      })
      .catch((err) => {
        console.log('patch fail', err);
        toast.error('옵션 설정 실패했다', { position: 'bottom-right', theme: 'colored' });
      });
  }, [
    ballSpeed, difficulty, isShowPasswordInputBox,
    numOfParticipant, roomNumber, roomPassword, title, winScore,
  ]);

  const onClickGameOptionCancleButton = useCallback(() => {
    if (resetData) {
      setTitle(resetData.title);
      setNumOfParticipant(resetData.maxParticipantNum);
      setBallSpeed(resetData.gameResults[resetData.gameResults.length - 1].ballSpeed);
      setWinScore(resetData.gameResults[resetData.gameResults.length - 1].winPoint);
    }
    setIsShowGameOptionModal(false);
  }, [resetData, setNumOfParticipant, setTitle, setWinScore]);

  const onClickNoExitRoomButton = useCallback(() => {
    setIsShowExitRoomModal(false);
  }, []);

  // 강퇴 버튼
  const onClickKick = useCallback((userId: number) => {
    axios.delete(`/api/game/room/${roomNumber}/kick/${userId}`, {
      headers: {
        withCredentials: 'true',
      },
    });
  }, [roomNumber]);

  // 강퇴 당하면 kick 이벤트 받기
  useEffect(() => {
    socket?.on('kick', () => {
      console.log('나 강퇴당했어.. ㅠ');
      toast.error('!강퇴! 당함', { position: 'bottom-right', theme: 'colored' });
      router.push('/play');
    });
  }, [router, socket]);

  const onKeyUp = useCallback(
    (e) => {
      e.preventDefault();
      // 방향키 위쪽
      if (e.keyCode === 38) {
        console.log('key up 위');
        socket?.emit('keyUp', e.keyCode);
        // 뱡향키 아래
      } else if (e.keyCode === 40) {
        console.log('key up 아래');
        socket?.emit('keyUp', e.keyCode);
      } else if (e.code === 'Space') {
        console.log('key up space');
      }
    },
    [socket],
  );

  const onKeyDown = useCallback(
    (e) => {
      // 방향키 위쪽
      if (e.keyCode === 38) {
        console.log('key down 위');
        socket?.emit('keyDown', e.keyCode);
        // 뱡향키 아래
      } else if (e.keyCode === 40) {
        console.log('key down 아래');
        socket?.emit('keyDown', e.keyCode);
      }
    },
    [socket],
  );

  // enter key press event handler
  const onKeyPressHandler = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (gameChat && gameChat.trim()) {
          socket?.emit('gameChat', { content: gameChat });
          setGameChat('');
        }
      }
    },
    [gameChat, setGameChat, socket],
  );

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown);
  }, [onKeyDown, onKeyUp]);

  const [gameChatListData, setGameChatListData] = useState<IGameChat[]>([]);

  // chat event 받아오기
  useEffect(() => {
    socket?.on('gameChat', (data: IGameChat) => {
      // gameChatList 추가
      setGameChatListData([...gameChatListData, data]);
    });
  }, [gameChatListData, socket]);

  return (
    <div className="flex justify-center">
      {/* game screen */}
      <div className="w-3/4 pb-1/2 bg-sky-100 relative">
        <GameScreen
          isReady1P={isReady1P}
          isReady2P={isReady2P}
          onClickReady1P={onClickReady1P}
          onClickReady2P={onClickReady2P}
          name1p={name1P}
          name2p={name2P}
          role={myRole}
          updateData={updateData}
          isPlaying={isPlaying}
        />
      </div>
      {/* info screen */}
      <div className="w-1/4 bg-amber-100">
        {/* 제목이 수평 기준으로 center 정렬이 되는데, 수직기준으로 center 정렬이 안됩니다... 어찌하는 거지?! */}
        <div className="bg-gray-400 h-1/12 flex text-center justify-center items-center">
          {/* <div>{`# ${roomNumber} ${roomData.title}`}</div> */}
          <div>{`# ${roomNumber} ${title}`}</div>
        </div>
        <div className="bg-red-300 h-1/4">
          {/* player Info */}
          <PlayerInfo player1={name1P} player2={name2P} />
          {/* 향후 전적 정보도 포함해주기 */}
        </div>
        <div className="bg-green-300 h-1/12">
          {/* play room buttons */}
          {/* 3button opt & replace & exit */}
          <RoomButtonList
            myRole={myRole}
            onClickExit={onClickExit}
            onClickMove={onClickMove}
            onClickOption={onClickOption}
            isRoleMoveDisabled={isRoleMoveDisabled}
          />
        </div>
        <div className="bg-sky-300 h-7/12">
          {/* participant chatting swap button */}
          <div className="flex h-1/12 text-center">
            <button
              type="button"
              onClick={() => setIsChatting(true)}
              className={`w-1/2 ${isChatting && 'bg-sky-200'} ${
                !isChatting && 'bg-gray-400'
              }`}
            >
              chatting
            </button>
            <button
              type="button"
              onClick={() => setIsChatting(false)}
              className={`w-1/2 ${!isChatting && 'bg-sky-200'} ${
                isChatting && 'bg-gray-400'
              }`}
            >
              participant
            </button>
          </div>
          <div className="h-11/12">
            {isChatting ? (
              <div className="h-full">
                <GameChatList gameChatList={gameChatListData} />
                <ChatInputBox
                  onKeyPressHandler={onKeyPressHandler}
                  gameChat={gameChat}
                  onChangeGameChat={onChangeGameChat}
                />
              </div>
            ) : (
              <div className="h-full">
                <ParticipantList
                  myRole={myRole}
                  participantData={participantData}
                  onClickKick={onClickKick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isShowGameResultModal && (
        <GameResultModal
          gameResult={gameResultMessage}
          onClickExitButton={onClickOKButton}
        />
      )}
      {isShowExitRoomModal && (
        <ChatTwoButtonModal
          question="진짜 나가려고?"
          onClickYes={onClickExitRoomButton}
          onClickNo={onClickNoExitRoomButton}
          yesButtonColor="bg-red-300"
          noButtonColor="bg-green-300"
        />
      )}
      {isShowGameOptionModal && (
        <GameOptionModal
          myRole={myRole}
          title={title}
          onChangeTitle={onChangeTitle}
          difficulty={difficulty}
          onChangeDifficulty={onChangeDifficulty}
          winScore={winScore}
          onChangeWinScore={onChangeWinScore}
          numOfParticipant={numOfParticipant}
          onChangeNumOfParticipant={onChangeNumOfParticipant}
          onClickShowPasswordInputBox={onClickShowPasswordInputBox}
          isShowPasswordInputBox={isShowPasswordInputBox}
          roomPassword={roomPassword}
          onChangeRoomPassword={onChangeRoomPassword}
          onClickGameOptionApplyButton={onClickGameOptionApplyButton}
          onClickGameOptionCancleButton={onClickGameOptionCancleButton}
          onSubmitPassword={onSubmitPassword}
        />
      )}
      {isShowInvalidAccessModal && (
        <GameResultModal
          gameResult="비정상 접근입니다. 나가주세요."
          onClickExitButton={onClickLeaveButton}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';

  const roomData: IGameRoom | null = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/game/room/${context.query.id}`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data)
    .catch(() => (null));

  return {
    props: {
      roomData,
    },
  };
};

export default Room;
