import { useState } from "react";
import { useRouter } from "next/router";

export const PostAnnouncement = () => {
    const [formValues, setFormValues] = useState({
        consent: false,
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
        if (baseUrl === undefined) {
            throw new Error("内部エラー");
        }
        try {
            if (formValues.consent === true) {
                const response = await fetch(`${baseUrl}/auth/signup`, {
                    method: "POST",
                    body: JSON.stringify({
                        formValues,
                    }),
                });
                ScreenTransition();
            } else {
                alert("規約に同意してください。");
            }
        } catch (e) {
            alert("作成に失敗しました");
        }
    };

    const router = useRouter();

    const ScreenTransition = () => {
        router.push("/login");
    };

    return (
        <div>
            <h2>お知らせ投稿</h2>
            <hr />
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <button type="submit">投稿内容を確認</button>
                </div>
            </form>
        </div>
    );
};
