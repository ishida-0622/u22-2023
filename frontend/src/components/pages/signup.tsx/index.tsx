import { useState } from 'react';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const changeUsername = (event:React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent the browser from reloading the page
        event.preventDefault();
    
        // Read the form data
        const form = event.target.;
        const formData = new FormData(form);
    
        // You can pass formData as a fetch body directly:
        fetch('/some-api', { method: form.method, body: formData });
    
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }
    
    return (
        <div>
            <h2>サインアップ</h2>
            <hr />
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <label>ユーザー名<br />
                        <input type="text" name="username" id="username" value={username} usernameOnChange={(e) => changeUsername(e)} required={true} />
                    </label>
                    <label>メールアドレス<br />
                        <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required={true} />
                        <select name = "emailtype">
                            <option value= "icloud">@icloud.com</option>
                        </select>
                    </label>
                    <br />
                    <label>パスワード<br />
                        <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required={true} />
                    </label>
                    <br />
                    <label>確認用<br />
                        <input type="password" name="passwordConfirmation" id="passwordConfirmation" required={true} />
                    </label>
                    <br />
                </div>
                <div>
                    <label>チャイルドロック<br />
                        <input type="text" name="child" id="child" required={true} />
                    </label>
                    <br />
                    <label>チャイルドロック確認用<br />
                        <input type="text" name="childConfirmation" id="childConfirmation" required={true} />
                    </label>
                    <br />
                    <label >
                        <input type="checkbox" id="consent" name="consent" defaultChecked={true} />
                        規約に同意する
                    </label>
                    <br />
                    <button type="submit">新規会員登録</button>
                </div>
            </form>
        </div> 
    );
}