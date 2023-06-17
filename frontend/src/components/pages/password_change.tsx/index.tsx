import { useState } from "react";
import { useRouter } from "next/router";

export const PasswordChange = () => {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const changePasswordConfirm = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPasswordConfirm(event.target.value);
    };

    const router = useRouter();

    const PageTransition = () => {
        router.push("/login");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
        if (baseUrl === undefined) {
            throw new Error("内部エラー");
        }
        try {
            const response = await fetch(`${baseUrl}/auth/password-change`, {
                method: "POST",
                body: JSON.stringify({
                    password: password,
                    passwordConfirm: passwordConfirm,
                }),
            });
            // responseの処理
            // responseがtrueの時、画面遷移をする
            // responseがfalseの時、アラートを出す。
            PageTransition();
        } catch (e) {
            alert("データの送信に失敗しました");
        }
    };

    return (
        <div>
            <h2>パスワード再設定</h2>
            <hr />
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <label>
                        新しいパスワード
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={changePassword}
                            required={true}
                        />
                    </label>
                    <label>
                        確認用
                        <input
                            type="password"
                            name="passwordConfirm"
                            id="passwordConfirm"
                            value={passwordConfirm}
                            onChange={changePasswordConfirm}
                            required={true}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit">変更する</button>
                </div>
            </form>
        </div>
    );
};
