import { Articles } from "@/features/Information/types";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse<Articles>) => {
  const data: Articles = {
    articles: [
        {"title": "Ahiru", "content": "quack quack", "createDate": "2001-05-27T15:33:33Z"},
        {"title" : "neko", "content" : "meow meow", "createDate" : "2001-05-27T15:33:33Z"}
    ]
  };
  res.status(200).send(data);
};

export default handler;