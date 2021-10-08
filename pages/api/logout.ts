import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  req.headers.authorization = "";
  res.statusCode = 200;
  res.json({ message: "logout success" });
}
