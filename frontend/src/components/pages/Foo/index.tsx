import { useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import Link from "next/link";
import {
  RegisterPuzzleRequest,
  RegisterPuzzleResponse,
} from "@/features/puzzle/types/register";
import Image from "next/image";

// Modalを表示するHTML要素のidを指定
Modal.setAppElement("#__next");

export const Foo = () => {
  const [formValues, setFormValues] = useState<RegisterPuzzleRequest>({
    title: "",
    description: "",
    icon: "",
    words: [],
  });

  const [sentence, setSentence] = useState("");
  const changeSentence = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(event.target.value);
  };

  const sentenceArray = sentence.split(",");
  const wordNum = sentenceArray.length;

  //モーダルウィンドウの表示/非表示を表すbool値を宣言
  const [modalIsOpen, setModalIsOpen] = useState(false);
  /** モーダルウィンドウを表示にする関数 */
  const openModal = () => setModalIsOpen(true);
  /** モーダルウィンドウを非表示にする関数 */
  const closeModal = () => setModalIsOpen(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openModal();
  };

  const sendNews = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("内部エラー");
    }
    try {
      const response = await fetch(`${baseUrl}/RegisterPuzzle`, {
        method: "POST",
        body: JSON.stringify(formValues),
      });
      const json: RegisterPuzzleResponse = await response.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      ScreenTransition();
    } catch (e) {
      console.error(e);
      alert("作成に失敗しました");
    }
  };

  const router = useRouter();

  const ScreenTransition = () => {
    router.push("/admin/puzzle");
  };

  return (
    <main>
      <div>
        <h2>パズル問題新規作成</h2>
        <hr />
        <form method="post" onSubmit={handleSubmit}>
          <div>
            <label>
              TITLE
              <input
                type="text"
                name="title"
                id="title"
                value={formValues.title}
                onChange={(e) =>
                  setFormValues((val) => ({
                    ...val,
                    title: e.target.value,
                  }))
                }
                required={true}
              />
            </label>
            <label>
              概要
              <textarea
                name="description"
                id="description"
                value={formValues.description}
                onChange={(e) =>
                  setFormValues((val) => ({
                    ...val,
                    description: e.target.value,
                  }))
                }
                required={true}
              />
            </label>
            <label>
              ICON写真をアップロードして下さい
              <br />
              <input
                name="ICONfile"
                type="file"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const f = files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      if (e.target === null) {
                        return;
                      }
                      const uri = e.target.result as string;
                      setFormValues((val) => ({
                        ...val,
                        icon: uri,
                      }));
                    };
                    reader.readAsDataURL(f);
                  }
                }}
                required={true}
              />
              {formValues.icon !== "" && (
                <Image
                  src={formValues.icon}
                  alt=""
                  width={100}
                  height={100}
                ></Image>
              )}
            </label>
            <label>
              問題の文章
              <br />
              (,)区切りで入力してください。
              <input
                type="text"
                name="sentence"
                id="sentence"
                value={sentence}
                onChange={changeSentence}
                required={true}
              />
            </label>
            <label>
              {Array(wordNum)
                .fill(0)
                .map((_, i) => {
                  return (
                    <div>
                      単語：「{sentenceArray[i]}」
                      <label>
                        単語の写真をアップロードして下さい
                        <br />
                        <input
                          type="file"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const f = files[0];
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                if (e.target === null) {
                                  return;
                                }
                                const uri = e.target.result as string;
                                // setFormValues((val) => ({
                                //   ...val,
                                //   words: uri,
                                // }));
                              };
                              reader.readAsDataURL(f);
                            }
                          }}
                          required={true}
                        />
                        {/* <Image
                          src=""
                          // src={formValues.words[]}
                          alt=""
                          width={100}
                          height={100}
                        ></Image> */}
                      </label>
                    </div>
                  );
                })}
            </label>
            <button type="submit">パズルUIチェック</button>
            <Link href="/admin/puzzle">パズル問題一覧ページへ戻る</Link>
          </div>
        </form>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div>
          <h2>パズル問題内容を確認してください。</h2>
          <div>TITLE:「{formValues.title}」</div>
          <div>概要：「{formValues.description}」</div>
          <div>英文：「{sentenceArray}」</div>
          <div>
            Icon画像:
            <Image src={formValues.icon} alt="" width={100} height={100} />
          </div>
          <button type="button" onClick={sendNews}>
            追加する
          </button>
        </div>
      </Modal>
    </main>
  );
};
