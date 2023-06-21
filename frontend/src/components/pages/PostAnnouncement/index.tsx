import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export const PostAnnouncement = () => {
    const [formValues, setFormValues] = useState({
        title: "",
        content: "",
        name: "",
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
        if (baseUrl === undefined) {
            throw new Error("内部エラー");
        }
        try {
            const response = await fetch(`${baseUrl}/auth/signup`, {
                method: "POST",
                body: JSON.stringify({
                    formValues,
                }),
            });
            ScreenTransition();
        } catch (e) {
            alert("作成に失敗しました");
        }
    };

    const router = useRouter();

    const ScreenTransition = () => {
        router.push("/announcement-page");
    };

    return (
        <div>
            <h2>お知らせ投稿</h2>
            <hr />
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <label>
                        題名
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formValues.title}
                            onChange={(e) =>
                                setFormValues((val) => ({
                                    ...val,
                                    title: e.target.value,
                                }))
                            }
                            required={true}
                        />
                    </label>
                    <label>
                        内容
                        <textarea
                            name="content"
                            id="content"
                            value={formValues.content}
                            onChange={(e) =>
                                setFormValues((val) => ({
                                    ...val,
                                    content: e.target.value,
                                }))
                            }
                            required={true}
                        ></textarea>
                    </label>
                    <label>
                        投稿者名
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formValues.name}
                            onChange={(e) =>
                                setFormValues((val) => ({
                                    ...val,
                                    name: e.target.value,
                                }))
                            }
                            required={true}
                        />
                    </label>
                    <button type="submit">投稿内容を確認</button>
                    <Link href="/announcement-page">投稿一覧ページへ戻る</Link>
                </div>
            </form>
        </div>
    );
};
