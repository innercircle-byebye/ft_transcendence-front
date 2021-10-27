import { ChangeEvent, VFC } from 'react';

interface IProps {
  channelName: string;
  password: string;
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmitPassword: () => void;
  onCloseModal: (e: any) => void;
}

const PasswordModal: VFC<IProps> = ({
  channelName, password, onChangePassword, onSubmitPassword, onCloseModal,
}) => (
  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <form className="relative bg-amber-100 flex flex-col items-center space-y-8 px-10 pt-8 rounded-xl" onSubmit={onSubmitPassword}>
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
        <div className="text-3xl">{channelName}</div>
      </div>
      <div className="text-2xl">비밀번호를 입력해주세요</div>
      <div className="flex flex-row space-x-3">
        <input type="password" maxLength={4} placeholder="****" value={password} onChange={onChangePassword} className="rounded-full text-3xl w-24 px-5 py-1  outline-none" />
        <button type="submit" className=" text-lg px-4 py-1 rounded-full bg-amber-500">입장하기</button>
      </div>
      <button type="button" onClick={onCloseModal}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-5 right-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </form>
  </div>
);

export default PasswordModal;
