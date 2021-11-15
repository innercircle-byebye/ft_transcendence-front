import dayjs from 'dayjs';
import { IChannelChat, IDMChat } from '@/typings/db';

export default function makeSection<T extends IDMChat | IChannelChat>(chatList: T[]) {
  const sections: { [key: string]: T[] } = {};

  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
