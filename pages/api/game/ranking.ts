import type { NextApiRequest, NextApiResponse } from 'next';
import type { IRank } from '@/typings/db';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IRank[]>,
) {
  res.status(200).json([
    {
      totalPlayCount: 0,
      winCount: 0,
      loseCount: 0,
      winRate: 'string',
      experience: 42,
      user: {
        userId: 1,
        nickname: '퐁게임너무재미있네',
        imagePath: 'string',
      },
    },
    {
      totalPlayCount: 0,
      winCount: 0,
      loseCount: 0,
      winRate: 'string',
      experience: 41,
      user: {
        userId: 1,
        nickname: '퐁게임너무재미있',
        imagePath: 'string',
      },
    },
    {
      totalPlayCount: 0,
      winCount: 0,
      loseCount: 0,
      winRate: 'string',
      experience: 40,
      user: {
        userId: 1,
        nickname: '퐁게임너무재미',
        imagePath: 'string',
      },
    },
    {
      totalPlayCount: 0,
      winCount: 0,
      loseCount: 0,
      winRate: 'string',
      experience: 39,
      user: {
        userId: 1,
        nickname: '퐁게임너무재',
        imagePath: 'string',
      },
    },
    {
      totalPlayCount: 0,
      winCount: 0,
      loseCount: 0,
      winRate: 'string',
      experience: 38,
      user: {
        userId: 1,
        nickname: '퐁게임너무',
        imagePath: 'string',
      },
    },
    {
      totalPlayCount: 0,
      winCount: 0,
      loseCount: 0,
      winRate: 'string',
      experience: 37,
      user: {
        userId: 1,
        nickname: '퐁게임너',
        imagePath: 'string',
      },
    },
    {
      totalPlayCount: 0,
      winCount: 0,
      loseCount: 0,
      winRate: 'string',
      experience: 36,
      user: {
        userId: 1,
        nickname: '퐁게임',
        imagePath: 'string',
      },
    },
    {
      totalPlayCount: 0,
      winCount: 0,
      loseCount: 0,
      winRate: 'string',
      experience: 35,
      user: {
        userId: 1,
        nickname: '퐁게',
        imagePath: 'string',
      },
    },
  ]);
}
