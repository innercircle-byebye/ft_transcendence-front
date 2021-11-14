import {
  Dispatch, SetStateAction, useCallback, useState, VFC,
} from 'react';
import useSWR from 'swr';
import useInput from '@/hooks/useInput';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  setSelectQuery: Dispatch<SetStateAction<string>>;
  setNicknameNotExist: Dispatch<SetStateAction<boolean>>;
}

interface IQuery {
  vsUserId?: number | null;
  ballSpeed?: string | null;
  date?: string | null;
}

const HistorySelect: VFC<IProps> = ({ setSelectQuery, setNicknameNotExist }) => {
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher);
  const [nickname, onChangeNickname] = useInput<string>('');
  const [ballSpeed, setBallSpeed] = useState<string>('');
  const [date, onChangeDate] = useInput<string>('');
  const { data: nicknameUserData } = useSWR<IUser>(allUserData?.find((data) => data.nickname === nickname) ? `/api/user/nickname/${nickname}` : null, fetcher);

  const onClickSelect = useCallback(() => {
    const query: IQuery = {};
    if (nicknameUserData
      && allUserData?.find((data) => data.nickname === nickname) && nickname.trim().length) {
      query.vsUserId = nicknameUserData.userId;
    } else {
      setNicknameNotExist(true);
    }
    if (!nickname.trim().length || allUserData?.find((data) => data.nickname === nickname)) {
      setNicknameNotExist(false);
    } else {
      setNicknameNotExist(true);
    }
    if (ballSpeed.trim().length) {
      query.ballSpeed = ballSpeed;
    }
    if (date.trim().length) {
      query.date = date;
    }
    setSelectQuery(`&${Object.entries(query).map((e) => e.join('=')).join('&')}`);
  }, [nicknameUserData, allUserData, nickname, ballSpeed, date,
    setSelectQuery, setNicknameNotExist]);

  const onChangeBallSpeed = useCallback((e) => {
    setBallSpeed(e.target.value);
  }, []);

  return (
    <div className="flex space-x-3 items-end px-5">
      <label htmlFor="nickname" className="flex flex-col">
        <span className="text-xl">VS</span>
        <input type="text" id="nickname" placeholder="nickname" value={nickname} onChange={onChangeNickname} className="w-32 text-xl px-2 py-1 rounded-md outline-none" />
      </label>
      <label htmlFor="game-option" className="flex flex-col">
        <span className="text-xl">Game Option</span>
        <select id="game-option" className="text-xl px-2 py-1 rounded-md outline-none" onChange={onChangeBallSpeed}>
          <option value="">--choose--</option>
          <option value="slow">하</option>
          <option value="medium">중</option>
          <option value="fast">상</option>
        </select>
      </label>
      <label htmlFor="date" className="flex flex-col">
        <span className="text-xl">Date</span>
        <input id="date" type="date" className="text-xl px-2 py-1 rounded-md outline-none" value={date} onChange={onChangeDate} />
      </label>
      <button type="button" onClick={onClickSelect} className="w-20 h-10 bg-indigo-600 rounded-md text-white">설정하기</button>
    </div>
  );
};

export default HistorySelect;
