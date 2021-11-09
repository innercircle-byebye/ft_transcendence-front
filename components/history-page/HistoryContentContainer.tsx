import { VFC } from 'react';
import useInput from '@/hooks/useInput';
import HistoryList from './HistoryList';
import HistorySelect from './HistorySelect';

const HistoryContentContainer: VFC = () => {
  const [nickname, onChangeNickname] = useInput('');

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-4xl leading-10">History</h1>
      </div>
      <div className="p-4 rounded-md bg-gray-300 space-y-5">
        <HistorySelect nickname={nickname} onChangeNickname={onChangeNickname} />
        <HistoryList />
      </div>
    </div>
  );
};

export default HistoryContentContainer;
