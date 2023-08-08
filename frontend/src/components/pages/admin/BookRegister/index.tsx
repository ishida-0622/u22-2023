import { RegisterBookRequest } from "@/features/book/types/register";
import { useState } from "react";
import Image from "next/image";

export const BookRegister = () => {
  const [titleEn, setTitleEn] = useState("");
  const [titleJa, setTitleJa] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | null>(null);
  const [voice, setVoice] = useState<string[]>([]);

  const fileOnChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    updateFun: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const f = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result != null) {
          updateFun(e.target.result as string);
        }
      };
      reader.readAsDataURL(f);
    } else {
      updateFun(null);
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main>
      <form onSubmit={submitHandler}>
        <label>
          サムネイル画像
          <input
            type="file"
            accept="image/*"
            onChange={(e) => fileOnChangeHandler(e, setThumbnail)}
          />
          {thumbnail && (
            <Image
              src={thumbnail}
              alt="thumbnail"
              // width, heightは必要に応じて書き換えてください
              width={100}
              height={100}
              // width, heightを消してfillのコメントアウトを削除すると、画像によって比率が自動的に変わります
              // fill
            />
          )}
        </label>
        <label>
          英タイトル
          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
          />
        </label>
        <label>
          日本語タイトル
          <input
            type="text"
            value={titleJa}
            onChange={(e) => setTitleJa(e.target.value)}
          />
        </label>
        <label>
          著者
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
        <label>
          あらすじ
          <textarea
            cols={30}
            rows={10}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>
        <label>
          <input
            type="file"
            accept="image/pdf"
            onChange={(e) => fileOnChangeHandler(e, setPdf)}
          />
        </label>
        <label>
          <input type="file" accept="audio/*" onChange={(e) => {}} />
        </label>
      </form>
    </main>
  );
};
