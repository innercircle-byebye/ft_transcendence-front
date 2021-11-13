import { VFC } from 'react';

interface IProps {
  nickname: string;
  onChangeNickname: (e: any) => void;
}

const HistorySelect: VFC<IProps> = ({ nickname, onChangeNickname }) => (
  <div className="flex space-x-3 items-end px-5">
    <label htmlFor="nickname" className="flex flex-col">
      <span className="text-xl">VS</span>
      <input type="text" id="nickname" placeholder="nickname" value={nickname} onChange={onChangeNickname} className="w-32 text-xl px-2 py-1 rounded-md outline-none" />
    </label>
    <label htmlFor="game-option" className="flex flex-col">
      <span className="text-xl">Game Option</span>
      <select id="game-option" className="text-xl px-2 py-1 rounded-md outline-none">
        <option value="">--choose--</option>
        <option value="하">하</option>
        <option value="중">중</option>
        <option value="싱">상</option>
      </select>
    </label>
    <label htmlFor="date" className="flex flex-col">
      <span className="text-xl">Date</span>
      <input id="date" type="date" className="text-xl px-2 py-1 rounded-md outline-none" />
    </label>
    <button type="button" className="w-20 h-10 bg-indigo-600 rounded-md text-white">설정하기</button>
  </div>
);

export default HistorySelect;
