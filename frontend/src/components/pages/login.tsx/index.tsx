import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
        if (baseUrl === undefined) {
            throw new Error("内部エラー");
        }
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            // responseの処理
            // responseがtrueの時、画面遷移をする
            // responseがfalseの時、アラートを出す。
            ScreenTransition();
        } catch (e) {
            alert("データの送信に失敗しました");
        }
    };

    const router = useRouter();

    const ScreenTransition = () => {
        router.push("/");
    };

    return (
        <div>
            <h2>ログイン</h2>
            <p>パパ、ママに入力してもらってね！</p>
            <hr />
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <label>
                        メールアドレス
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            onChange={changeEmail}
                            required={true}
                        />
                        <select name="emailtype">
                            <option value="icloud">@icloud.com</option>
                        </select>
                    </label>

                    <label>
                        パスワード
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={changePassword}
                            required={true}
                        />
                    </label>
                </div>
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
            </form>
        </div>
    );
};
