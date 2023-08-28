import { useRef, useState } from "react";
import Image from "next/image";
import { endpoint } from "@/features/api";
import {
  RegisterBookRequest,
  RegisterBookResponse,
} from "@/features/book/types/register";

import styles from "./index.module.scss";
import { AdminMenubar } from "@/components/elements/AdminMenubar";

export const BookRegister = () => {
  const isActive = useRef(true);

  const [titleEn, setTitleEn] = useState("");
  const [titleJa, setTitleJa] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | null>(null);
  const [voices, setVoices] = useState<(string | null)[]>([]);
  const [pageNum, setPageNum] = useState(0);

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

    isActive.current = false;

    const req: RegisterBookRequest = {
      author: author,
      summary: summary,
      thumbnail: thumbnail,
      pdf: pdf,
      title_jp: titleJa,
      title_en: titleEn,
      voice: voices as string[],
    };

    try {
      const res = await fetch(`${endpoint}/RegisterBook`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: RegisterBookResponse = await res.json();
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
      <h1>本追加</h1>
      <div className={`${styles.adminmenubar}`}>
        <AdminMenubar />
      </div>
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
                width={100}
                height={100}
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
                value={titleJa}
                onChange={(e) => setTitleJa(e.target.value)}
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
                  {i + 1}ページ目の音声ファイル
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
            追加する
          </button>
        </div>
      </form>
    </main>
  );
};
