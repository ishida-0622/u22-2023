import Router, { useRouter } from "next/router";
import Image from "next/image";
import styles from "./index.module.scss";
import { Menubar } from "@/components/elements/Menubar";
import backGround from "@/components/pages/PuzzleResult/images/confetti.gif"

export const PuzzleResult = () => {
  const router = useRouter();
  const { imageUrl } = router.query;

  // TODO:CSS完了後書き換え
  // if (typeof imageUrl !== "string") {
  //   // TODO:404
  //   return (
  //     <main id="notfound">
  //       <h1>404 Not Found.</h1>
  //       <button onClick={() => Router.push("/")}>to Top</button>
  //     </main>
  //   );
  // }

  return (
    <div className={`${styles.container}`} >

      <Image className={`${styles.back_ground}`} src={backGround} alt="背景画像" />

      <h1 className={`${styles.big_message}`}>congratulation！</h1>
      {/* TODO:CSS完了後書き換え */}
      <div className={`${styles.seal_field}`}>
        <Image
          className={`${styles.got_seal}`}
          src={
            "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/IMG_3yvjyu.jpg"
          }
          alt="seal"
          // UI班へ
          // width, heightは必要に応じて書き換えてよいです
          width={230}
          height={230}
        />
      </div>
      {/* <Image src={imageUrl} alt="seal" width={100} height={100} /> */}
      <p className={`${styles.small_message}`}>You got a seal！</p>
      {/* TODO:フッター */}
      <Menubar />
    </div>
  );
};
