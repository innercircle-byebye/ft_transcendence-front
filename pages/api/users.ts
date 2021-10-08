// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "@/typings/db";

type Data = {
  userData: IUser;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | false>
) {
  res.status(200).json(
    req.headers.authorization
      ? {
        userData: { id: 1, nickname: "jiwlee", email: "aaa@example.com" },
      }
      : false
  );
}
