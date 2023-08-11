import { useLayoutEffect, useState } from "react";
import styles from "./index.module.scss";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { Puzzle } from "@/features/puzzle/types";
import { GetAllPuzzleResponse } from "@/features/puzzle/types/get";
import { UpdatePuzzleRequest } from "@/features/puzzle/types/update";
import { UpdateBookResponse } from "@/features/book/types/update";
import { PuzzleWord } from "@/features/puzzle/types";
import Image from "next/image";
import Link from "next/link";

Modal.setAppElement("#__next");

export const PuzzleEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  // idに基づいてAPIからデータを取ってくる処理
  const [puzzle, setPuzzle] = useState<Puzzle | undefined>(undefined);

  useLayoutEffect(() => {
    const pullPuzzle = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
      if (baseUrl === undefined) {
        throw new Error("内部エラー");
      }
      try {
        const response = await fetch(`${baseUrl}/GetPuzzles`, {
          method: "POST",
          body: JSON.stringify({}),
        });
        const data: GetAllPuzzleResponse = await response.json();

        const matchingPuzzle = data.result.find((puzzle) => puzzle.p_id === id);
        if (matchingPuzzle) {
          setPuzzle(matchingPuzzle);
          // 初期値をセット
          setP_id(matchingPuzzle.p_id);
          setTitle(matchingPuzzle.title);
          setDescription(matchingPuzzle.description);
          setIcon(matchingPuzzle.icon);
          // TODO wordsをセットする処理
          console.log(data.result);
        } else {
          console.log("Puzzle not found");
        }
      } catch (e) {
        alert("データの取得に失敗しました");
        console.error(e);
      }
    };
    if (id) {
      pullPuzzle();
    }
  }, [id]);

  // 編集された情報に基づいてバックエンドに送信する処理
  const [p_id, setP_id] = useState("");
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
  const [dummyShadows, setDummyShadows] = useState<(string | null)[]>([]);
  const [dummyVoices, setDummyVoices] = useState<(string | null)[]>([]);

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const changeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setDummyShadows((val) => val.concat([null]).slice(0, arr.length));
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
      dummyShadows.some((v) => v === null) ||
      dummyVoices.some((v) => v === null)
    ) {
      alert("画像と音声をアップロードしてください");
      return;
    }

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

    const req: UpdatePuzzleRequest = {
      p_id: puzzle === null || puzzle === undefined ? "0000" : puzzle.p_id,
      //TODO undefinedの時の処理を検討中
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
      const res = await fetch(`${baseUrl}/UpdatePuzzle`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: UpdateBookResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
    } catch (e) {
      console.error(e);

      alert("更新に失敗しました");
    }
  };

  return (
    <main>
      <form onSubmit={onSubmitHandler}>
        {puzzle && (
          <div>
            {/* パズルID */}
            <div>
              <label>
                <b>パズルID:「{puzzle.p_id}」</b>
              </label>
            </div>
            {/* TITLE */}
            <div>
              <label>
                <b>TITLE:</b>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={puzzle.title}
                  onChange={changeTitle}
                  required={true}
                />
              </label>
            </div>
            {/* 概要 */}
            <div>
              <label>
                <b>概要：</b>
                <input
                  name="description"
                  id="description"
                  value={puzzle.description}
                  onChange={changeDescription}
                  required={true}
                />
              </label>
            </div>
            {/* 登録済みのアイコン */}
            <div>
              <b>登録されているアイコン写真のURI：</b>「{puzzle.icon}」
            </div>
            <div>
              <b>登録されているアイコン写真：</b>
              <Image src={puzzle.icon} alt="" width={150} height={100} />
            </div>

            {/* アイコンを編集する際の入力欄 */}
            <div>
              <label>
                <b>変更する場合は、下記からICON写真をアップロードして下さい</b>
                <br />
                Icon：
                <input
                  type="file"
                  accept="image/*"
                  onChange={iconOnChangeHandler}
                />
                {icon && (
                  <Image
                    src={icon}
                    alt={"Icon写真をアップロードしてください"}
                    width={100}
                    height={100}
                  />
                )}
              </label>
            </div>

            {/* 登録されているパズルの問題 */}
            <div>
              <b>登録されているパズル問題：</b>
              <div>
                <p>
                  登録されている単語:「
                  {puzzle.words.map((v) => v.word).join(",")}」
                </p>
              </div>
              {puzzle.words.map((word) => (
                <div key={word.word}>
                  <p>単語：{word.word}</p>
                  <p>シルエットのURI：{word.shadow}</p>
                  <Image src={word.shadow} alt="" width={150} height={100} />
                  <p>イラストのURI：{word.illustration}</p>
                  <Image
                    src={word.illustration}
                    alt=""
                    width={150}
                    height={100}
                  />
                  <p>{word.voice}</p>
                  <audio controls src={word.voice} />
                  <hr />
                </div>
              ))}
            </div>

            {/* パズルの問題を編集する際の入力欄 */}
            <div>
              <label>
                <p>問題に使用する単語を変更する際は下記に入力してください。</p>
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

                    {voices[i] && <audio src={voices[i]!} controls={true} />}
                  </label>

                  <label>
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
                      />
                    )}
                  </label>

                  <label>
                    {`${dummy}のシルエット：`}

                    <input
                      type="file"
                      accept="image/*"
                      required={true}
                      onChange={(e) => onChangeHandler(e, i, setDummyShadows)}
                    />

                    {dummyShadows[i] && (
                      <Image
                        src={dummyShadows[i]!}
                        alt={"シルエットの写真をアップロードしてください"}
                        width={100}
                        height={100}
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
                      <audio src={dummyVoices[i]!} controls={true} />
                    )}
                  </label>
                </div>
              ))}
            </div>

            <div>
              <b>作成日：</b>「{puzzle.create_date}」
            </div>
            <div>
              <b>最終更新日：</b>「{puzzle.update_date}」
            </div>
          </div>
        )}
        <input type="submit" value="追加する" />
      </form>
      <Link href="/admin/puzzle">パズル問題一覧ページへ戻る</Link>
    </main>
  );
};
