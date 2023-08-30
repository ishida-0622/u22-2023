import Router from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { StartBookResponse } from "@/features/book/types/start";
import { Book } from "@/features/book/types";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { AudioPlayer } from "@/features/Audio/audio";
import Modal from "react-modal";
// import { PDFDocumentProxy } from "react-pdf/node_modules/pdfjs-dist/types/src/display/api";
import {
  LOCAL_STORAGE_VOLUME_KEY,
  VOLUMES,
} from "@/features/auth/consts/setting";
import { endpoint } from "@/features/api";

Modal.setAppElement("#__next");

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const Storytelling = () => {
  const router = useRouter();
  const bidQuery = router.query["id"];
  const [currentPage, setCurrentPage] = useState(1);
  const [bookInfo, setbookinfo] = useState<Book>();
  const [currentPageUrl, setCurrentPageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement>(
    new Audio()
  );
  const [audios, setAudios] = useState<HTMLAudioElement[]>([]);
  const [bookResponse, setBookResponse] = useState<StartBookResponse>();
  const [maxPages, setMaxPages] = useState(1);
  const [usersVolume, setusersVolume] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_VOLUME_KEY) ?? VOLUMES[3]
  );
  const [volume, setVolume] = useState(Number(usersVolume));
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const bookFeatcher = async (key: string) => {
    if (bidQuery === null) {
      alert("絵本の取得に失敗しました。");
      Router.push("/book/select");
    } else {
      const req = {
        b_id: bidQuery,
      };
      const res = await fetch(key, {
        method: "POST",
        body: JSON.stringify(req),
      });
      setBookResponse(await res.json());
    }
  };

  useEffect(() => {
    if (router.isReady) {
      bookFeatcher(`${endpoint}/ScanBook`);
    }
  }, [bidQuery, router]);

  useEffect(() => {
    if (bookResponse) {
      if (bookResponse.response_status === "fail") {
        Router.push("/book/select");
      } else {
        const res = bookResponse.result;
        setbookinfo(res);
        setAudios(
          res.voice.map((v) => {
            const audio = new Audio(v);
            audio.volume = volume;
            return audio;
          })
        );
        new Audio(res.voice[0]).play();
      }
    }
  }, [bookResponse]);

  useEffect(() => {
    if (bookInfo) {
      setCurrentPageUrl(bookInfo.pdf);
      setAudioUrl(bookInfo.voice[0]);
      setCurrentAudio(new Audio(audioUrl));
    }
  }, [bookInfo]);

  useEffect(() => {
    if (currentPageUrl !== "") {
      pdfjs
        .getDocument(currentPageUrl)
        // .promise.then((pdf: PDFDocumentProxy) => {
        .promise.then((pdf: any) => {
          setMaxPages(pdf.numPages);
        });
    }
  }, [currentPageUrl]);

  useEffect(() => {
    if (bookInfo) {
      setAudioUrl(bookInfo.voice[currentPage - 1]);
    }
  }, [currentPage]);

  useEffect(() => {
    if (audioUrl) {
      setCurrentAudio(new Audio(audioUrl));
    }
  }, [audioUrl]);

  /** モーダルウィンドウを表示にする関数 */
  const openModal = () => setModalIsOpen(true);
  /** モーダルウィンドウを非表示にする関数 */
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      audios[currentPage - 1].pause();
      audios[currentPage - 1].load();
      audios[currentPage - 2].play();
    }
  };
  const nextPage = () => {
    if (currentPage !== maxPages) {
      setCurrentPage(currentPage + 1);
      audios[currentPage - 1].pause();
      audios[currentPage - 1].load();
      audios[currentPage].play();
    }
  };
  const quit = () => {
    Router.push("/book/select");
  };

  if (!bookResponse) {
    return <p>loading</p>;
  }
  return (
    <main className={styles.main}>
      {/* 絵本を置く場所 */}
      {/* previousButtonは前のページを表示するためのボタン
        これ以上さかのぼれない場合previousButtonInvalidにクラス名が変わります
        nextButtonは次のページを表示するためのボタン
        previousと同様にこれ以上進めない場合Invalidが付きます */}
      <button
        id="previousPage"
        className={
          currentPage == 1
            ? styles.previousButtonInvalid
            : styles.previousButton
        }
        onClick={() => previousPage()}
      >
        ←
      </button>
      <div className={styles.book}>
        <Document file={currentPageUrl}>
          <Page pageNumber={currentPage} />
        </Document>
      </div>
      <button
        id="nextPage"
        className={
          currentPage == maxPages ? styles.nextButtonInvalid : styles.nextButton
        }
        onClick={() => nextPage()}
      >
        →
      </button>
      {/* 朗読を始めるボタン */}
      <button className={styles.exit_button} onClick={openModal}>
        よみきかせをやめる
      </button>
      {/* 終了確認画面 */}
      <dialog>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <h2>よみきかせをやめますか？</h2>
          <button onClick={closeModal}> キャンセル </button>
          <button onClick={quit}> やめる </button>
        </Modal>
      </dialog>
    </main>
  );
};
