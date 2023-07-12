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
 * 退会する
 */
class Quit: RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            if (event == null) {
                throw Exception("event is null")
            }
            if (event["body"] == null) {
                throw Exception("body is null")
            }
            val body = utils.formatJsonEnv(event["body"]!!)
            val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}

            // ユーザーの退会処理
            val dynamo = Dynamo(Settings().AWS_REGION)
            val tableName = "user"

            val result = dynamo.updateItem(tableName, listOf(u_id),mapOf("delete_flg" to true))
            if(result == "DONE"){mapOf("result" to "success")}else{mapOf("result" to "fail")}
        }

        return gson.toJson(res)
    }
}
