# API の request と response の書式一覧

注意：request は全て body 以下(フロントエンドがコード上で送るもの)を記している。response も responseJson 以下を記してある。

尚完成済みの API については、ゲートウェイ URL を各説明のタイトルに設定してある。

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
    "email": "email",
    "password": "password",
    "child_lock": "child_lock",
    "account_name": "account_name"
}
```

response

```json
{
    "result": "success or fail"
}
```

### [LogIn]()

ログインする

request

```json
{
    "u_id": "u_id",
    "password": "password"
}
```

response

```json
{
    "result": "success or fail",
    "error": "エラー内容(failの時のみ)"
}
```

### [Quit]()

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
    "result": "success or fail"
}
```

### [ScanUsers]()

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
    "result": [
        {
            "u_id": "u_id1",
            "family_name": "family_name1",
            "first_name": "first_name1",
            "family_name_roma": "family_name_roma1",
            "first_name_roma": "first_name_roma1",
            "email": "email1",
            "password": "password1",
            "child_lock": "child_lock1",
            "account_name": "account_name1",
            "limit_time": "limit_time1",
            "delete_flg": "delete_flg1",
            "authed": "authed1"
        },
        {
            "u_id": "u_id2",
            "family_name": "family_name2",
            "first_name": "first_name2",
            "family_name_roma": "family_name_roma2",
            "first_name_roma": "first_name_roma2",
            "email": "email2",
            "password": "password2",
            "child_lock": "child_lock2",
            "account_name": "account_name2",
            "limit_time": "limit_time2",
            "delete_flg": "delete_flg2",
            "authed": "authed2"
        }
    ]
}
```

### [UpdateUser]()

ユーザー情報を変更する

request

```json
{
    "u_id": "u_id",
    "family_name": "family_name",
    "first_name": "first_name",
    "family_name_roma": "family_name_roma",
    "first_name_roma": "first_name_roma",
    "email": "email",
    "password": "password",
    "child_lock": "child_lock",
    "account_name": "account_name",
    "limit_time": "limit_time",
    "delete_flg": "delete_flg",
    "authed": "authed"
}
```

response

```json
{
    "result": "success or fail"
}
```

## パズル系

### [RegisterPuzzle]()

パズルを登録する

request

```json
{
    "title": "title",
    "description": "description",
    "icon": "アイコン(問題一覧に表示されるやつ)写真のURI",
    "words": [
        ["I", "シルエットのURI", "イラストのURI", "音声のURI"],
        ["have", "シルエットのURI", "イラストのURI", "音声のURI"],
        ["a pen", "シルエットのURI", "イラストのURI", "音声のURI"]
    ]
}
```

response

```json
{
    "result": "success or fail"
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
        ["I", "シルエットのURI", "イラストのURI", "音声のURI"],
        ["have", "シルエットのURI", "イラストのURI", "音声のURI"],
        ["a pen", "シルエットのURI", "イラストのURI", "音声のURI"]
    ]
}
```

response

```json
{
    "result": "success or fail"
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
    "result": "success or fail"
}
```

### [GetPuzzles]()

パズルを全件取得する

request

```json
{}
```

response

```json
{
    "result": [
        {
            "title": "title1",
            "description": "description1",
            "icon": "アイコン(問題一覧に表示されるやつ)写真のURI1",
            "create_date": "create_date1",
            "update_date": "update_date1"
        },
        {
            "title": "title2",
            "description": "description2",
            "icon": "アイコン(問題一覧に表示されるやつ)写真のURI2",
            "create_date": "create_date2",
            "update_date": "update_date2"
        }
    ]
}
```

### [StartPuzzle]()

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
    "result": "success or fail",
    "puzzle": {
        "title": "title1",
        "description": "description1",
        "icon": "アイコン(問題一覧に表示されるやつ)写真のURI1",
        "words": [
            ["I", "シルエットのURI", "イラストのURI", "音声のURI"],
            ["have", "シルエットのURI", "イラストのURI", "音声のURI"],
            ["a pen", "シルエットのURI", "イラストのURI", "音声のURI"]
        ],
        "create_date": "create_date1",
        "update_date": "update_date1"
    },
    "error": "エラー内容(ユーザーのゲームステータスが0でない、等)"
}
```

