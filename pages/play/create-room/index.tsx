import { useRouter } from 'next/dist/client/router';
import React, { ReactElement, useCallback, useState } from 'react';
import useInput from '@/hooks/useInput';
import SwitchPublicPrivate from '@/components/chat-page/common/SwitchPublicPrivate';
import Navbar from '@/components/navigation-bar/Navbar';

const CreateRoom = () => {
  const router = useRouter();
  const [roomName, onChangeRoomName] = useInput('');
  const [difficulty, onChangeDifficulty] = useInput(0);
  const [winScore, onChangeWinScore] = useInput(5);
  const [numOfSpectator, onChangeNumOfSpectator] = useInput(5);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, onChangePassword, setPassword] = useInput('');
  const [passwordError, setPasswordError] = useState(false);

  const onClickCancel = useCallback(() => {
    router.push('/play');
  }, [router]);

  const onClickMake = useCallback(() => {
    router.push('/play');
  }, [router]);

  return (
    <div className="flex-1 bg-gray-200">
      <div className="flex flex-col items-center gap-10 pt-28">
        <p className="text-5xl">Create Game Room</p>
        <input type="text" placeholder="방이름" value={roomName} onChange={onChangeRoomName} className="col-span-2 w-80 px-6 py-4 rounded-full bg-gray-100 text-xl outline-none" />
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
            disabled={isPrivate && passwordError}
          >
            MAKE
          </button>
        </div>
      </div>
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

export default CreateRoom;
