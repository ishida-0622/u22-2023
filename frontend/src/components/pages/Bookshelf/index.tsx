import Router from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";
import styles from './index.module.scss';
import { GetAllBookResponse } from "@/features/book/types/get";
import { Menubar } from "@/components/elements/Menubar";
import Modal from 'react-modal';


Modal.setAppElement('#__next');


export const Bookshelf = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const [bookTable, setBookTable] = useState<string[][][]>([]);
    const [bookMap, setBookMap] = useState<Map<string, string[]>>(new Map);

    /** モーダルウィンドウを表示にする関数 */
    const openModal = () => setModalIsOpen(true);
    /** モーダルウィンドウを非表示にする関数 */
    const closeModal = () => {setModalIsOpen(false)};
    const setStatusFeatcher = async (key: string) => {
        const req = {
            // TODO:
            u_id: "43b45778-72eb-4ef6-9228-d569a6cd2cbd",
            game_status: "0"
        }
        const res = await fetch(key, {
            method: "POST",
            body: JSON.stringify(req)
        })
        return await res.json(); //as Promise<SetStatusResponse>;
    }
    const { data: setStatus, error: setStatusError } = useSWR(
        `${
            process.env.NEXT_PUBLIC_API_ENDPOINT
        }/SetStatus`,
        setStatusFeatcher
    )
    if (setStatusError) {
        return <p>{setStatusError}</p>;
    }

    const featcher = async (key: string) => {
        return fetch(key, {
            method: "POST",
            body: JSON.stringify({})
        }).then((res) => res.json() as Promise<GetAllBookResponse>)
    }
    
    const { data: AllBooks , error } = useSWR(
        `${
            process.env.NEXT_PUBLIC_API_ENDPOINT
        }/GetBooks`,
        featcher
    )
    useEffect(()=>{
        if (AllBooks) {
            if (AllBooks.response_status === "fail") {
                alert("絵本が見つかりませんでした。");
                Router.push("/");
            } else {
                const tempTable = AllBooks.result.map(x => [x.b_id, x.title_en, x.thumbnail, x.summary]);
                const len = Math.ceil(tempTable.length / 2);
                const table : string[][][] = [];
                table.push(tempTable.slice(0, len));
                table.push(tempTable.slice(len));
                tempTable.forEach(ele => {
                    bookMap.set(ele[0], [ele[1], ele[3]]);
                });
                setBookMap(bookMap);
                setBookTable(table);
            }
        }
    },[AllBooks])

    if (!AllBooks) {
        return <p>loading</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }
    const viewInfo = (b_id: string) => {
        setSelectedId(b_id);
        openModal();
    }
    const startBook = () => {
        Router.push({
            pathname: "/storytelling",
            query: {b_id: selectedId}
        })
    }
    const modalContents = () => {
        if (bookMap.has(selectedId)) {
            return (
                <div>
                    <h3>{bookMap.get(selectedId)![0]}</h3>
                    <p>{bookMap.get(selectedId)![1]}</p>
                </div>
            )
        } else {
            <h3>絵本が見つかりませんでした。</h3>
        }
    }
    

    return (
        <div>
            <h2>ほんだな</h2>
            <hr></hr>
            <table className={styles.bookshelf}>
                <thead></thead>
                <tbody>
                    {bookTable.map((line, index) => (
                        <tr key={`index${index}`}>
                            {line.map((item) => (
                                <td key={`key${item[0]}`}><img src={item[2]} width="30px" height="30px" onClick={() => viewInfo(item[0])}></img><br></br><p>{item[1]}</p></td>
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
