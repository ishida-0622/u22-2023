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

class GetBooks: RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            try {
                if (event == null) {
                    throw Exception("event is null")
                }
                if (event["body"] == null) {
                    throw Exception("body is null")
                }

                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "book"

                val result = dynamo.scanAll(tableName)
                mapOf("response_status" to "success",
                    "result" to result.map{
                        utils.toMap(utils.attributeValueToObject(it, "book"))
                    }
                )
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }

        return gson.toJson(res)
    }
}

class DeleteBook: RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            try {
                if (event == null) {
                    throw Exception("event is null")
                }
                if (event["body"] == null) {
                    throw Exception("body is null")
                }
                val body = utils.formatJsonEnv(event["body"]!!)
                val b_id = if (body["b_id"] != null) {body["b_id"]!! as String} else {throw Exception("b_id is null")}

                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "book"

                if (dynamo.searchByKey(tableName, listOf(b_id)).isEmpty()){ throw Exception("this b_id does not be registered") }
                val result = dynamo.deleteByKey(tableName, listOf(b_id))
                val dummyMap: Map<String, String> = mapOf()
                if (result == "DONE"){
                    mapOf(
                        "response_status" to "success",
                        "result" to dummyMap
                    )
                } else {
                    throw Exception("$result")
                }
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }

        return gson.toJson(res)
    }
}

/**
 * ゲームステータスを変更し、本の情報を返す
 *
 * @param u_id String: u_ID
 * @param b_id String: b_ID
 *
 * return String:
 * {
 *   "response_status": "success",
 *   "result": {
 *     "b_id": b_id,
 *     "create_date": 本作成日時,
 *     "pdf": PDFのS3キー
 *     "summary": 本の概要S3キー,
 *     "thumbnail": 本のサムネイルS3キー,
 *     "title_en": 英語タイトル,
 *     "title_jp": 日本語タイトル,
 *     "update_date": 本更新日時,
 *     "voice_keys": [
 *       "voice_key1",
 *       ...
 *     ]}
 * }
 */
class StartBook : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{
        val res = runBlocking {
            try{
                if (event == null) {throw Exception("event is null")}
                if (event["body"] == null) {throw Exception("body is null")}
                val body = utils.formatJsonEnv(event["body"]!!)

                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                val b_id = if (body["b_id"] != null) {body["b_id"]!! as String} else {throw Exception("b_id is null")}

                // DynamoDBのインスタンス化、テーブル名の設定
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "book"

                val status = dynamo.searchByKey("status", listOf(u_id))
                if (!status.containsKey("u_id")) {
                    throw Exception("this u_id does not exist")
                } else if (!status.containsKey("game_status")) {
                    throw Exception("unexpected error: this u_id does not game_status")
                }
                if((utils.toKotlinType(status["game_status"]!!) as String).toInt() != 0) {
                    throw Exception("game status is not 0: now is ${(utils.toKotlinType(status["game_status"]!!) as String).toInt()}")
                }

                val updated = dynamo.updateItem("status", listOf(u_id), mapOf("game_status" to 3))
                if(updated != "DONE"){
                    throw Exception("failed to update game status: $updated")
                }
                val result = dynamo.searchByKey(tableName, listOf(b_id))

                mapOf(
                    "resposne_status" to "success",
                    "result" to utils.toMap(utils.attributeValueToObject(result, "book"))
                )
            } catch (e: Exception) {
                mapOf(
                    "response_status" to "fail",
                    "error" to "$e"
                )
            }
        }
        return gson.toJson(res)       // JSONに変換してフロントに渡す
    }
}