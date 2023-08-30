import { GetServerSideProps } from "next";
import { Storytelling } from "@/components/pages/Storytelling";
import { Book } from "@/features/book/types";
import { ScanBookRequest, ScanBookResponse } from "@/features/book/types/scan";
import { endpoint } from "@/features/api";

const StorytellingPage = (props: Book) => {
  return <Storytelling {...props} />;
};

export default StorytellingPage;

export const getServerSideProps: GetServerSideProps<Book> = async (context) => {
  // 問題id
  const { id } = context.params as any;

  const req: ScanBookRequest = {
    b_id: id as string,
  };
  const url = `${endpoint}/ScanBook`;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(req),
  });
  const json: ScanBookResponse = await res.json();

  const props: Book = json.result;

  return {
    props: props,
  };
};
