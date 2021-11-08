import React, {
  useCallback, useEffect, useRef, useState, VFC,
} from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import regexifyString from 'regexify-string';
import MentionMember from '../chat-page/common/MentionMember';
import fetcher from '@/utils/fetcher';
import { ISimpleUser, IUser } from '@/typings/db';
// import useInput from '@/hooks/useInput';
// import router from 'next/router';

const SearchUserNicknameInputBox: VFC = () => {
  const router = useRouter();
  const [userNickname, setUserNickname] = useState('');
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      router.push('/play');
    }
  }, [router]);

  const onChangeUserNickname = useCallback((e) => {
    setUserNickname(e.target.value);
  }, []);

  useEffect(() => {
    regexifyString({
      input: userNickname,
      pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
      decorator(match) {
        const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/);
        if (arr) {
          router.push(`/search/${arr[1]}`);
          setUserNickname('');
          textareaRef.current?.blur();
          return (arr[1]);
        }
        return '';
      },
    });
  }, [router, userNickname]);

  return (
    <div className="flex flex-row items-center bg-white rounded-full px-3 py-1 gap-2">
      <SearchIcon className="hover:text-black w-6 h-6 text-gray-900" />
      <div className="text-black w-60">
        <MentionMember
          trigger=""
          value={userNickname}
          onChangeValue={onChangeUserNickname}
          placeholder="Search user Nickname"
          inputRef={textareaRef}
          data={
            allUserData?.map((user): ISimpleUser => ({
              userId: user.userId, nickname: user.nickname, imagePath: user.imagePath,
            }))
          }
          onKeyPress={onKeyPress}
          className="navbar-mentions-input"
        />
      </div>
    </div>
  );
};
export default SearchUserNicknameInputBox;
