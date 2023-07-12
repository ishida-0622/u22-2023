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

/**
 * 任意の個数のIDを受け取りユーザーの情報を取得する
 *
 * @param event Map<String, Any>?: u_id:[value1, value2, ...]
 * @param context Context?: Context
 *
 * return String: "result": {["u_id": "u_id", "family_name": "family_name", "first_name": "first_name", "email": "email", "password": "password", "child_lock": "child_lock", "account_name": "account_name"],[...]}
 */
class ScanUsers : RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
    val res = runBlocking {
      try {
        val dynamo = Dynamo(Settings().AWS_REGION)
        val tableName = "user"

        if (event == null) {throw Exception("event is null")}
        if (event["body"] == null) {throw Exception("body is null")}
        val body = utils.formatJsonEnv(event["body"]!!)
        val u_id: List<String> = if (body["u_id"] != null) {body["u_id"]!! as List<String>} else {throw Exception("body[u_id] is null")}

        // 検索
        val users = dynamo.searchByKeys(tableName, u_id.map { listOf(it) })
        mapOf("response_status" to "success",
          "result" to users.map{
          utils.toMap(utils.attributeValueToObject(it, "user"))
        })
      } catch(e: Exception){
        mapOf("response_status" to "fail", "error" to "$e")
      }
    }
    return gson.toJson(res)
  }
}
