import { Puzzle } from "@/features/puzzle/types";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse<Puzzle>) => {
  const data: Puzzle = {
    p_id: "1234",
    title: "foo",
    description: "foo bar buz",
    icon: "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/IMG_3yvjyu.jpg",
    words: [
      {
        word: "I",
        shadow:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/ishida_black.jpg",
        illustration:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/i.png",
        voice:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/I.mp3",
        is_displayed: true,
        is_dummy: false,
      },
      {
        word: "have",
        shadow:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/have_shadow.png",
        illustration:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/have.png",
        voice:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/o-.mp3",
        is_displayed: false,
        is_dummy: false,
      },
      {
        word: "a sword",
        shadow:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/a_sword_shadow.png",
        illustration:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/a_sword.png",
        voice:
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/sword.mp3",
        is_displayed: true,
        is_dummy: false,
      },
    ],
    create_date: "",
    update_date: "",
  };
  res.status(200).send(data);
};

export default handler;
