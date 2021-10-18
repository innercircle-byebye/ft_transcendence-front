import type { NextApiRequest, NextApiResponse } from 'next';
import { IChannel } from '@/typings/db';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IChannel[] | IChannel>,
) {
  const channelDatas = [
    {
      id: 1,
      name: 'general',
      private: false,
    },
    {
      id: 2,
      name: 'random',
      private: false,
    },
    {
      id: 3,
      name: '길드1',
      private: true,
    },
    {
      id: 4,
      name: '길드2',
      private: false,
    },
  ];

  res.statusCode = 200;
  const { id } = req.query;
  if (id) {
    res.json(channelDatas[+id - 1]);
  } else {
    res.json(channelDatas);
  }
}
