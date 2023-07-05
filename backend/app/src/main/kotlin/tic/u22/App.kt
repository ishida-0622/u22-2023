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

val gson = Gson()
val utils = Utils()
class App : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{
        val res = runBlocking {
            if (event == null) {throw Exception("event is null")}
            if (event["body"] == null) {throw Exception("body is null")}
            val body = utils.formatJsonEnv(event["body"]!!)
            val u_id = UUID.randomUUID().toString()
            val family_name = if (body["family_name"] != null) {body["family_name"]!! as String} else {throw Exception("family_name is null")}
            val first_name = if (body["first_name"] != null) {body["first_name"]!! as String} else {throw Exception("first_name is null")}
            val family_name_roma = if (body["family_name_roma"] != null) {body["family_name_roma"]!! as String} else {throw Exception("family_name_roma is null")}
            val first_name_roma = if (body["first_name_roma"] != null) {body["first_name_roma"]!! as String} else {throw Exception("first_name_roma is null")}
            val email = if (body["email"] != null) {body["email"]!! as String} else {throw Exception("email is null")}
            val password = if (body["password"] != null) {body["password"]!! as String} else {throw Exception("password is null")}
            val child_lock = if (body["child_lock"] != null) {body["child_lock"]!! as String} else {throw Exception("child_lock is null")}
            val account_name = if (body["account_name"] != null) {body["account_name"]!! as String} else {throw Exception("account_name is null")}
            val user = User(
                u_id = u_id,
                family_name = family_name,
                first_name = first_name,
                family_name_roma = family_name_roma,
                first_name_roma = first_name_roma,
                email = email,
                password = password,
                child_lock = child_lock,
                account_name = account_name
            )

            val log = LoginLog(
                u_id = u_id
            )

            val dynamo = Dynamo(Settings().AWS_REGION)
            val tableName = "user"

            println("ユーザーを追加")
            dynamo.addItem(tableName, user)
            println("追加完了\n")

            println("全件取得")
            println(dynamo.scanAll(tableName))
            println("取得完了\n")

            println("id検索")
            println(dynamo.searchByKey(tableName, listOf(u_id)))
            println("検索完了\n")

            println("メールアドレスで絞り込み")
            println(dynamo.searchByAny(tableName, "email", "sample@example.com", "="))
            println("取得完了\n")
            
            println("メールアドレスを更新")
            dynamo.updateItem(tableName, listOf(u_id), "email", "test@example.com")
            println(dynamo.searchByKey(tableName, listOf(u_id)))
            println("取得完了\n")
            
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

            mapOf("result" to user)
        }
        return Gson().toJson(res)
    }
}

class S3Sample : RequestHandler<Map<String, String>, String> {
    val utils = Utils()
    val s3 = S3(Settings().AWS_REGION)
    val bucketName = Settings().AWS_BUCKET

    override fun handleRequest(event: Map<String, String>?, context: Context?): String{
        val res = runBlocking{
            // S3からファイルを取得してfilesディレクトリに保存
            s3.getObject(bucketName, "photo1.png", "photo1.png")
            // 取得したファイルをURI形式に変換
            val uri = utils.encodeToUri("./photo1.png")
            // URIからファイルを生成
            utils.decodeFromUri(uri, "./photo1_encoded")
            // 生成したファイルをS3にアップロード
            s3.putObject(bucketName, "photo1_encoded.png", "photo1_encoded.png", null)
        }
        return res
    }
}

fun main() {
    // handlerを起動
    val app = App()
    app.handleRequest(null, null)
}
