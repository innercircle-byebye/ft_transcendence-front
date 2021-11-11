import { ChangeEvent, VFC } from 'react';

interface IProps {
  nickname: string;
  onChangeNickname: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickResetNickname?: () => void;
}

const InputNickname: VFC<IProps> = ({
  nickname, onChangeNickname, onClickResetNickname,
}) => (
  <div className="mb-4 w-64">
    <label htmlFor="nickname">
      <span className="text-gray-700 text-sm font-bold mb-2 mr-1">
        Nickname
      </span>
      <button
        className=" text-sky-600 py-1 px-3 rounded-full focus:outline-none focus:shadow-outline"
        type="button"
        onClick={onClickResetNickname}
      >
        Reset
      </button>
      <input
        id="nickname"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder={nickname}
        value={nickname}
        onChange={onChangeNickname}
      />
    </label>
    {!nickname && (
      <p className="text-red-500 text-xs italic">
        닉네임을 입력해주세요.
      </p>
    )}
  </div>
);

export default InputNickname;
