import { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";
import useSWR from "swr";
import Modal from "react-modal";
import {
  faPen,
  faSearchPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { endpoint } from "@/features/api";

import { Book } from "@/features/book/types";
import {
  GetAllBookRequest,
  GetAllBookResponse,
} from "@/features/book/types/get";
import {
  DeleteBookRequest,
  DeleteBookResponse,
} from "@/features/book/types/delete";

import styles from "./index.module.scss";
import { AdminMenubar } from "@/components/elements/AdminMenubar";

Modal.setAppElement("#__next");

export const BookList = () => {
  const [showBooks, setShowBooks] = useState<Book[]>([]);
  const [viewBook, setViewBook] = useState<Book | null>(null);
  const [inputted, setInputted] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const detail = (book: Book) => {
    setViewBook(book);
    openModal();
  };

  const search = (input: string) => {
    if (allBooks === undefined) {
      return;
    }
    const reg = new RegExp(input);
    setShowBooks(
      allBooks.filter((val) => reg.test(val.title_en) || reg.test(val.title_jp))
    );
  };

  const fetcher = async (url: string) => {
    const req: GetAllBookRequest = {};
    const res = await fetch(url, { method: "POST", body: JSON.stringify(req) });
    const json: GetAllBookResponse = await res.json();
    if (json.response_status === "fail") {
      throw new Error(json.error);
    }
    const books = json.result;
    return books;
  };

  const { data: allBooks, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/GetBooks`,
    fetcher
  );

  const deleteBook = async (id: string) => {
    const req: DeleteBookRequest = {
      b_id: id,
    };
    try {
      const res = await fetch(`${endpoint}/DeleteBook`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: DeleteBookResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      Router.reload();
    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  };

  useEffect(() => {
    if (allBooks) {
      setShowBooks(allBooks);
    }
  }, [allBooks]);

  if (error) {
    return (
      <main>
        <h1>Error</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className={`${styles.container}`}>
      <h1>本棚管理</h1>
      <div className={`${styles.adminmenubar}`}>
        <AdminMenubar />
      </div>
      <div className={`${styles.search}`}>
        <input
          type="text"
          placeholder="検索"
          value={inputted}
          onChange={(e) => {
            setInputted(e.target.value);
            search(e.target.value);
          }}
        />
      </div>
      <section className={`${styles.book}`}>
        {showBooks.map((book) => (
          <div key={book.b_id}>
            <h3>
              {book.title_en}
              <br />
              {book.title_jp}
              <div className={`${styles.book_button}`}>
                <button onClick={() => detail(book)}>
                  <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button
                  onClick={() => {
                    Router.push(`/admin/book/edit/${book.b_id}`);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("削除しますか？")) {
                      deleteBook(book.b_id);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </h3>
            <hr />
          </div>
        ))}
      </section>
      <div className={`${styles.submit_button_field}`}>
        <button
          className={`${styles.submit_button}`}
          onClick={() => {
            Router.push("/admin/book/register");
          }}
        >
          新規作成
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div className={`${styles.close_button_field}`}>
          <button className={`${styles.close_button}`} onClick={closeModal}>
            ×
          </button>
        </div>
        {viewBook && (
          <div className={`${styles.modal}`}>
            <h2>
              {viewBook.title_en}
              <br />
              {viewBook.title_jp}
            </h2>
            <p>Book ID：{viewBook.b_id}</p>
            <p>著者：{viewBook.author}</p>
            <p>あらすじ：{viewBook.summary}</p>
            <div className={styles.image_wrapper}>
              <Image
                src={viewBook.thumbnail}
                alt="サムネイル"
                fill
                className={styles.image}
              />
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};
