import { Seals } from "@/features/Calendar/types";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse<Seals>) => {
  const data: Seals = {
    datetime: [
        "20230615",
        "20230616",
        "20230620",
        "20230621",
        "20230622",
        "20230623",
        "20230628",
        "20230630",
        "20230527",
        "20230529",
        "20230505",
        "20230501",
    ]
  };
  res.status(200).send(data);
};

export default handler;