import dayjs from 'dayjs';
import { IChannelChat } from '@/typings/db';

const makeSection = (chatList: IChannelChat[]) => {
  const sections: { [key: string]: (IChannelChat)[] } = {};

  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
};

export default makeSection;
