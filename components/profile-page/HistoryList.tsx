import { useRouter } from 'next/router';
import React, { useCallback, VFC } from 'react';
import HistoryItem from './HistoryItem';

const HistoryList: VFC = () => {
  const router = useRouter();

  const onClickHistory = useCallback(() => {
    router.push('/history');
  }, [router]);

  return (
    <div>
      <div className="flex items-end justify-between">
        <span className="px-5 py-2 bg-sky-700 text-white text-xl rounded-t-md">
          최근 10게임 전적 (6승 4패)
        </span>
        <button type="button" onClick={onClickHistory} className="px-5">더보기</button>
      </div>
      <div className="bg-sky-700 p-5 space-y-5 rounded-r-md rounded-bl-md">
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
      </div>
    </div>
  );
};

export default HistoryList;
