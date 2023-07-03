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

// テスト用コードここから
// class Signup : RequestHandler<Map<String, String>, String> {
//   override fun handleRequest(event: Map<String, String>?, context: Context?): String{
//     val res = runBlocking {
//       if (event == null) {throw Exception("event is null")}
//       val u_id = UUID.randomUUID().toString()
//       val family_name = if (event["family_name"] != null) {event["family_name"]!!} else {throw Exception("family_name is null")}
//       val first_name = if (event["first_name"] != null) {event["first_name"]!!} else {throw Exception("first_name is null")}
//       val family_name_roma = if (event["family_name_roma"] != null) {event["family_name_roma"]!!} else {throw Exception("family_name_roma is null")}
//       val first_name_roma = if (event["first_name_roma"] != null) {event["first_name_roma"]!!} else {throw Exception("first_name_roma is null")}
//       val email = if (event["email"] != null) {event["email"]!!} else {throw Exception("email is null")}
//       val password = if (event["password"] != null) {event["password"]!!} else {throw Exception("password is null")}
//       val child_lock = if (event["child_lock"] != null) {event["child_lock"]!!} else {throw Exception("child_lock is null")}
//       val account_name = if (event["account_name"] != null) {event["account_name"]!!} else {throw Exception("account_name is null")}
      // テスト用コードここまで

// 本番環境用コードここから
// 解析したJSONを保持するデータクラス
data class FormValues(
    val family_name: String,
    val first_name: String ,
    val family_name_roma: String,
    val first_name_roma: String,
    val email: String,
    val password: String,
    val child_lock: String,
    val account_name: String,
)

/**
 * サインアップを処理するクラス。
 * AWS Lambda関数のリクエストハンドラとして実装されています。
 */
class Signup : RequestHandler<Map<String, Any>, String> {
/**
 * Lambda関数のエントリーポイント。
 * サインアップリクエストを処理し、ユーザーをデータベースに追加します。
 *
 * @param event Map<String, String>: Lambda関数へのリクエストイベント
 * @param context Context: Lambda関数の実行コンテキスト
 * @return String: サインアップ処理の結果を表すJSON形式の文字列
 */
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String{
    val res = runBlocking {
      // eventが正しく送られてきているかを確認
      if (event == null) {throw Exception("event is null")}

      // JSONを解析する
      val body = event["body"] as String
      val jsonElement = JsonParser.parseString(body)
      val formValuesJson = jsonElement.asJsonObject["formValues"]
      val gson = Gson()
      val formValues = gson.fromJson(formValuesJson, FormValues::class.java)

      // ユーザーの情報を設定
      val u_id = UUID.randomUUID().toString()
      val family_name = if(formValues.family_name.isNotEmpty()) {formValues.family_name} else {throw Exception("FormValues: family_name is empty")}
      val first_name = if(formValues.first_name.isNotEmpty()) {formValues.first_name} else {throw Exception("FormValues: first_name is empty")}
      val family_name_roma = if(formValues.family_name_roma.isNotEmpty()) {formValues.family_name_roma} else {throw Exception("FormValues: family_name_roma is empty")}
      val first_name_roma = if(formValues.first_name_roma.isNotEmpty()) {formValues.first_name_roma} else {throw Exception("FormValues: first_name_roma is empty")}
      val email = if(formValues.email.isNotEmpty()) {formValues.email} else {throw Exception("FormValues: email is empty")}
      val password = if(formValues.password.isNotEmpty()) {formValues.password} else {throw Exception("FormValues: password is empty")}
      val child_lock = if(formValues.child_lock.isNotEmpty()) {formValues.child_lock} else {throw Exception("FormValues: child_lock is empty")}
      val account_name = if(formValues.account_name.isNotEmpty()) {formValues.account_name} else {throw Exception("FormValues: account_name is empty")}
      // 本番環境用コードここまで

      val user = User(
        u_id=u_id,
        family_name=family_name,
        first_name=first_name,
        family_name_roma=family_name_roma,
        first_name_roma=first_name_roma,
        email=email,
        password=password,
        child_lock=child_lock,
        account_name=account_name
      )

      val dynamo = Dynamo(Settings().AWS_REGION)
      val tableName = "user"

      // Emailの重複チェック
      if (dynamo.searchByAny(tableName, "email", email, "=").isNotEmpty()) {throw Exception("Email already exists")}

      // メールを送信する処理
      // TODO

      // ユーザーの追加
      dynamo.addItem(tableName, user)
      val res: Map<String, String> = mapOf("result" to "true")
      res
    }
    return Gson().toJson(res)
  }
}

fun main() {
  // handlerを起動
  val app = App()
  app.handleRequest(null, null)
}
