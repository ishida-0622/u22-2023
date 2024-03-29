import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { endpoint } from "@/features/api";

import {
  GetAllBookRequest,
  GetAllBookResponse,
} from "@/features/book/types/get";
import {
  UpdateBookRequest,
  UpdateBookResponse,
} from "@/features/book/types/update";

import styles from "./index.module.scss";

export const BookEdit = () => {
  const router = useRouter();
  // 本id
  const { id } = router.query;

  const isActive = useRef(true);

  const [titleEn, setTitleEn] = useState("");
  const [titleJp, setTitleJp] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | null>(null);
  const [voices, setVoices] = useState<(string | null)[]>([]);
  const [pageNum, setPageNum] = useState(0);

  useEffect(() => {
    if (typeof id === "string") {
      (async () => {
        const req: GetAllBookRequest = {};
        const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
        if (endpoint === undefined) {
          throw new Error("api endpoint is undefined");
        }
        try {
          const res = await fetch(`${endpoint}/GetBooks`, {
            method: "POST",
            body: JSON.stringify(req),
          });
          const json: GetAllBookResponse = await res.json();
          if (json.response_status === "fail") {
            throw new Error(json.error);
          }
          const book = json.result.find((val) => val.b_id === id);
          if (!book) {
            throw new Error("book is not found");
          }
          setTitleEn(book.title_en);
          setTitleJp(book.title_jp);
          setAuthor(book.author);
          setSummary(book.summary);
          setThumbnail(book.thumbnail);
          setPdf(book.pdf);
          setVoices(book.voice);
          setPageNum(book.voice.length);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [id]);

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

  const voicesOnchangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const f = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result != null) {
          setVoices((val) =>
            val.map((v, i) => (i === idx ? (e.target!.result as string) : v))
          );
        }
      };
      reader.readAsDataURL(f);
    } else {
      setVoices((val) => val.map((v, i) => (i === idx ? null : v)));
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isActive.current) {
      console.warn("submit is deactive");
      return;
    }

    if (!thumbnail) {
      alert("サムネイル画像を追加してください");
      return;
    }
    if (!pdf) {
      alert("PDFファイルを追加してください");
      return;
    }
    if (voices.some((v) => v === null)) {
      alert("音声ファイルを追加してください");
      return;
    }

    if (typeof id !== "string") {
      throw new Error("b_id type is not string");
    }

    isActive.current = false;

    const req: UpdateBookRequest = {
      b_id: id,
      author: author,
      summary: summary,
      thumbnail: thumbnail,
      pdf: pdf,
      title_jp: titleJp,
      title_en: titleEn,
      voice: voices as string[],
    };

    try {
      const res = await fetch(`${endpoint}/UpdateBook`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: UpdateBookResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      alert("登録しました");
    } catch (error) {
      isActive.current = true;
      console.error(error);
      alert("登録に失敗しました");
    }
  };

  return (
    <main className={`${styles.container}`}>
      <form onSubmit={submitHandler} className={`${styles.form}`}>
        <div>
          <label>
            サムネイル画像：
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
                width={150}
                height={150}
                // width, heightを消してfillのコメントアウトを削除すると、画像によって比率が自動的に変わります
                // fill
              />
            )}
          </label>
        </div>
        <div>
          <div>
            <label>
              英タイトル　　：
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              日本語タイトル：
              <input
                type="text"
                value={titleJp}
                onChange={(e) => setTitleJp(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              著者　　　　　：
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              あらすじ：
              <br />
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              pdfファイル 　：
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => fileOnChangeHandler(e, setPdf)}
              />
            </label>
          </div>
          <div>
            <label>
              ページ数　　　：
              <input
                type="number"
                value={pageNum}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  if (num < 0) {
                    return;
                  }
                  setPageNum(num);
                  setVoices((val) => val.concat([null]).slice(0, num));
                }}
              />
            </label>
          </div>
          {Array(pageNum)
            .fill(undefined)
            .map((_, i) => (
              <div key={i}>
                <label>
                  {i + 1}ページ目の音声ファイル：
                  <input
                    type="file"
                    accept="audio/mpeg"
                    onChange={(e) => voicesOnchangeHandler(e, i)}
                  />
                </label>
              </div>
            ))}
        </div>
        <div className={`${styles.submit_button_field}`}>
          <button className={`${styles.submit_button}`} type="submit">
            更新する
          </button>
        </div>
      </form>
      <div className={`${styles.link}`}>
        <Link href="/admin/book">パズル問題一覧ページへ戻る</Link>
      </div>
    </main>
  );
};
