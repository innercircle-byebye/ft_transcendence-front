import {
  ChangeEvent, Dispatch, SetStateAction, useEffect, VFC,
} from 'react';

interface IProps {
  email: string;
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  emailError: boolean;
  setEmailError: Dispatch<SetStateAction<boolean>>;
  onClickResetEmail: () => void;
}

const InputEmail: VFC<IProps> = ({
  email, onChangeEmail, emailError, setEmailError, onClickResetEmail,
}) => {
  useEffect(() => {
    const emailForm = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    setEmailError(!emailForm.test(email));
  });

  return (
    <div className="mb-6 w-64">
      <label htmlFor="email">
        <span className="text-gray-700 text-sm font-bold mb-2 mr-1">
          Email
        </span>
        <button
          className="text-sky-600 py-1 px-3 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClickResetEmail}
        >
          Reset
        </button>
        <input
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          placeholder={email}
          value={email}
          onChange={onChangeEmail}
        />
      </label>
      {!email && (
      <p className="text-red-500 text-xs italic">
        이메일을 입력해주세요.
      </p>
      )}
      {email && emailError && (
      <p className="text-red-500 text-xs italic">
        잘못된 이메일 주소입니다.
      </p>
      )}
    </div>
  );
};

export default InputEmail;
