import { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";
import useSWR from "swr";
import Modal from "react-modal";
import { GetAllBookResponse } from "@/features/book/types/get";
import { Menubar } from "@/components/elements/Menubar";
import styles from "./index.module.scss";

Modal.setAppElement("#__next");

export const Bookshelf = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [bookTable, setBookTable] = useState<string[][][]>([]);
  const [bookMap, setBookMap] = useState<Map<string, string[]>>(new Map());

  /** モーダルウィンドウを表示にする関数 */
  const openModal = () => setModalIsOpen(true);
  /** モーダルウィンドウを非表示にする関数 */
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetcher = async (key: string) => {
    return fetch(key, {
      method: "POST",
      body: JSON.stringify({}),
    }).then((res) => res.json() as Promise<GetAllBookResponse>);
  };

  const { data: AllBooks, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/GetBooks`,
    fetcher
  );

  useEffect(() => {
    if (AllBooks) {
      if (AllBooks.response_status === "fail") {
        alert("絵本が見つかりませんでした。");
        Router.push("/");
      } else {
        const tempTable = AllBooks.result.map((x) => [
          x.b_id,
          x.title_en,
          x.thumbnail,
          x.summary,
        ]);
        const len = Math.ceil(tempTable.length / 2);
        const table: string[][][] = [];
        table.push(tempTable.slice(0, len));
        table.push(tempTable.slice(len));
        tempTable.forEach((ele) => {
          bookMap.set(ele[0], [ele[1], ele[3]]);
        });
        setBookMap(bookMap);
        setBookTable(table);
      }
    }
  }, [AllBooks]);

  if (!AllBooks) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  const viewInfo = (b_id: string) => {
    setSelectedId(b_id);
    openModal();
  };
  const startBook = () => {
    Router.push({
      pathname: "/storytelling",
      query: { b_id: selectedId },
    });
  };
  const modalContents = () => {
    if (bookMap.has(selectedId)) {
      return (
        <div>
          <h3>{bookMap.get(selectedId)![0]}</h3>
          <p>{bookMap.get(selectedId)![1]}</p>
        </div>
      );
    } else {
      <h3>絵本が見つかりませんでした。</h3>;
    }
  };

  return (
    <div className={`${styles.header}`}>
      <h2>ほんだな</h2>
      <hr></hr>
      <table className={styles.bookshelf}>
        <thead></thead>
        <tbody>
          {bookTable.map((line, index) => (
            <tr key={`index${index}`}>
              {line.map((item) => (
                <td key={`key${item[0]}`}>
                  <Image
                    src={item[2]}
                    width={100}
                    height={100}
                    alt=""
                    onClick={() => viewInfo(item[0])}
                  ></Image>
                  <br></br>
                  <p>{item[1]}</p>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Menubar />
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        {modalContents()}
        <button onClick={closeModal}> キャンセル </button>
        <button onClick={startBook}> ひらく </button>
      </Modal>
    </div>
  );
};
