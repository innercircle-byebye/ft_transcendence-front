import { ChangeEvent, VFC } from 'react';

interface IProps {
  type: string;
  name: string;
  onChangeName: (e: ChangeEvent<HTMLInputElement>) => void;
  nameError: boolean;
}

const InputName: VFC<IProps> = ({
  type, name, onChangeName, nameError,
}) => (
  <div className="relative">
    <input
      className="w-80 px-6 py-4 rounded-full bg-gray-100 text-xl outline-none"
      placeholder="채널명"
      type="text"
      value={name}
      onChange={onChangeName}
    />
    {!name.trim().length && (
      <div className="absolute left-5 text-red-500 text-xs italic">
        {`${type}을 입력해주세요`}
      </div>
    )}
    {nameError && (
      <div className="absolute left-5 text-red-500 text-xs italic">
        {`이미 존재하는 ${type}입니다.`}
      </div>
    )}
  </div>
);

export default InputName;