### [FinishPuzzle]()

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
    "result": "success or fail"
}
```

### [PausePuzzle]()

パズルを一時中断する

request

```json
{
    "u_id": "u_id",
    "p_id": "p_id",
    "words": ["N", "I", "a pen"] //[I] [have] [a pen]が正解の時、現在のピースが[(空)] [I] [a pen]である時の例
}
```

response

```json
{
    "result": "success or fail"
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

```json
{
    "result": "success or fail",
    "p_id": "p_id",
    "words": ["N", "I", "a pen"], //[I] [have] [a pen]が正解の時、現在のピースが[(空)] [I] [a pen]である時の例
    "error": "エラー内容(ゲームステータスが2でない等)"
}
```

## 読み聞かせ系

### [RegisterBook]()

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
    "result": "success or fail"
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
    "result": "success or fail"
}
```

### [DeleteBook]()

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
    "result": "success or fail"
}
```

### [GetBooks]()

本を全件取得する

request

```json
{}
```

response

```json
{
    "result": [
        {
            "b_id": "b_id1",
            "title_jp": "title_jp1",
            "title_en": "title_en1",
            "summary": "summary1",
            "author": "auhor1",
            "thumbnail": "サムネイル写真のURI1",
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
            "create_date": "create_date2",
            "update_date": "update_date2"
        }
    ]
}
```

### [StartBook]()

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
    "result": "success or fail",
    "book": {
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
        "create_date": "create_date1",
        "update_date": "update_date1"
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
    "result": "success or fail"
}
```

### [PauseBook]()

読み聞かせを一時中断する

request

```json
{
    "u_id": "u_id",
    "b_id": "b_id",
    "page": "1" //現在のページ数
}
```

response

```json
{
    "result": "success or fail"
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

```json
{
    "result": "success or fail",
    "b_id": "b_id",
    "page": ["ページ数"],
    "error": "エラー内容(ゲームステータスが4でない等)"
}
```

## お知らせ系

### [RegisterNotice]()

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
    "result": "success or fail"
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
    "result": "success or fail"
}
```

### [GetNotices]()

お知らせを全件取得する

request

```json
{}
```

response

```json
{
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
    ]
}
```

## その他(ログ・ステータス等)

### [ScanL_log]()

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
    "result": [
        {
            "u_id": "u_id",
            "datetime": "datetime1"
        },
        {
            "u_id": "u_id",
            "datetime": "datetime2"
        }
    ]
}
```

### [ScanLoginDates]()

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
    "result": [
        {
            "u_id": "u_id",
            "date": "date1"
        },
        {
            "u_id": "u_id",
            "datetime": "date2"
        }
    ]
}
```

### [ScanP_log]()

パズルプレイログを取得する

request

```json
{
    "u_id": "u_id",
    "p_id": "p_id" // 任意：指定した場合は特定のパズルのログを、指定しなかった場合は該当ユーザーの全てのログを取得する
}
```

response

```json
{
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
        } // p_idを指定した場合は、resultの配列要素は1つのみ
    ]
}
```

### [ScanB_log]()

読み聞かせプレイログを取得する

request

```json
{
    "u_id": "u_id",
    "b_id": "b_id" // 任意：指定した場合は特定の読み聞かせのログを、指定しなかった場合は該当ユーザーの全てのログを取得する
}
```

response

```json
{
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
        } // b_idを指定した場合は、resultの配列要素は1つのみ
    ]
}
```

### [ScanStatus]()

ゲームステータスを取得する

request

```json
{
    "u_id": "u_id"
}
```

response

```json
{
    "result": {
        "u_id": "u_id",
        "game_status": "0~5",
        "status_infos": ["status_infos"] // 内容はテーブル設計書を参照、詳細はBEリーダーまで(nullの可能性あり)
    }
}
```
