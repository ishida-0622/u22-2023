import { useRef, useState } from "react";
import styles from "./index.module.scss";
import { AdminMenubar } from "@/components/elements/AdminMenubar";
import Image from "next/image";
import {
  RegisterPuzzleRequest,
  RegisterPuzzleResponse,
} from "@/features/puzzle/types/register";
import { PuzzleWord } from "@/features/puzzle/types";
import { useRouter } from "next/router";
import Modal from "react-modal";
import Link from "next/link";

// Modalを表示するHTML要素のidを指定
Modal.setAppElement("#__next");

export const RegisterPuzzle = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [word, setWord] = useState("");
  const [splitWord, setSplitWord] = useState<string[]>([]);
  const [icon, setIcon] = useState<string | null>(null);
  // 各イラストのURI
  const [images, setImages] = useState<(string | null)[]>([]);
  // 各シルエットのURI
  const [shadows, setShadows] = useState<(string | null)[]>([]);
  // 各音声のURI
  const [voices, setVoices] = useState<(string | null)[]>([]);
  const [isDisplayed, setIsDisplayed] = useState<boolean[]>([]);
  // ダミーのURIなど
  const [dummyWord, setDummyWord] = useState("");
  const [splitDummyWord, setSplitDummyWord] = useState<string[]>([]);
  const [dummyImages, setDummyImages] = useState<(string | null)[]>([]);
  const [dummyShadows, setDummyShadows] = useState<string[]>([]);
  const [dummyVoices, setDummyVoices] = useState<(string | null)[]>([]);

  const router = useRouter();
  const isActive = useRef(true);

  const puzzleList = () => {
    router.push("/admin/puzzle");
  };
  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const changeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const wordOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    // 入力をセット
    setWord(text);
    if (text === "") {
      setSplitWord([]);
      setImages([]);
      setShadows([]);
      setVoices([]);
      setIsDisplayed([]);
      return;
    }

    // ,で区切って配列にする
    const arr = text.split(",");
    // 配列をセット
    setSplitWord(arr);
    // 配列の長さによって画像の入力欄を増減させる
    // concatとsliceはこちらを参考に
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    setImages((val) => val.concat([null]).slice(0, arr.length));
    setShadows((val) => val.concat([null]).slice(0, arr.length));
    setVoices((val) => val.concat([null]).slice(0, arr.length));
    setIsDisplayed((val) => val.concat(false).slice(0, arr.length));
  };

  const dummyWordOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setDummyWord(text);
    if (text === "") {
      setSplitDummyWord([]);
      setDummyImages([]);
      setDummyShadows([]);
      setDummyVoices([]);
      return;
    }

    const arr = text.split(",");
    setSplitDummyWord(arr);
    setDummyImages((val) => val.concat([null]).slice(0, arr.length));
    setDummyShadows((val) =>
      val
        .concat([
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQQAAAJMAQMAAACW/DlXAAAAA1BMVEX///+nxBvIAAAAf0lEQVR42uzBgQAAAACAoP2pF6kCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOD24JAAAAAAQND/134wAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEt0JwABmDfT1AAAAABJRU5ErkJggg==",
        ])
        .slice(0, arr.length)
    );
    setDummyVoices((val) => val.concat([null]).slice(0, arr.length));
  };

  const iconOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const f = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target === null) {
          return;
        }
        setIcon(e.target.result as string);
      };
      reader.readAsDataURL(f);
    } else {
      setIcon(null);
    }
  };

  /**
   * 画像や音声をURIにしてセットする
   * @param e event
   * @param index
   * @param updateFun 値の更新用のset関数
   */

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    updateFun: React.Dispatch<React.SetStateAction<(string | null)[]>>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const f = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target === null) {
          return;
        }
        updateFun((val) =>
          // indexが同じものだけを更新
          val.map((v, j) => (index === j ? (e.target!.result as string) : v))
        );
      };
      reader.readAsDataURL(f);
    } else {
      updateFun((val) => val.map((v, j) => (index === j ? null : v)));
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isActive.current) {
      console.warn("submit is deactive");
      return;
    }

    const reg = new RegExp(
      /^([a-zA-Z]+(\s[a-zA-Z]|[a-zA-Z])*)+(?:,([a-zA-Z]+(\s[a-zA-Z]|[a-zA-Z])*)+)*$/
    );
    // 問題文がカンマ区切りの英文かを判定
    if (!reg.test(word)) {
      alert("問題文の形式が不正です");
      return;
    }

    if (!(dummyWord === "" || reg.test(dummyWord))) {
      alert("ダミー文の形式が不正です");
      return;
    }

    // iconがnullかを判定
    if (!icon) {
      alert("アイコンをアップロードしてください");
      return;
    }

    // 画像と音声にnullが含まれているかを判定
    if (
      images.some((v) => v === null) ||
      shadows.some((v) => v === null) ||
      voices.some((v) => v === null) ||
      dummyImages.some((v) => v === null) ||
      dummyVoices.some((v) => v === null)
    ) {
      alert("画像と音声をアップロードしてください");
      return;
    }

    isActive.current = false;

    const words: PuzzleWord[] = splitWord.map((v, i) => {
      return {
        word: v,
        shadow: shadows[i]!,
        illustration: images[i]!,
        voice: voices[i]!,
        is_displayed: isDisplayed[i],
        is_dummy: false,
      };
    });

    const dummyWords: PuzzleWord[] = splitDummyWord.map((v, i) => {
      return {
        word: v,
        shadow: dummyShadows[i]!,
        illustration: dummyImages[i]!,
        voice: dummyVoices[i]!,
        is_displayed: false,
        is_dummy: true,
      };
    });

    const req: RegisterPuzzleRequest = {
      title: title,
      description: description,
      icon: icon,
      words: words.concat(dummyWords),
    };

    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;

    if (baseUrl === undefined) {
      throw new Error("base url is undefined");
    }

    try {
      // 登録処理
      const res = await fetch(`${baseUrl}/RegisterPuzzle`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: RegisterPuzzleResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      } else {
        alert("登録に成功しました");
        puzzleList();
      }
    } catch (e) {
      console.error(e);
      isActive.current = true;
      alert("登録に失敗しました");
    }
  };

  return (
    <main className={`${styles.container}`}>
      <h1>パズル問題新規作成</h1>
      <div className={`${styles.adminmenubar}`}>
        <AdminMenubar />
      </div>
      <form onSubmit={onSubmitHandler} className={`${styles.form}`}>
        <div>
          <label>
            <b>TITLE</b>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={changeTitle}
              required={true}
            />
          </label>
        </div>

        <div>
          <label>
            <b>概要</b>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={changeDescription}
              required={true}
              className={`${styles.overview}`}
            />
          </label>
        </div>

        <div>
          <label>
            <b>ICON写真をアップロードして下さい</b>
            <div className={`${styles.icon}`}>
              Icon：
              <input
                type="file"
                accept="image/*"
                onChange={iconOnChangeHandler}
              />
            </div>
            {icon && (
              <Image
                src={icon}
                alt={"Icon写真をアップロードしてください"}
                width={100}
                height={100}
                className={`${styles.icon_image}`}
              />
            )}
          </label>
        </div>

        <div>
          <label>
            <b>問題の文章</b>
            <br />
            Word（,区切りで入力してください）：
            <input
              type="text"
              placeholder={"I,have,an apple"}
              value={word}
              required={true}
              onChange={wordOnChangeHandler}
            />
          </label>

          {splitWord.map((word, i) => (
            <div key={`word${word}${i}`}>
              <label>
                {`${word}のイラスト：`}

                <input
                  type="file"
                  accept="image/*"
                  required={true}
                  onChange={(e) => onChangeHandler(e, i, setImages)}
                />

                {images[i] && (
                  <Image
                    src={images[i]!}
                    alt={"イラスト写真をアップロードしてください"}
                    width={100}
                    height={100}
                    className={`${styles.word_image}`}
                  />
                )}
              </label>

              <label>
                {`${word}のシルエット：`}

                <input
                  type="file"
                  accept="image/*"
                  required={true}
                  onChange={(e) => onChangeHandler(e, i, setShadows)}
                />

                {shadows[i] && (
                  <Image
                    src={shadows[i]!}
                    alt={"シルエットの写真をアップロードしてください"}
                    width={100}
                    height={100}
                    className={`${styles.word_image}`}
                  />
                )}
              </label>

              <label>
                {`${word}のボイス：`}

                <input
                  type="file"
                  accept="audio/*"
                  required={true}
                  onChange={(e) => onChangeHandler(e, i, setVoices)}
                />

                {voices[i] && (
                  <audio
                    src={voices[i]!}
                    controls={true}
                    className={`${styles.word_voice}`}
                  />
                )}
              </label>

              <label className={`${styles.checkbox}`}>
                is displayed：
                <input
                  type="checkbox"
                  checked={isDisplayed[i]}
                  onChange={() =>
                    setIsDisplayed((val) =>
                      val.map((v, j) => (i === j ? !v : v))
                    )
                  }
                />
              </label>
            </div>
          ))}
        </div>

        <div>
          <label>
            Dummy word（,区切りで入力してください）：
            <input
              type="text"
              value={dummyWord}
              placeholder={"an orange,a banana"}
              onChange={dummyWordOnChangeHandler}
            />
          </label>

          {splitDummyWord.map((dummy, i) => (
            <div key={`dummy${dummy}${i}`}>
              <label>
                {`${dummy}のイラスト：`}

                <input
                  type="file"
                  accept="image/*"
                  required={true}
                  onChange={(e) => onChangeHandler(e, i, setDummyImages)}
                />

                {dummyImages[i] && (
                  <Image
                    src={dummyImages[i]!}
                    alt={"イラスト写真をアップロードしてください"}
                    width={100}
                    height={100}
                    className={`${styles.word_image}`}
                  />
                )}
              </label>

              <label>
                {`${dummy}のボイス：`}

                <input
                  type="file"
                  accept="audio/*"
                  required={true}
                  onChange={(e) => onChangeHandler(e, i, setDummyVoices)}
                />

                {dummyVoices[i] && (
                  <audio
                    src={dummyVoices[i]!}
                    controls={true}
                    className={`${styles.word_voice}`}
                  />
                )}
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
      <div className={`${styles.link}`}>
        <Link href="/admin/puzzle">パズル問題一覧ページへ戻る</Link>
      </div>
    </main>
  );
};
