import React, { VFC } from 'react';
import HistoryItem from '../profile-page/HistoryItem';

const HistoryList: VFC = () => (
  <div className="space-y-3">
    <HistoryItem textColor="text-indigo-700" />
    <HistoryItem textColor="text-indigo-700" />
    <HistoryItem textColor="text-indigo-700" />
  </div>
);

export default HistoryList;
