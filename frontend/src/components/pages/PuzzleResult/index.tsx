import Router, { useRouter } from "next/router";
import Image from "next/image";

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
    <div>
      <h1>congratulation!!</h1>
      {/* TODO:CSS完了後書き換え */}
      <Image
        src={
          "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/IMG_3yvjyu.jpg"
        }
        alt="seal"
        // UI班へ
        // width, heightは必要に応じて書き換えてよいです
        width={100}
        height={100}
      />
      {/* <Image src={imageUrl} alt="seal" width={100} height={100} /> */}
      <p>get a seal</p>
      {/* TODO:フッター */}
    </div>
  );
};
