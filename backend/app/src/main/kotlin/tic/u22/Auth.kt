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
    runBlocking {
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
    }
    return ""
  }
}

fun main() {
  // handlerを起動
  val app = App()
  app.handleRequest(null, null)
}
