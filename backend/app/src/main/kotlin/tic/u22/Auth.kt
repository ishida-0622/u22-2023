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
      // テスト用コードここまで

// 本番環境用コードここから
/*
// 解析したJSONを保持するデータクラス
data class FormValues(
    val familyname: String = "",
    val firstname: String = "",
    val familynameEng: String = "",
    val firstnameEng: String = "",
    val username: String = "",
    val email: String = "",
    val password: String = "",
    val passwordConfirm: String = "",
    val child: String = "",
    val childConfirm: String = "",
    val consent: Boolean = false
)

class App : RequestHandler<Map<String, Any>, String> {
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
      val family_name = if(formValues.familyname.isNotEmpty()) formValues.familyname else throw Exception("familynameが空です")
      val first_name = if(formValues.firstname.isNotEmpty()) formValues.firstname else throw Exception("firstnameが空です")
      val family_name_roma = if(formValues.familynameEng.isNotEmpty()) formValues.familynameEng else throw Exception("familynameEngが空です")
      val first_name_roma = if(formValues.firstnameEng.isNotEmpty()) formValues.firstnameEng else throw Exception("firstnameEngが空です")
      val email = if(formValues.email.isNotEmpty()) formValues.email else throw Exception("emailが空です")
      val password = if(formValues.password.isNotEmpty()) formValues.password else throw Exception("passwordが空です")
      val child_lock = if(formValues.child.isNotEmpty()) formValues.child else throw Exception("childが空です")
      val account_name = if(formValues.username.isNotEmpty()) formValues.username else throw Exception("usernameが空です")
      */
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
