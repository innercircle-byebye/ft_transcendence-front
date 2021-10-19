import React, {
  Dispatch,
  FormEventHandler,
  SetStateAction, useCallback, useEffect, useRef, VFC,
} from 'react';
import autosize from 'autosize';
import { CanonicalEmoji } from 'interweave-emoji';
import Emoji from './Emoji';
import MentionMember from './MentionMember';

interface IProps {
  chat: string;
  onChangeChat: (e: any) => void;
  setChat: Dispatch<SetStateAction<string>>;
  onSubmitChat: FormEventHandler<HTMLFormElement>;
  showEmoji: boolean;
  setShowEmoji: Dispatch<SetStateAction<boolean>>;
  placeholder?: string;
}

const ChatBox: VFC<IProps> = ({
  chat,
  onChangeChat,
  setChat,
  onSubmitChat,
  showEmoji,
  setShowEmoji,
  placeholder,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const onClickEmojiIcon = useCallback(() => {
    setShowEmoji((prev) => !prev);
  }, [setShowEmoji]);

  const onSelectEmoji = useCallback((e: CanonicalEmoji) => {
    setChat((prev) => (prev + e.emoji));
    textareaRef.current?.focus();
  }, [setChat]);

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

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-row w-full p-6 pt-0">
      <form
        className="w-full rounded-sm text-xl bg-sky-200 border border-sky-700"
        onSubmit={onSubmitChat}
      >
        <MentionMember
          trigger="@"
          value={chat}
          onChangeValue={onChangeChat}
          onKeyPress={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
        />
        <div className="relative flex items-center border-t-2 border-gray-700 bg-white h-12">
          <div role="button" tabIndex={0} onClick={stopPropagation} onKeyPress={stopPropagation}>
            <div>
              {showEmoji && <div className="absolute bottom-12 right-0"><Emoji onSelectEmoji={onSelectEmoji} /></div>}
              <button className="absolute top-0 right-12 bg-yellow-400 flex items-center justify-center h-full w-12" type="button" onClick={onClickEmojiIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
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
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
