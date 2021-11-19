import React, {
  ReactNode, RefObject, useCallback, VFC,
} from 'react';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import Image from 'next/image';
import { ISimpleUser } from '@/typings/db';

interface IProps {
  trigger: string;
  value: string;
  onChangeValue: (e: any) => void;
  data: ISimpleUser[] | undefined;
  inputRef: RefObject<HTMLTextAreaElement> | ((instance: HTMLInputElement | null) => void);
  onKeyPress?: (e: any) => void;
  placeholder?: string;
  className?: string;
}

const MentionMember: VFC<IProps> = ({
  trigger, value, onChangeValue, data, inputRef, onKeyPress, placeholder,
  className = 'mentions-input',
}) => {
  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: ReactNode,
      index: number,
      focus: boolean,
    ): ReactNode => {
      if (!data) return null;
      return (
        <button
          type="button"
          className={`px-1 py-2 flex items-center w-full space-x-2
          ${focus ? 'text-bold bg-sky-800 text-white' : 'text-base bg-white'
            }`}
        >
          <Image
            loader={() => data[index].imagePath}
            src={data[index].imagePath}
            alt={data[index].nickname}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span>{highlightedDisplay}</span>
        </button>
      );
    },
    [data],
  );

  return (
    <MentionsInput
      className={className}
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
          data?.map((v) => ({
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
