import React, { VFC } from 'react';
import useSWR from 'swr';
import { IGameResult } from '@/typings/db';
import HistoryItem from '@/components/profile-page/HistoryItem';

interface IProps {
  userId: number;
  perPage: number;
  page: number;
}

const HistoryList: VFC<IProps> = ({ userId, perPage, page }) => {
  const { data: historyData } = useSWR<IGameResult[]>(`/api/game/${userId}/results?perPage=${perPage}&page=${page}`);

  return (
    <div className="space-y-3">
      {historyData?.map((data) => (<HistoryItem key={data.gameResultId.toString() + data.startAt} historyData={data} textColor="text-indigo-700" />))}
    </div>
  );
};

export default HistoryList;
