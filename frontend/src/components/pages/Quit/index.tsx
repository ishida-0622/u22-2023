import { useState } from "react";
import Router from "next/router";
import { auth } from "@/features/auth/firebase";
import { User, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { QuitRequest, QuitResponse } from "@/features/auth/types/quit";

export const Quit = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let user: User;
    let uid: string | null = null;
    try {
      user = (await signInWithEmailAndPassword(auth, email, password)).user;
      uid = user.uid;
    } catch {
      alert("メールアドレスかパスワードが間違っています");
      return;
    }

    if (!uid) {
      console.warn("uid is null");
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("base url is undefined");
    }

    try {
      const req: QuitRequest = {
        u_id: uid,
      };
      const res = await fetch(`${baseUrl}/Quit`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: QuitResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      await deleteUser(user);
    } catch (e) {
      console.error(`quit error\n${e}`);
      alert("退会に失敗しました");
    }
    Router.push("/signup");
  };

  return (
    <main>
      <h1>退会</h1>
      <form onSubmit={handlerSubmit}>
        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
        </label>
        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
          />
        </label>
        <input type="submit" value="退会" />
      </form>
    </main>
  );
};
