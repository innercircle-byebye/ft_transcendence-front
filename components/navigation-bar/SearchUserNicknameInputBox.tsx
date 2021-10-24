import React, { useCallback, useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';
// import router from 'next/router';

const SearchUserNicknameInputBox = () => {
  const [userNickname, setUserNickname] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickname(event.target.value);
  };

  const onClickHandler = useCallback(() => {
    console.log('User Nickname:', userNickname);
    // if (userNickname !== '') {
    //   router.push(`/profile/${userNickname}`);
    // }
  }, [userNickname]);

  const onKeyPressHandler = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onClickHandler();
      }
    },
    // 이 부분이 없으면 계속 빈칸만 나옵니다...
    [onClickHandler],
  );

  return (
    <div className="mt-1 relative flex item-center rounded-md shadow-sm w-full text-gray-900">
      <input
        type="text"
        name="userNickName"
        className="focus:ring-gray-500 focus:border-gray-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 ring-gray-300 rounded-md"
        placeholder="Search user Nickname"
        onChange={onChange}
        onKeyPress={onKeyPressHandler}
        value={userNickname}
      />
      <button
        type="button"
        className="absolute ml-52 h-full"
        onClick={onClickHandler}
      >
        <SearchIcon className="hover:text-black w-full h-full text-gray-900" />
      </button>
    </div>
  );
};

export default SearchUserNicknameInputBox;
