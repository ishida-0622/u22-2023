import Link from "next/link";
import { useRouter } from "next/router";
// import { useState } from "react";

export const Top = () => {
  const router = useRouter();

  // const ScreenTransition = () => {
  //   router.push("/");
  // };

  return (
    <div>
      <h2>ログイン</h2>
      <div>
        <button type="submit">ログイン</button>
      </div>
      <div>
        <Link href="/password-reset">
          IDやパスワードを忘れてしまった方はこちら
        </Link>
      </div>
      <div>
        <Link href="/signup">アカウント作成がまだの方はこちら</Link>
      </div>
    </div>
  );
};
