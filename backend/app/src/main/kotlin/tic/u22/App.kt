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
import com.google.gson.JsonParser

class App : RequestHandler<Map<String, String>, String> {
    override fun handleRequest(event: Map<String, String>?, context: Context?): String{
    val res = runBlocking {
    if (event == null) {throw Exception("event is null")}
    val u_id = UUID.randomUUID().toString()
    val family_name = if (event["family_name"] != null) {event["family_name"]!!} else {throw Exception("family_name is null")}
    val first_name = if (event["first_name"] != null) {event["first_name"]!!} else {throw Exception("first_name is null")}
    val family_name_roma = if (event["family_name_roma"] != null) {event["family_name_roma"]!!} else {throw Exception("family_name_roma is null")}
    val first_name_roma = if (event["first_name_roma"] != null) {event["first_name_roma"]!!} else {throw Exception("first_name_roma is null")}
    val email = if (event["email"] != null) {event["email"]!!} else {throw Exception("email is null")}
    val password = if (event["password"] != null) {event["password"]!!} else {throw Exception("password is null")}
    val child_lock = if (event["child_lock"] != null) {event["child_lock"]!!} else {throw Exception("child_lock is null")}
    val account_name = if (event["account_name"] != null) {event["account_name"]!!} else {throw Exception("account_name is null")}
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

    val dynamo = Dynamo(Settings().AWS_REGION)
    val tableName = "user"

    println("ユーザーを追加")
    dynamo.addItem(tableName, user)
    println("追加完了\n")

    println("全件取得")
    println(dynamo.scanAll(tableName))
    println("取得完了\n")

    println("id検索")
    println(dynamo.searchByKey(tableName, u_id))
    println("検索完了\n")

    println("メールアドレスで絞り込み")
    println(dynamo.searchByAny(tableName, "email", "sample@example.com", "="))
    println("取得完了\n")
    
    println("メールアドレスを更新")
    dynamo.updateItem(tableName, u_id, "email", "test@example.com")
    println(dynamo.searchByKey(tableName, u_id))
    println("取得完了\n")
    
    println("メールアドレスで絞り込み")
    println(dynamo.searchByAny(tableName, "email", "sample@example.com", "="))
    println("取得完了\n")

    println("削除")
    println(dynamo.deleteByKey(tableName, u_id))
    println("削除完了\n")

    user
    }
    return Gson().toJson(res)
    }
}

fun main() {
    // handlerを起動
    val app = App()
    app.handleRequest(null, null)
}
