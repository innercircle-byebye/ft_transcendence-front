import { useEffect, useState, VFC } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { IGameResult } from '@/typings/db';

interface IProps {
  historyData: IGameResult;
  textColor?: string;
}

const HistoryItem: VFC<IProps> = ({ historyData, textColor = 'text-sky-700' }) => {
  const router = useRouter();
  const { name } = router.query;
  const [isPlayerOne, setIsPlayerOne] = useState<boolean | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (name) {
      if (name === historyData.playerOneNickname) {
        setIsPlayerOne(true);
      } else {
        setIsPlayerOne(false);
      }
    }
  }, [historyData.playerOneId, historyData.playerOneNickname, name]);

  useEffect(() => {
    if (isPlayerOne !== null) {
      if (isPlayerOne && historyData.playerOneScore > historyData.playerTwoScore) {
        setResult('승');
      } else {
        setResult('패');
      }
    }
  }, [historyData.playerOneScore, historyData.playerTwoScore, isPlayerOne]);

  return (
    <div className={`${textColor} bg-amber-50 text-xl rounded-md px-5 py-2 grid grid-cols-3 justify-items-center m-3`}>
      <span>{dayjs(historyData.endAt).format('YYYY/MM/DD h:mm A')}</span>
      <span>{isPlayerOne ? historyData.playerTwoNickname : historyData.playerOneNickname}</span>
      <span>{result}</span>
    </div>
  );
};
export default HistoryItem;
