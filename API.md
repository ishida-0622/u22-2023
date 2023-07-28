# API の request と response の書式一覧

注意：request は全て body 以下(フロントエンドがコード上で送るもの)を記している。response も responseJson 以下を記してある。

尚完成済みの API については、ゲートウェイ URL を各説明のタイトルに設定してある。

response.JSON のテンプレート

response

```json
{
    "response_status": "success、又はfailを返します",
    "result": {
        "必要に応じてデータが入ります": "key-value、若しくは配列で返されます"
    },
    "error": "エラー内容(response_statusがfailの時に、エラーの原因を返します)"
}
```

## ページ内リンク

-   [認証(アカウント)系](#認証アカウント系)
    -   [サインアップする](#signup)
    -   [ログインする](#login)
    -   [退会する](#quit)
    -   [指定のユーザー ID の情報をすべて取得する](#scanusers)
    -   [ユーザー情報を変更する](#UpdateUser)
-   [パズル系](#パズル系)
    -   [パズルを登録する](#registerpuzzle)
    -   [パズルを編集する](#updatepuzzle)
    -   [パズルを削除する](#deletepuzzle)
    -   [パズルを全件取得する](#getpuzzles)
    -   [パズルを開始する](#startpuzzle)
    -   [パズルを終了する](#finishpuzzle)
    -   [パズルを一時中断する](#pausepuzzle)
    -   [パズルを再開する](#restartpuzzle)
-   [読み聞かせ系](#読み聞かせ系)
    -   [読み聞かせを登録する](#registerbook)
    -   [読み聞かせを編集する](#updatebook)
    -   [読み聞かせを削除する](#deletebook)
    -   [読み聞かせを全件取得する](#getbooks)
    -   [読み聞かせを開始する](#startbook)
    -   [読み聞かせを終了する](#finishbook)
    -   [読み聞かせを一時中断する](#pausebook)
    -   [読み聞かせを再開する](#restartbook)
-   [お知らせ系](#お知らせ系)
    -   [お知らせを登録する](#registernotice)
    -   [お知らせを削除する](#deletenotice)
    -   [お知らせを全件取得する](#getnotices)
-   [その他(ログ等)](#その他ログ・ステータス等)
    -   [ログインログを取得する](#scanl_log)
    -   [指定範囲内のログイン日付を取得する](#scanlogindates)
    -   [パズルプレイログを取得する](#scanp_log)
    -   [読み聞かせプレイログを取得する](#scanb_log)
    -   [ゲームステータスを取得する](#scanstatus)
    -   [ゲームステータスを更新する](#setstatus)

## 認証(アカウント)系

### [SignUp]()

サインアップする

request

```json
{
    "family_name": "family_name",
    "first_name": "first_name",
    "family_name_roma": "family_name_roma",
    "first_name_roma": "first_name_roma",
    "child_lock": "child_lock",
    "account_name": "account_name"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [Login]()

Lambda 関数ではなく、認証 Only になりました

### [Quit](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/Quit)

退会する

request

```json
{
    "u_id": "u_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [ScanUsers](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/ScanUsers)

指定のユーザー ID の情報をすべて取得する

request

```json
{
    "u_id": ["u_id1", "u_id2"]
}
```

response

```json
{
    "response_status": "success or fail",
    "result": [
        {
            "u_id": "u_id1",
            "family_name": "family_name1",
            "first_name": "first_name1",
            "family_name_roma": "family_name_roma1",
            "first_name_roma": "first_name_roma1",
            "child_lock": "child_lock1",
            "account_name": "account_name1",
            "limit_time": "limit_time1",
            "delete_flg": "delete_flg1",
        },
        {
            "u_id": "u_id2",
            "family_name": "family_name2",
            "first_name": "first_name2",
            "family_name_roma": "family_name_roma2",
            "first_name_roma": "first_name_roma2",
            "child_lock": "child_lock2",
            "account_name": "account_name2",
            "limit_time": "limit_time2",
            "delete_flg": "delete_flg2",
        }
    ],
    "error": "エラー内容(failの時のみ)"
}
```

### [UpdateUser](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/UpdateUser)

ユーザー情報を変更する

パスワードとその他の情報は同時に変更できません。パスワードの変更時は、request.json に u_id と password のみを追加してください。また、パスワードを変更しない通常のユーザー情報更新については、逆にパスワードを含めないでください。

request

```jsonc
{
    "u_id": "u_id",
    "family_name": "family_name",
    "first_name": "first_name",
    "family_name_roma": "family_name_roma",
    "first_name_roma": "first_name_roma",
    "child_lock": "child_lock",
    "account_name": "account_name",
    "limit_time": "limit_time"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

## パズル系

### [RegisterPuzzle](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/RegisterPuzzle)

パズルを登録する

request

```jsonc
{
    "title": "title",
    "description": "description",
    "icon": "アイコン(問題一覧に表示されるやつ)写真のURI",
    "words": [
        {
            "word": "I",
            "shadow": "シルエットのURI",
            "illustration": "イラストのURI",
            "voice": "音声のURI",
            "is_displayed": true /* be動詞などのイラストとして表示されないものかどうか */,
            "is_dummy": false /* ダミーピースか否か */
        },
        {
            "word": "have",
            "shadow": "シルエットのURI",
            "illustration": "イラストのURI",
            "voice": "音声のURI",
            "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
            "is_dummy": false /* ダミーピースか否か */
        },
        {
            "word": "a pen",
            "shadow": "シルエットのURI",
            "illustration": "イラストのURI",
            "voice": "音声のURI",
            "is_displayed": true /* be動詞などのイラストとして表示されないもの */,
            "is_dummy": false /* ダミーピースか否か */
        },
        {
            "word": "am",
            "shadow": "シルエットのURI",
            "illustration": "イラストのURI",
            "voice": "音声のURI",
            "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
            "is_dummy": true /* ダミーピースか否か */
        }
    ]
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [UpdatePuzzle]()

パズルを編集する

request

```json
{
    "p_id": "p_id",
    "title": "title",
    "description": "description",
    "icon": "アイコン(問題一覧に表示されるやつ)写真のURI",
    "words": [
        {
            "word": "I",
            "shadow": "シルエットのURI",
            "illustration": "イラストのURI",
            "voice": "音声のURI",
            "is_displayed": true /* be動詞などのイラストとして表示されないものかどうか */,
            "is_dummy": false /* ダミーピースか否か */
        },
        {
            "word": "have",
            "shadow": "シルエットのURI",
            "illustration": "イラストのURI",
            "voice": "音声のURI",
            "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
            "is_dummy": false /* ダミーピースか否か */
        },
        {
            "word": "a pen",
            "shadow": "シルエットのURI",
            "illustration": "イラストのURI",
            "voice": "音声のURI",
            "is_displayed": true /* be動詞などのイラストとして表示されないもの */,
            "is_dummy": false /* ダミーピースか否か */
        },
        {
            "word": "am",
            "shadow": "シルエットのURI",
            "illustration": "イラストのURI",
            "voice": "音声のURI",
            "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
            "is_dummy": true /* ダミーピースか否か */
        }
    ]
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [DeletePuzzle]()

パズルを削除する

request

```json
{
    "p_id": "p_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [GetPuzzles](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/GetPuzzles)

パズルを全件取得する

request

```json
{}
```

response

```json
{
    "response_status": "success or fail",
    "result": [
        {
            "p_id": "p_id1",
            "title": "title1",
            "description": "description1",
            "icon": "アイコン(問題一覧に表示されるやつ)写真のURI1",
            "words": [
                {
                    "word": "I",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": true /* be動詞などのイラストとして表示されないものかどうか */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "have",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "a pen",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": true /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "am",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": true /* ダミーピースか否か */
                }
            ],
            "create_date": "create_date1",
            "update_date": "update_date1"
        },
        {
            "p_id": "p_id2",
            "title": "title2",
            "description": "description2",
            "icon": "アイコン(問題一覧に表示されるやつ)写真のURI2",
            "words": [
                {
                    "word": "He",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": true /* be動詞などのイラストとして表示されないものかどうか */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "has",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "a ball",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": true /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "is",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": true /* ダミーピースか否か */
                }
            ],
            "create_date": "create_date2",
            "update_date": "update_date2"
        }
    ],
    "error": "エラー内容(failの時のみ)"
}
```

### [StartPuzzle](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/StartPuzzle)

パズルを開始する

request

```json
{
    "u_id": "u_id",
    "p_id": "p_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {
        "p_id": "p_id",
        "title": "title",
        "description": "description",
        "icon": "アイコン(問題一覧に表示されるやつ)写真のURI",
        "words": [
            {
                "word": "I",
                "shadow": "シルエットのURI",
                "illustration": "イラストのURI",
                "voice": "音声のURI",
                "is_displayed": true /* be動詞などのイラストとして表示されないものかどうか */,
                "is_dummy": false /* ダミーピースか否か */
            },
            {
                "word": "have",
                "shadow": "シルエットのURI",
                "illustration": "イラストのURI",
                "voice": "音声のURI",
                "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
                "is_dummy": false /* ダミーピースか否か */
            },
            {
                "word": "a pen",
                "shadow": "シルエットのURI",
                "illustration": "イラストのURI",
                "voice": "音声のURI",
                "is_displayed": true /* be動詞などのイラストとして表示されないもの */,
                "is_dummy": false /* ダミーピースか否か */
            },
            {
                "word": "am",
                "shadow": "シルエットのURI",
                "illustration": "イラストのURI",
                "voice": "音声のURI",
                "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
                "is_dummy": true /* ダミーピースか否か */
            }
        ],
        "create_date": "create_date",
        "update_date": "update_date"
    },
    "error": "エラー内容(ユーザーのゲームステータスが0でない、等)"
}
```

### [FinishPuzzle](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/FinishPuzzle)

パズルを終了する

request

```json
{
    "u_id": "u_id",
    "p_id": "p_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [PausePuzzle]()

パズルを一時中断する

request

```jsonc
{
    "u_id": "u_id",
    "p_id": "p_id",
    "saved_data": [
        "N",
        "I",
        "a pen"
    ] /* [I] [have] [a pen]が正解の時、現在のピースが[(空)] [I] [a pen]である時の例 */
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [RestartPuzzle]()

パズルを再開する(ステータスは 1 に変更される)

request

```json
{
    "u_id": "u_id"
}
```

response

```jsonc
{
    "response_status": "success or fail",
    "result": {
        "puzzle_info": {
            "p_id": "p_id",
            "title": "title",
            "description": "description",
            "icon": "アイコン(問題一覧に表示されるやつ)写真のURI",
            "words": [
                {
                    "word": "I",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": true /* be動詞などのイラストとして表示されないものかどうか */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "have",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "a pen",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": true /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": false /* ダミーピースか否か */
                },
                {
                    "word": "am",
                    "shadow": "シルエットのURI",
                    "illustration": "イラストのURI",
                    "voice": "音声のURI",
                    "is_displayed": false /* be動詞などのイラストとして表示されないもの */,
                    "is_dummy": true /* ダミーピースか否か */
                }
            ],
            "create_date": "create_date",
            "update_date": "update_date"
        },
        "saved_data": [
            "N",
            "I",
            "a pen"
        ] /* [I] [have] [a pen]が正解の時、現在のピースが[(空)] [I] [a pen]である時の例 */
    },
    "error": "エラー内容(ゲームステータスが2でない等)"
}
```

## 読み聞かせ系

### [RegisterBook](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/RegisterBook)

本を登録する

request

```json
{
    "title_jp": "title_jp",
    "title_en": "title_en",
    "summary": "summary",
    "author": "auhor",
    "thumbnail": "サムネイル写真のURI",
    "pdf": "PDFファイルのURI",
    "voice": ["1ページ目読み聞かせ音声のURI", "2ページ目読み聞かせ音声のURI"]
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [UpdateBook]()

本を編集する

request

```json
{
    "b_id": "b_id",
    "title_jp": "title_jp",
    "title_en": "title_en",
    "summary": "summary",
    "author": "auhor",
    "thumbnail": "サムネイル写真のURI",
    "pdf": "PDFファイルのURI",
    "voice": ["1ページ目読み聞かせ音声のURI", "2ページ目読み聞かせ音声のURI"]
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [DeleteBook](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/DeleteBook)

本を削除する

request

```json
{
    "b_id": "b_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [GetBooks](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/GetBooks)

本を全件取得する

request

```json
{}
```

response

```json
{
    "response_status": "success or fail",
    "result": [
        {
            "b_id": "b_id1",
            "title_jp": "title_jp1",
            "title_en": "title_en1",
            "summary": "summary1",
            "author": "auhor1",
            "thumbnail": "サムネイル写真のURI1",
            "pdf": "PDFファイルのURI1",
            "voice": [
                "1ページ目読み聞かせ音声のURI1",
                "2ページ目読み聞かせ音声のURI1"
            ],
            "create_date": "create_date1",
            "update_date": "update_date1"
        },
        {
            "b_id": "b_id2",
            "title_jp": "title_jp2",
            "title_en": "title_en2",
            "summary": "summary2",
            "author": "auhor2",
            "thumbnail": "サムネイル写真のURI2",
            "pdf": "PDFファイルのURI2",
            "voice": [
                "1ページ目読み聞かせ音声のURI2",
                "2ページ目読み聞かせ音声のURI2"
            ],
            "create_date": "create_date2",
            "update_date": "update_date2"
        }
    ],
    "error": "エラー内容(failの時のみ)"
}
```

### [StartBook](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/StartBook)

読み聞かせを開始する

request

```json
{
    "u_id": "u_id",
    "b_id": "b_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {
        "b_id": "b_id",
        "title_jp": "title_jp",
        "title_en": "title_en",
        "summary": "summary",
        "author": "auhor",
        "thumbnail": "サムネイル写真のURI",
        "pdf": "PDFファイルのURI",
        "voice": [
            "1ページ目読み聞かせ音声のURI",
            "2ページ目読み聞かせ音声のURI"
        ],
        "create_date": "create_date",
        "update_date": "update_date"
    },
    "error": "エラー内容(ユーザーのゲームステータスが0でない、等)"
}
```

### [FinishBook]()

読み聞かせを終了する

request

```json
{
    "u_id": "u_id",
    "b_id": "b_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [PauseBook]()

読み聞かせを一時中断する

request

```jsonc
{
    "u_id": "u_id",
    "b_id": "b_id",
    "saved_data": 1 /* 現在のページ数 */
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [RestartBook]()

読み聞かせを再開する(ステータスは 3 に変更される)

request

```json
{
    "u_id": "u_id"
}
```

response

```jsonc
{
    "response_status": "success or fail",
    "result": {
        "book_info": {
            "b_id": "b_id",
            "title_jp": "title_jp",
            "title_en": "title_en",
            "summary": "summary",
            "author": "auhor",
            "thumbnail": "サムネイル写真のURI",
            "pdf": "PDFファイルのURI",
            "voice": [
                "1ページ目読み聞かせ音声のURI",
                "2ページ目読み聞かせ音声のURI"
            ],
            "create_date": "create_date",
            "update_date": "update_date"
        },
        "saved_data": 1 /* 現在のページ数 */
    },
    "error": "エラー内容(ゲームステータスが4でない等)"
}
```

## お知らせ系

### [RegisterNotice](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/RegisterNotice)

お知らせを登録する

request

```json
{
    "title": "title",
    "content": "content"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

<!--
### [UpdateNotice]()

お知らせを編集する

request

```json
{
    "n_id": "n_id",
    "title": "title",
    "content": "content",
    "create_date": "create_date"
}
```

response

```json
{
    "result": "success" or "fail"
}
``` -->

### [DeleteNotice]()

お知らせを削除する

request

```json
{
    "n_id": "n_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```

### [GetNotices](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/GetNotices)

お知らせを全件取得する

request

```json
{}
```

response

```json
{
    "response_status": "success or fail",
    "result": [
        {
            "n_id": "n_id1",
            "title": "title1",
            "content": "content1",
            "create_date": "create_date1"
        },
        {
            "n_id": "n_id2",
            "title": "title2",
            "content": "content2",
            "create_date": "create_date2"
        }
    ],
    "error": "エラー内容(failの時のみ)"
}
```

## その他(ログ・ステータス等)

### [ScanL_log](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/ScanL_log)

ログインログを取得する

request

```json
{
    "u_id": "u_id"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": [
        {
            "u_id": "u_id",
            "datetime": "datetime1"
        },
        {
            "u_id": "u_id",
            "datetime": "datetime2"
        }
    ],
    "error": "エラー内容(failの時のみ)"
}
```

### [ScanLoginDates]()

実装少し先になります

ログインボーナスように、指定範囲のログイン日を取得する

request

```json
{
    "u_id": "u_id",
    "start_date": "yyyyMMdd",
    "end_date": "yyyyMMdd"
}
```

response

```json
{
    "response_status": "success or fail",
    "result": [
        {
            "u_id": "u_id",
            "date": "date1"
        },
        {
            "u_id": "u_id",
            "datetime": "date2"
        }
    ],
    "error": "エラー内容(failの時のみ)"
}
```

### [ScanP_log](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/ScanP_log)

パズルプレイログを取得する

request

```jsonc
{
    "u_id": "u_id",
    "p_id": "p_id" /* 任意：指定した場合は特定のパズルのログを、指定しなかった場合は該当ユーザーの全てのログを取得する */
}
```

response

```jsonc
{
    "response_status": "success or fail",
    "result": [
        {
            "u_id": "u_id",
            "p_id": "p_id1",
            "play_times": "プレイ回数",
            "latest_play_datetime": "最後にプレイした日時"
        },
        {
            "u_id": "u_id",
            "p_id": "p_id2",
            "play_times": "プレイ回数",
            "latest_play_datetime": "最後にプレイした日時"
        } /* p_idを指定した場合は、resultの配列要素は1つのみ */
    ],
    "error": "エラー内容(failの時のみ)"
}
```

### [ScanB_log](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/ScanB_log)

読み聞かせプレイログを取得する

request

```jsonc
{
    "u_id": "u_id",
    "b_id": "b_id" /* 任意：指定した場合は特定の読み聞かせのログを、指定しなかった場合は該当ユーザーの全てのログを取得する */
}
```

response

```jsonc
{
    "response_status": "success or fail",
    "result": [
        {
            "u_id": "u_id",
            "b_id": "b_id1",
            "play_times": "プレイ回数",
            "latest_play_datetime": "最後にプレイした日時"
        },
        {
            "u_id": "u_id",
            "b_id": "b_id2",
            "play_times": "プレイ回数",
            "latest_play_datetime": "最後にプレイした日時"
        } /* b_idを指定した場合は、resultの配列要素は1つのみ */
    ],
    "error": "エラー内容(failの時のみ)"
}
```

### [ScanStatus](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/ScanStatus)

ゲームステータスを取得する

request

```json
{
    "u_id": "u_id"
}
```

response

```jsonc
{
    "response_status": "success or fail",
    "result": {
        "u_id": "u_id",
        "game_status": "0~5",
        "status_infos": [
            "status_infos"
        ] /* 内容はテーブル設計書を参照、詳細はBEリーダーまで(nullの可能性あり) */
    },
    "error": "エラー内容(failの時のみ)"
}
```

### [SetStatus](https://8j8e5qzbwa.execute-api.us-east-1.amazonaws.com/default/SetStatus)

ゲームステータスを取得する

request

```jsonc
{
    "u_id": "u_id",
    "game_status": 0 /* 0~4の数値(int) */
}
```

response

```jsonc
{
    "response_status": "success or fail",
    "result": {},
    "error": "エラー内容(failの時のみ)"
}
```
