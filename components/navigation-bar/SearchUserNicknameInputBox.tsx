import React, { useCallback } from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import useInput from '@/hooks/useInput';
// import router from 'next/router';

const SearchUserNicknameInputBox = () => {
  const [userNickname, onChangeUserNickname] = useInput('');

  const onKeyPressHandler = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        console.log(e.target.value);
        // search 창으로 이동
      }
    },
    // 이 부분이 없으면 계속 빈칸만 나옵니다...
    [],
  );

  return (
    <div className="flex flex-row items-center bg-white rounded-full px-3 py-1 gap-2">
      <SearchIcon className="hover:text-black w-6 h-6 text-gray-900" />
      <div>
        <input
          type="text"
          className="outline-none w-full px-1 sm:text-sm text-gray-900"
          placeholder="Search user Nickname"
          onChange={onChangeUserNickname}
          onKeyPress={onKeyPressHandler}
          value={userNickname}
        />
      </div>
    </div>
  );
};
export default SearchUserNicknameInputBox;
