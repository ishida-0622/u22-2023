import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Document, Page, pdfjs } from "react-pdf";
import Modal from "react-modal";
// import { PDFDocumentProxy } from "react-pdf/node_modules/pdfjs-dist/types/src/display/api";
import { endpoint } from "@/features/api";
import { RootState } from "@/store";
import {
  LOCAL_STORAGE_VOLUME_KEY,
  VOLUMES,
} from "@/features/auth/consts/setting";
import { Book } from "@/features/book/types";
import { FinishBookRequest } from "@/features/book/types/finish";

// import "react-pdf/dist/Page/TextLayer.css";
// import "react-pdf/dist/Page/AnnotationLayer.css";
import styles from "./index.module.scss";

Modal.setAppElement("#__next");

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const Storytelling = (props: Book) => {
  const router = useRouter();
  const volume = Number(
    localStorage.getItem(LOCAL_STORAGE_VOLUME_KEY) ?? VOLUMES[3]
  );
  const uid = useSelector((store: RootState) => store.uid);
  const isFinished = useRef(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [audios, _] = useState<HTMLAudioElement[]>(
    props.voice.map((v) => {
      const audio = new Audio(v);
      audio.volume = volume;
      return audio;
    })
  );
  const [maxPages, setMaxPages] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    pdfjs
      .getDocument(props.pdf)
      // .promise.then((pdf: PDFDocumentProxy) => {
      .promise.then((pdf: any) => {
        setMaxPages(pdf.numPages);
      });
    new Audio(props.voice[0]).play();
  }, [props.pdf, props.voice]);

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

  useEffect(() => {
    if (currentPage === maxPages && uid && !isFinished.current) {
      isFinished.current = true;
      const req: FinishBookRequest = {
        u_id: uid,
        b_id: props.b_id,
      };
      fetch(`${endpoint}/FinishBook`, {
        method: "POST",
        body: JSON.stringify(req),
      }).catch(() => {
        isFinished.current = false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const quit = () => {
    router.push("/book/select");
  };

  if (!props) {
    return null;
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
        <Document file={props.pdf}>
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
          <div className={styles.modal_content}>
            <h2>よみきかせをやめますか？</h2>
            <button className={styles.back} onClick={closeModal}>
              やめない
            </button>
            <button className={styles.exit} onClick={quit}>
              やめる
            </button>
          </div>
        </Modal>
      </dialog>
    </main>
  );
};
