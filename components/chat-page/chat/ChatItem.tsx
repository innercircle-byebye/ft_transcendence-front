import React, { FC, useMemo } from 'react';
import Image from 'next/image';
import regexifyString from 'regexify-string';
import Link from 'next/link';
import dayjs from 'dayjs';
import { IChatItem } from '@/typings/db';

interface Props {
  chatData: IChatItem;
}

const ChatItem: FC<Props> = ({ chatData }) => {
  const result = useMemo(
    () => (
      regexifyString({
        input: chatData.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/);
          if (arr) {
            return (
              <Link key={match + index} href={`/chat/dm/${arr[1]}`}>
                <a className="bg-amber-400">
                  @
                  {arr[1]}
                </a>
              </Link>
            );
          }
          return <br key={index} />;
        },
      })
    ),
    [chatData.content],
  );

  return (
    <div className="flex flex-row">
      <div className="relative bg-blue-300 w-10 h-10 mr-2">
        <Image
          src={chatData.imagePath}
          alt="previewImage"
          objectFit="cover"
          layout="fill"
          className="rounded-md"
        />
      </div>
      <div>
        <div className="space-x-2">
          <b>{chatData.nickname}</b>
          <span className="text-sm text-gray-700">{dayjs(chatData.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </div>
  );
};
export default ChatItem;
