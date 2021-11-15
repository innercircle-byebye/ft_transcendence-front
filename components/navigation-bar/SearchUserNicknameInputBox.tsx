import React, {
  useCallback, useEffect, useRef, VFC,
} from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import regexifyString from 'regexify-string';
import MentionMember from '../chat-page/common/MentionMember';
import fetcher from '@/utils/fetcher';
import { ISimpleUser, IUser } from '@/typings/db';
import useInput from '@/hooks/useInput';

const SearchUserNicknameInputBox: VFC = () => {
  const router = useRouter();
  const [search, onChangeSearch] = useInput('');
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onKeydown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          if (search) {
            router.push(`/searches?search=${search}`);
          }
        }
      }
    },
    [router, search],
  );

  useEffect(() => {
    regexifyString({
      input: search,
      pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
      decorator(match) {
        const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/);
        if (arr) {
          router.push(`/profile/${arr[1]}`);
          textareaRef.current?.blur();
          return (arr[1]);
        }
        return '';
      },
    });
  }, [router, search]);

  return (
    <div className="flex flex-row items-center bg-white rounded-full px-3 py-1 gap-2">
      <SearchIcon className="hover:text-black w-6 h-6 text-gray-900" />
      <div className="text-black w-32">
        <MentionMember
          trigger=""
          value={search}
          onChangeValue={onChangeSearch}
          placeholder="Search ..."
          inputRef={textareaRef}
          data={
            allUserData?.map((user): ISimpleUser => ({
              userId: user.userId, nickname: user.nickname, imagePath: user.imagePath,
            }))
          }
          onKeyPress={onKeydown}
          className="navbar-mentions-input"
        />
      </div>
    </div>
  );
};
export default SearchUserNicknameInputBox;
