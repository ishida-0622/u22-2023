import { useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import Link from "next/link";
import {
  RegisterNoticeRequest,
  RegisterNoticeResponse,
} from "@/features/notice/types/register";

// Modalを表示するHTML要素のidを指定
Modal.setAppElement("#__next");

export const PostAnnouncement = () => {
  const [formValues, setFormValues] = useState<RegisterNoticeRequest>({
    title: "",
    content: "",
  });

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
      const response = await fetch(`${baseUrl}/RegisterNotice`, {
        method: "POST",
        body: JSON.stringify(formValues),
      });
      const json: RegisterNoticeResponse = await response.json();
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
    router.push("/admin/announcement-page");
  };

  return (
    <main>
      <div>
        <h2>お知らせ投稿</h2>
        <hr />
        <form method="post" onSubmit={handleSubmit}>
          <div>
            <label>
              題名
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
              内容
              <textarea
                name="content"
                id="content"
                value={formValues.content}
                onChange={(e) =>
                  setFormValues((val) => ({
                    ...val,
                    content: e.target.value,
                  }))
                }
                required={true}
              ></textarea>
            </label>
            <button type="submit">投稿内容を確認</button>
            <Link href="/admin/announcement-page">投稿一覧ページへ戻る</Link>
          </div>
        </form>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div>
          <h2>投稿内容を確認してください。</h2>
          <div>題名:「{formValues.title}」</div>
          <div>投稿内容：「{formValues.content}」</div>
          <button type="button" onClick={sendNews}>
            投稿する
          </button>
        </div>
      </Modal>
    </main>
  );
};
