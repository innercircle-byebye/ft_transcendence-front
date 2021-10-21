import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Navbar from '@/components/Navbar';
import useInput from '@/hooks/useInput';

const CreateChannel = () => {
  const router = useRouter();
  const [channelName, onChangeChannelName] = useInput('');
  const [maxMemberNum, onChangeMaxMemberNum, setMaxMemberNum] = useInput(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, onChangePassword, setPassword] = useInput('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [inputPasswordType, setInputPasswordType] = useState({
    type: 'password',
    visible: false,
  });

  const onClickSwitch = useCallback(
    (e) => {
      e.preventDefault();
      setIsPrivate((prev) => !prev);
      setPassword('');
      setInputPasswordType({ type: 'password', visible: false });
    },
    [setPassword],
  );

  const onClickPasswordEye = useCallback(() => {
    setInputPasswordType((prev) => ({
      type: prev.type === 'text' ? 'password' : 'text',
      visible: !prev.visible,
    }));
  }, []);

  const onClickCancel = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    if (maxMemberNum < 3) {
      setMaxMemberNum(3);
    }

    const passwordPattern = /^[0123456789]{4}$/;
    if (password && passwordPattern.test(password)) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
  }, [maxMemberNum, password, setMaxMemberNum]);

  return (
    <div className="w-screen h-full flex flex-col items-center space-y-20">
      <div className="grid grid-cols-7 justify-items-start mt-20">
        {isPrivate && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="col-span-1 h-10 w-10"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <div className="col-start-2 col-span-6 text-5xl">
          Create Chat Channel
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 items-center">
        <input
          className="col-span-2 w-80 px-6 py-4 rounded-full bg-gray-100 text-xl"
          placeholder="채널명"
          type="text"
          value={channelName}
          onChange={onChangeChannelName}
        />
        <div className="ml-3 text-gray-700 font-medium">최대멤버수</div>
        <input
          className="px-6 py-2 w-24 rounded-full bg-gray-100 text-xl"
          type="number"
          min={3}
          value={maxMemberNum}
          onChange={onChangeMaxMemberNum}
        />
        <div className="ml-3 text-gray-700 font-medium">Public / Private</div>
        <div>
          <button type="button" className="relative" onClick={onClickSwitch}>
            <div className="block bg-gray-600 w-14 h-8 rounded-full" />
            {isPrivate ? (
              <div className="absolute right-1 top-1 bg-red-400 w-6 h-6 rounded-full transition" />
            ) : (
              <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
            )}
          </button>
        </div>
        {isPrivate && (
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
              {!isValidPassword && (
                <div className="absolute items-center text-red-500 text-xs italic">
                  비밀번호 숫자4자리 입력해주세요
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div>invite member</div>
      <div className="space-x-4">
        <button
          className="bg-gray-400 text-white py-3 px-8 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClickCancel}
        >
          CANCEL
        </button>
        <button
          className="bg-amber-600 text-white py-3 px-10 rounded-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

CreateChannel.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      <div className="bg-gray-300 flex flex-row h-auto flex-1">
        <main>{page}</main>
      </div>
    </div>
  );
};

export default CreateChannel;
