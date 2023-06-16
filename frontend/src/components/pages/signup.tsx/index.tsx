import { useState } from "react";

export const Signup = () => {
    const [familyname, setFamilyname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [familynameEng, setFamilynameEng] = useState("");
    const [firstnameEng, setFirstnameEng] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [child, setChild] = useState("");
    const [childConfirm, setChildConfirm] = useState("");
    const [consent, setCnsent] = useState(false);

    const changeFamilyname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFamilyname(event.target.value);
    };

    const changeFirstname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstname(event.target.value);
    };

    const changeFamilynameEng = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFamilynameEng(event.target.value);
    };

    const changeFirstnameEng = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstnameEng(event.target.value);
    };

    const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const changeChild = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChild(event.target.value);
    };

    const changePasswordConfirm = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPasswordConfirm(event.target.value);
    };

    const changeChildConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChildConfirm(event.target.value);
    };

    const changeConsent = () => {
        setCnsent((val) => !val);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent the browser from reloading the page
        event.preventDefault();

        if (password !== passwordConfirm && child !== childConfirm) {
            alert("パスワードとチャイルドロック暗証番号が一致しません。");
        } else if (child !== childConfirm) {
            alert("チャイルドロックが一致しません。");
        } else if (password !== passwordConfirm) {
            alert("パスワードが一致しません。");
        } else {
            const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
            if (baseUrl === undefined) {
                throw new Error("内部エラー");
            }
            try {
                if (consent === true) {
                    const response = await fetch(`${baseUrl}/auth/signup`, {
                        method: "POST",
                        body: JSON.stringify({
                            familyname: familyname,
                            firstname: firstname,
                            familynameEng: familynameEng,
                            firstnameEng: firstnameEng,
                            username: username,
                            email: email,
                            password: password,
                            child: child,
                        }),
                    });
                } else {
                    alert("規約に同意してください。");
                }
            } catch (e) {
                alert("作成に失敗しました");
            }
        }
    };

    return (
        <div>
            <h2>サインアップ</h2>
            <hr />
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <label>
                        姓名
                        <input
                            type="text"
                            name="familyname"
                            id="familyname"
                            value={familyname}
                            onChange={(e) => changeFamilyname(e)}
                            required={true}
                        />
                    </label>
                    <label>
                        名前
                        <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            value={firstname}
                            onChange={(e) => changeFirstname(e)}
                            required={true}
                        />
                    </label>

                    <label>
                        姓名(ローマ字)
                        <input
                            type="text"
                            name="familynameEng"
                            id="familynameEng"
                            value={familynameEng}
                            onChange={(e) => changeFamilynameEng(e)}
                            required={true}
                        />
                    </label>

                    <label>
                        名前(ローマ字)
                        <input
                            type="text"
                            name="firstnameEng"
                            id="firstnameEng"
                            value={firstnameEng}
                            onChange={(e) => changeFirstnameEng(e)}
                            required={true}
                        />
                    </label>

                    <label>
                        アカウント名
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => changeUsername(e)}
                            required={true}
                        />
                    </label>

                    <label>
                        メールアドレス
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => changeEmail(e)}
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
                            onChange={(e) => changePassword(e)}
                            required={true}
                        />
                    </label>

                    <label>
                        確認用
                        <input
                            type="password"
                            name="passwordConfirmation"
                            id="passwordConfirmation"
                            onChange={changePasswordConfirm}
                            required={true}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        チャイルドロック
                        <input
                            type="text"
                            name="child"
                            id="child"
                            value={child}
                            onChange={(e) => changeChild(e)}
                            required={true}
                        />
                    </label>

                    <label>
                        チャイルドロック確認用
                        <input
                            type="text"
                            name="childConfirmation"
                            id="childConfirmation"
                            onChange={changeChildConfirm}
                            required={true}
                        />
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            id="consent"
                            name="consent"
                            checked={consent}
                            onChange={changeConsent}
                        />
                        規約に同意する
                    </label>

                    <button type="submit">新規会員登録</button>
                </div>
            </form>
        </div>
    );
};
