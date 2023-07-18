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
 * 
 */

class getNotice : RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
    val res = runBlocking {
      try {
        val dynamo = Dynamo(Settings().AWS_REGION)
        val tableName = "notice"

        val notices = dynamo.scanAll(tableName)
        println(notices)
        if (notices.isNotEmpty()) {
          mapOf("response_status" to "success",
          "result" to notices.map {
            utils.toMap(utils.attributeValueToObject(it, tableName))})
        } else {
          mapOf("response_status" to "fail", "error" to "Failed to retrieve notices")
        }
      } catch(e: Exception){
        mapOf("response_status" to "fail", "error" to "$e")
      }
    }
    return gson.toJson(res)
  }
}