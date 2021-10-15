// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IHistory } from "@/typings/db";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IHistory>
) {
  res.status(200).json(
    {
      count: 10,
      win: 5,
      lose: 5,
    }
  );
}
