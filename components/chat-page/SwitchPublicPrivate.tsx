import {
  ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState, VFC,
} from 'react';

interface IProps {
  isChannelOwner?: boolean;
  isPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  password: string;
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  setPassword: Dispatch<SetStateAction<string>>;
  isPrivateChannel?: boolean;
  changePassword?: boolean;
  setChangePassword?: Dispatch<SetStateAction<boolean>>;
}

const CheckPublicPrivate: VFC<IProps> = ({
  isChannelOwner = true, isPrivate, setIsPrivate, password, onChangePassword, setPassword,
  isPrivateChannel, changePassword = true, setChangePassword,
}) => {
  const [passwordError, setPasswordError] = useState(false);
  const [inputPasswordType, setInputPasswordType] = useState({
    type: 'password',
    visible: false,
  });

  const onClickSwitch = useCallback(
    (e) => {
      if (!isChannelOwner) {
        return;
      }
      e.preventDefault();
      setIsPrivate((prev) => !prev);
      setPassword('');
      setInputPasswordType({ type: 'password', visible: false });
    },
    [isChannelOwner, setIsPrivate, setPassword],
  );

  const onClickPasswordEye = useCallback(() => {
    setInputPasswordType((prev) => ({
      type: prev.type === 'text' ? 'password' : 'text',
      visible: !prev.visible,
    }));
  }, []);

  const onClickChangePassword = useCallback(() => {
    if (setChangePassword) setChangePassword(true);
  }, [setChangePassword]);

  const onClickCancelChangePassword = useCallback(() => {
    if (setChangePassword) setChangePassword(false);
  }, [setChangePassword]);

  useEffect(() => {
    const passwordPattern = /^[0123456789]{4}$/;
    if (password && passwordPattern.test(password)) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }, [password]);

  return (
    <>
      <div className="ml-3 text-gray-700 font-medium">Public / Private</div>
      <div className="flex items-center space-x-8">
        <button type="button" className="relative" onClick={onClickSwitch}>
          <div className="block bg-gray-700 w-14 h-8 rounded-full" />
          {isPrivate ? (
            <div className="absolute right-1 top-1 bg-red-400 w-6 h-6 rounded-full transition" />
          ) : (
            <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
          )}
        </button>
        {isChannelOwner && isPrivate && !changePassword
        && <button type="button" onClick={onClickChangePassword} className="bg-gray-400 rounded-full px-1 text-sm">비밀번호변경</button>}
        {isChannelOwner && isPrivate && isPrivateChannel && changePassword
        && <button type="button" onClick={onClickCancelChangePassword} className="bg-gray-400 rounded-full px-1 text-sm">변경취소</button>}
      </div>
      {isChannelOwner && isPrivate && changePassword && (
      <>
        <div className="ml-3 text-gray-700 font-medium">비밀번호</div>
        <div>
          <div className="flex flex-row items-center space-x-2">
            <input
              className="px-6 py-2 w-24 rounded-full bg-gray-100 text-lg"
              type={inputPasswordType.type}
              value={password}
              onChange={onChangePassword}
              placeholder="****"
              maxLength={4}
            />
            <button type="button" onClick={onClickPasswordEye}>
              {inputPasswordType.visible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          {passwordError && (
            <div className="absolute items-center text-red-500 text-xs italic">
              비밀번호 숫자4자리 입력해주세요
            </div>
          )}
        </div>
      </>
      )}
    </>
  );
};

export default CheckPublicPrivate;
