import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader("Set-Cookie", "a_name=jiwlee;Max-Age=0;HttpOnly,Secure");
  res.statusCode = 200;
  res.json({ message: "logout success" });
}
