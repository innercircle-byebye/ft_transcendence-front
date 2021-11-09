import { useRouter } from 'next/router';
import React, {
  useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import { IGameResult } from '@/typings/db';
import HistoryItem from './HistoryItem';

interface IProps {
  userId: number;
}

const HistoryList: VFC<IProps> = ({ userId }) => {
  const router = useRouter();
  const { name } = router.query;
  const { data: historyData } = useSWR<IGameResult[]>(`/api/game/${userId}/results?perPage=${10}&page=${1}`);
  const [winCount, setWinCount] = useState<number>(0);
  const [loseCount, setLoseCount] = useState<number>(0);

  const onClickHistory = useCallback(() => {
    router.push('/history');
  }, [router]);

  useEffect(() => {
    if (name && historyData) {
      historyData.forEach((data) => {
        if (data.playerOneNickname === name && data.playerOneScore > data.playerTwoScore) {
          setWinCount((prev) => prev + 1);
        }
      });
    }
  }, [historyData, name]);

  useEffect(() => {
    if (historyData) {
      setLoseCount((historyData.length < 10 ? historyData.length : 10) - winCount);
    }
  }, [historyData, winCount]);

  return (
    <div>
      <div className="flex items-end justify-between">
        <span className="px-5 py-2 bg-sky-700 text-white text-xl rounded-t-md">
          {`최근 10게임 전적 (${winCount}승 ${loseCount}패)`}
        </span>
        <button type="button" onClick={onClickHistory} className="px-5">더보기</button>
      </div>
      <div className="bg-sky-700 p-5 space-y-5 rounded-r-md rounded-bl-md">
        {historyData?.map((data) => (<HistoryItem key={data.gameResultId.toString() + data.startAt} historyData={data} textColor="text-sky-700" />))}
      </div>
    </div>
  );
};

export default HistoryList;
