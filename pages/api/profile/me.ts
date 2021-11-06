import type { NextApiRequest, NextApiResponse } from 'next';
import type { IUser } from '@/typings/db';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser>,
) {
  res.status(200).json({
    userId: 1,
    email: 'marvin@student.42.fr',
    intraUsername: 'marvin',
    nickname: '퐁게임너무재미있네',
    imagePath: 'https://picsum.photos/400/400',
    status: 'online',
    experience: 42,
    rankId: 1,
    banDate: null,
    isStatusPublic: true,
    isHistoryPublic: true,
    createdAt: '2021-11-06T14:37:52.653Z',
    lastModifiedAt: '2021-11-06T14:37:52.653Z',
    deletedAt: null,
  });
}
