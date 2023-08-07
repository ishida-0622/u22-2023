import { useState } from "react";

export default function A() {
  const [s, setS] = useState("");

  return (
    <div>
      <p>Foo</p>
      <input
        type="file"
        onChange={(e) => {
          const f = e.target.files;
          const a = new FileReader();
          a.onload = (e) => {
            console.log(e.target?.result);
            setS(e.target?.result! as string);
          };
          a.readAsDataURL(f![0]);
        }}
      />
      <button
        onClick={() => {
          console.log(s);
          fetch(
            "https://887jtfzw91.execute-api.ap-northeast-1.amazonaws.com/testFunc",
            {
              method: "POST",
              body: JSON.stringify({
                img: s,
              }),
            }
          ).then(() => {
            console.log("fetch");
          });
        }}
      >
        submit
      </button>
    </div>
  );
}
