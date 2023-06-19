export const MessageSentSuccessfully = () => {
    const handleSubmit = async () => {
        // event.preventDefault();

        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
        if (baseUrl === undefined) {
            throw new Error("内部エラー");
        }
        // Signup画面の関数呼び出しする
    };

    return (
        <div>
            <div>
                <p>メールを送信しました</p>
                <p>メールボックスを確認してください。</p>
            </div>
            <div>
                <button type="submit" onClick={handleSubmit}>
                    メールを再送信する
                </button>
            </div>
        </div>
    );
};
