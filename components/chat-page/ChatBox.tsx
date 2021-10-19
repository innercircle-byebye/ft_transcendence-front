import React, {
  Dispatch,
  ReactNode, SetStateAction, useCallback, useEffect, useRef, useState, VFC,
} from 'react';
import Image from 'next/image';
import autosize from 'autosize';
import { MentionsInput, Mention, SuggestionDataItem } from 'react-mentions';
import useSWR from 'swr';
// import EmojiPicker from 'interweave-emoji-picker';
// import { Emoji } from 'interweave-emoji';
import Emoji from './Emoji';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  chat: string;
  onChangeChat: (e: any) => void;
  setChat: Dispatch<SetStateAction<string>>;
  onSubmitChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox: VFC<IProps> = ({
  chat,
  onChangeChat,
  setChat,
  onSubmitChat,
  placeholder,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(
    userData ? '/api/members' : null,
    // '/api/members',
    fetcher,
  );
  const [showEmoji, setShowEmoji] = useState(false);

  const onKeydownChat = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitChat(e);
        }
      }
    },
    [onSubmitChat],
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
            focus ? 'text-bold bg-sky-800 text-white' : 'bg-white'
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

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  return (
    <div className="flex flex-row w-full p-6 pt-0">
      <form
        className="w-full rounded-sm text-xl bg-sky-200 border border-sky-700"
        onSubmit={onSubmitChat}
      >
        <MentionsInput
          className="w-full textarea:p-2"
          value={chat}
          onChange={onChangeChat}
          onKeyPress={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={
              memberData?.map((v) => ({
                id: v.userId,
                display: v.nickname,
              })) || []
            }
            renderSuggestion={renderSuggestion}
          />
        </MentionsInput>
        <div className="relative flex items-center border-t-2 border-gray-700 bg-white h-12">
          {showEmoji && <div className="absolute bottom-12 right-12"><Emoji setChat={setChat} /></div>}
          <button className="absolute top-0 right-12 bg-yellow-400 flex items-center justify-center h-full w-12" type="button" onClick={() => setShowEmoji((prev) => !prev)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            className="absolute top-0 right-0 pb-1 pl-1 bg-sky-600 flex items-center justify-center h-full w-12"
            type="submit"
            disabled={!chat?.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform rotate-45 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
