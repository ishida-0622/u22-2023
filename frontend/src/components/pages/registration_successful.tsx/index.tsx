import { useRouter } from "next/router";

export const RegistrationSuccessful = () => {
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
        PageTransition();
    };

    return (
        <div>
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <p>登録が完了しました</p>
                </div>
                <div>
                    <button type="submit">ログインする</button>
                </div>
            </form>
        </div>
    );
};
