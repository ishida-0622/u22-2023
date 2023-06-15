import { useState } from 'react';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [child,setChild] =useState('');
    const [childConfirm, setChildConfirm] = useState('');

    const changeUsername = (event:React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const changeEmail = (event:React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const changePassword = (event:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const changeChild = (event:React.ChangeEvent<HTMLInputElement>) => {
        setChild(event.target.value)
    }

    const changePasswordConfirm = (event:React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(event.target.value)
    }

    const changeChildConfirm = (event:React.ChangeEvent<HTMLInputElement>) => {
        setChildConfirm(event.target.value)
    }

    const signup = (username:string,email:string,password:string,child:string) => {
        
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent the browser from reloading the page
        event.preventDefault();

        if(password != passwordConfirm && child != childConfirm){
            alert("パスワードとチャイルドロック暗証番号が一致しません。")
        }else if(child != childConfirm){
            alert("チャイルドロックが一致しません。")
        }else if(password != passwordConfirm){
            alert("パスワードが一致しません。")
        }else{
            signup(username,email,password,child)
        }


        
        // Read the form data
        const form = event.target as HTMLFormElement;
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
            <form method="post"  onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label>ユーザー名<br />
                        <input type="text" name="username" id="username" onChange={(e) => changeUsername (e)} required />
                    </label>
                    <br />
                    <label>メールアドレス<br />
                        <input type="text" name="email" id="email"  onChange={(e) => changeEmail(e)} required />
                        <select name = "emailtype">
                            <option value= "icloud">@icloud.com</option>
                        </select>
                    </label>
                    <br />
                    <label>パスワード<br />
                        <input type="password" name="password" id="password"  onChange={(e) => changePassword(e)} required />
                    </label>
                    <br />
                    <label>確認用<br />
                        <input type="password" name="passwordConfirmation" id="passwordConfirmation" onChange={changePasswordConfirm}  required/>
                    </label>
                    <br />
                </div>
                <div>
                    <label>チャイルドロック<br />
                        <input type="text" name="child" id="child" value = {child} onChange={(e) => changeChild(e)} required />
                    </label>
                    <br />
                    <label>チャイルドロック確認用<br />
                        <input type="text" name="childConfirmation" id="childConfirmation" onChange={changeChildConfirm} required/>
                    </label>
                    <br />
                    <label >
                        <input type="checkbox" id="consent" name="consent" defaultChecked={false} />
                        規約に同意する
                    </label>
                    <br />
                    <button type="submit">新規会員登録</button>
                </div>
            </form>
        </div> 
    );
}