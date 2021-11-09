import { VFC } from 'react';

interface IProps {
  textColor?: string;
}

const HistoryItem: VFC<IProps> = ({ textColor = 'text-sky-700' }) => (
  <div className={`${textColor} bg-amber-50 text-xl rounded-md px-5 py-2 flex justify-between`}>
    <span>2021.11.09</span>
    <span>kat</span>
    <span>승</span>
  </div>
);

export default HistoryItem;
