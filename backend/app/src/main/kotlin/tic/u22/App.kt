/*
 * ここはサンプルソースです。開発では変更を加えないでください。
 * なお、どのパッケージに編集を加えるかについては、設計のユースケース図のパッケージを参照してください。
 * データクラスはUtilsに全て定義されており、内容はテーブル設計と全く同じなので、そちらを参照してください。
 * なお、テーブルに値を入れるときのバリデーションは基本考えなくて大丈夫です(フロントエンドで行うため)
 */
package tic.u22

import aws.sdk.kotlin.services.lambda.*
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import java.util.UUID
import kotlin.reflect.*
import kotlin.reflect.full.*
import kotlinx.coroutines.runBlocking

import com.google.gson.Gson

// GsonとUtilsのインスタンス化
val gson = Gson()
val utils = Utils()

/**
 * サンプルソースクラス
 *
 * RequestHandlerを継承している
 *
 * 第二引数のStringが返り値の型(JSONなのでString)
 */
class App : RequestHandler<Map<String, Any>, String> {

    /**
     * Lambda関数で実行される関数。
     *
     * @param event Map<String, Any>?: Lambda関数に渡される引数
     * @param context Context?: Context
     *
     * return String: フロントに渡すJSON
     */
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        // 非同期処理開始
        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換
                val u_id = UUID.randomUUID().toString()
                val u_id2 = UUID.randomUUID().toString()                      // 一意のUUIDを生成

                // 以下nullチェックを行いながら、値をStringとして受け取って変数に代入する
                val family_name = if (body["family_name"] != null) {body["family_name"]!! as String} else {throw Exception("family_name is null")}
                val first_name = if (body["first_name"] != null) {body["first_name"]!! as String} else {throw Exception("first_name is null")}
                val family_name_roma = if (body["family_name_roma"] != null) {body["family_name_roma"]!! as String} else {throw Exception("family_name_roma is null")}
                val first_name_roma = if (body["first_name_roma"] != null) {body["first_name_roma"]!! as String} else {throw Exception("first_name_roma is null")}
                val child_lock = if (body["child_lock"] != null) {body["child_lock"]!! as String} else {throw Exception("child_lock is null")}
                val account_name = if (body["account_name"] != null) {body["account_name"]!! as String} else {throw Exception("account_name is null")}
                
                // Userデータクラスに以上のデータを渡し、user変数にインスタンス化して渡す
                val user = User(
                    u_id = u_id,
                    family_name = family_name,
                    first_name = first_name,
                    family_name_roma = family_name_roma,
                    first_name_roma = first_name_roma,
                    child_lock = child_lock,
                    account_name = account_name
                )

                val user2 = User(
                    u_id = u_id2,
                    family_name = family_name,
                    first_name = first_name,
                    family_name_roma = family_name_roma,
                    first_name_roma = first_name_roma,
                    child_lock = child_lock,
                    account_name = account_name
                )

                // LoginLogデータクラスにユーザーIDを渡し、log変数にインスタンス化して渡す
                val log = LoginLog(
                    u_id = u_id
                )

                // DynamoDBのインスタンス化、テーブル名の設定
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "user"

                // 以下DBの処理実行・ログの出力
                println("ユーザーを追加")
                dynamo.addItem(tableName, user)
                dynamo.addItem(tableName, user2)
                println("追加完了\n")

                println("全件取得")
                println(dynamo.scanAll(tableName))
                println("取得完了\n")

                println("id検索")
                val result = dynamo.searchByKey(tableName, listOf(u_id))
                println(result)
                println("検索完了\n")

                println("id検索(複数)")
                println(dynamo.searchByKeys(tableName, listOf(listOf(u_id), listOf(u_id2), listOf("undefined"))))
                println("検索完了\n")

                println("メールアドレスで絞り込み")
                println(dynamo.searchByAny(tableName, "email", "sample@example.com", "="))
                println("取得完了\n")
                
                println("メールアドレスを更新")
                dynamo.updateItem(tableName, listOf(u_id), mapOf("email" to "test@example.com"))
                println(dynamo.searchByKey(tableName, listOf(u_id)))
                println("更新完了\n")
                
                println("メールアドレスで絞り込み")
                println(dynamo.searchByAny(tableName, "email", "sample@example.com", "="))
                println("取得完了\n")

                println("削除")
                println(dynamo.deleteByKey(tableName, listOf(u_id)))
                println("削除完了\n")

                println("ログインログを追加")
                dynamo.addItem("l_log", log)
                println("追加完了\n")

                println("ログインログを検索")
                println(dynamo.searchByKey("l_log", listOf(u_id, log.datetime)))
                println("検索完了\n")

                // {"result": {結果の連想配列}}
                mapOf("response_status" to "success", "result" to utils.toMap(utils.attributeValueToObject(result, "user")))
            } catch (e:Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)       // JSONに変換してフロントに渡す
    }
}

/**
 * S3サンプルソースクラス**一旦使用予定なし**
 *
 * RequestHandlerを継承している
 *
 * 第二引数のStringが返り値の型(JSONなのでString)
 */
class S3Sample : RequestHandler<Map<String, Any>, String> {
    val s3 = S3(Settings().AWS_REGION) // S3のインスタンス化
    val bucketName = Settings().AWS_BUCKET // バケット名の設定

    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            try{
                if (event == null) { throw Exception("event is null") } // event引数のnullチェック
                if (event["body"] == null) { throw Exception("body is null") } // bodyのnullチェック

                val body = utils.formatJsonEnv(event["body"]!!)
                val img = if (body["img"] == null) { throw Exception("image is null") } else { body["img"]!! as String }
                println("img URI = ${img}")
                // S3へのアップロード
                val img_res = s3.putObject(bucketName, "img.png", img, null)

                // S3からのダウンロード
                val img_got = s3.getObject(bucketName, "img.png")
                println("img_got URI = ${img_got}")

                // S3へのアップロード
                val img_got_res = s3.putObject(bucketName, "img_reup.png", img_got, null)

                // JSONで結果の変換
                mapOf("response_status" to "success", "result" to mapOf(
                    "img" to "$img_res",
                    "img_reup" to "$img_got_res"
                ))
            } catch (e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return  gson.toJson(res)
    }
}

// ローカル環境実行用
fun main() {
    // handlerを起動
    val app = S3Sample()
    app.handleRequest(null, null)
}
