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

class ScanUsers : RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
    val res = runBlocking {
      val utils = Utils()
      val dynamo = Dynamo(Settings().AWS_REGION)
      val tableName = "user"

      if (event == null) {throw Exception("event is null")}
      if (event["body"] == null) {throw Exception("body is null")}
      val body = utils.formatJsonEnv(event["body"]!!)
      if (body["id"] == null) {throw Exception("id is null")}
      val id: List<List<String>> = if (body["id"] != null) {body["id"]!! as List<List<String>>} else {throw Exception("id is null")}

      // 検索
      val users = dynamo.searchByKeys(tableName, id)
      val res = mapOf("result" to users)
      res
    }
    return Gson().toJson(res)
  }
}