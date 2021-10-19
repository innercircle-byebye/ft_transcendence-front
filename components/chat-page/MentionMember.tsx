import React, {
  ReactNode, RefObject, useCallback, VFC,
} from 'react';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import useSWR from 'swr';
import Image from 'next/image';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';

interface IProps {
  trigger: string;
  value: string;
  onChangeValue: (e: any) => void;
  inputRef: RefObject<HTMLTextAreaElement> | ((instance: HTMLInputElement | null) => void);
  onKeyPress?: (e: any) => void;
  placeholder?: string;
}

const MentionMember: VFC<IProps> = ({
  trigger, value, onChangeValue, onKeyPress, inputRef, placeholder,
}) => {
  // const { data: userData } = useSWR<IUser>('/api/user/me', fetcher, {
  //   dedupingInterval: 2000, // 2초
  // });
  const { data: memberData } = useSWR<IUser[]>(
    // userData ? '/api/members' : null,
    '/api/members',
    fetcher,
  );

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: ReactNode,
      index: number,
      focus: boolean,
    ): ReactNode => {
      if (!memberData) return null;
      return (
        <button
          type="button"
          className={`px-1 py-2 flex items-center w-full space-x-2 ${
            focus ? 'text-bold bg-sky-800 text-white' : 'text-base bg-white'
          }`}
        >
          <Image
            src={memberData[index].imagePath}
            alt={memberData[index].nickname}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span>{highlightedDisplay}</span>
        </button>
      );
    },
    [memberData],
  );

  return (
    <MentionsInput
      className="w-full textarea:p-2"
      value={value}
      onChange={onChangeValue}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      inputRef={inputRef}
      allowSuggestionsAboveCursor
    >
      <Mention
        appendSpaceOnAdd
        trigger={trigger}
        data={
              memberData?.map((v) => ({
                id: v.userId,
                display: v.nickname,
              })) || []
            }
        renderSuggestion={renderSuggestion}
      />
    </MentionsInput>
  );
};

export default MentionMember;
