import { useRouter } from "next/router";

export const RegistrationSuccessful = () => {
    const router = useRouter();

    const PageTransition = () => {
        router.push("/login");
    };

    const handleSubmit = async () => {
        PageTransition();
    };

    return (
        <div>
            <div>
                <p>登録が完了しました</p>
            </div>
            <div>
                <button type="submit" onClick={handleSubmit}>
                    ログインする
                </button>
            </div>
        </div>
    );
};
