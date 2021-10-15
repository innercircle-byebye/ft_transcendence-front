// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IMessage, IHistory } from "@/typings/db";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IHistory | false | IMessage>
) {
  if (req.method === "GET") {
    res.status(200).json(
      {
        win: 5,
        lose: 5,
      }
    );
  } else if (req.method === 'POST') {
    res.status(200).json({
      message: "update success"
    })
  }
}
