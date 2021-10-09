// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "@/typings/db";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser | false>
) {
  res.status(200).json(
    req.headers.authorization
      ? {
          id: 1,
          nickname: "jiwlee",
          email: "aaa@example.com",
        }
      : false
  );
}
