import { ChangeEvent, VFC } from 'react';

interface IProps {
  name: string;
  password: string;
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmitPassword: (e: any) => void;
  onCloseModal: (e: any) => void;
}

const PasswordModal: VFC<IProps> = ({
  name, password, onChangePassword, onSubmitPassword, onCloseModal,
}) => (
  <div className="w-full h-full bg-sky-100 flex items-center justify-center">
    <form className="flex flex-col items-center gap-10" onSubmit={onSubmitPassword}>
      <div className="flex flex-row items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-3xl">{name}</div>
      </div>
      <div className="text-2xl">비밀번호를 입력해주세요</div>
      <input type="password" maxLength={4} placeholder="****" value={password} onChange={onChangePassword} className="rounded-full text-3xl w-24 px-5 py-1  outline-none" />
      <div className="flex flex-row space-x-5">
        <button type="submit" className=" text-xl px-4 py-1 rounded-full bg-amber-500">입장하기</button>
        <button type="button" onClick={onCloseModal} className=" text-xl px-8 py-1 rounded-full bg-gray-300">취소</button>
      </div>
    </form>
  </div>
);

export default PasswordModal;
