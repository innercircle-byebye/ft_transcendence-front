import type { NextApiRequest, NextApiResponse } from 'next';
import type { IRank } from '@/typings/db';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IRank[]>,
) {
  res.status(200).json([
    { rankId: 1, nickname: 'Jane', experience: 30000 },
    { rankId: 2, nickname: 'John', experience: 20000 },
    { rankId: 3, nickname: 'Tom1', experience: 20000 },
    { rankId: 4, nickname: 'Tom2', experience: 20000 },
    { rankId: 5, nickname: 'Tom3', experience: 20000 },
    { rankId: 6, nickname: 'Tom4', experience: 20000 },
    { rankId: 7, nickname: 'Tom5', experience: 20000 },
    { rankId: 8, nickname: 'Tom6', experience: 20000 },
    { rankId: 9, nickname: 'Tom7', experience: 20000 },
    { rankId: 10, nickname: 'Tom8', experience: 20000 },
    { rankId: 11, nickname: 'Tom9', experience: 20000 },
    { rankId: 12, nickname: 'Tom10', experience: 20000 },
    { rankId: 13, nickname: 'Tom11', experience: 20000 },
  ]);
}
