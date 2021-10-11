// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IMessage, IUser } from "@/typings/db";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser | false | IMessage>
) {
  if (req.method === "GET") {
    res.status(200).json(
      req.headers.authorization
        ? {
            userId: 1,
            email: "marvin@student.42.fr",
            intraUsername: "marvin",
            nickname: "퐁게임너무재미있네",
            imagePath: "",
            status: "online",
            experience: 42,
            rankId: 1,
            banDate: null,
            isStatusPublic: true,
            isHistoryPublic: true,
            createdAt: "2021-10-11T06:28:44.899Z",
            lastModifiedAt: "2021-10-11T06:28:44.899Z",
            deletedAt: null,
          }
        : false
    );
  } else if (req.method === 'POST') {
    res.status(200).json({
      message: "update success"
    })
  }
}