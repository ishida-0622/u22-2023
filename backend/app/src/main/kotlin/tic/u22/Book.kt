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

/**
 * u_id, b_idを受け取りゲームステータスの変更、ログの追加を行う
 * 
 * @param event Map<String, Any>?: "u_id": "u_id", "b_id": "b_id"
 * 
 * return String : {"response_status": "success", "result": {}}
 */
class FinishBook : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換

                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                val b_id = if (body["b_id"] != null) {body["b_id"]!! as String} else {throw Exception("b_id is null")}

                // DynamoDBのインスタンス化、テーブル名の設定
                val dynamo = Dynamo(Settings().AWS_REGION)
                val table_b_log = "b_log"
                val table_status = "status"

                val log = dynamo.searchByKey(table_b_log, listOf(u_id, b_id))
                val playTimes = if (log["play_times"] != null) {
                    (utils.toKotlinType(log["play_times"]!!) as String).toInt() + 1
                } else {
                    1
                }                
                val updated = dynamo.updateItem(table_status, listOf(u_id), mapOf("game_status" to 0)) // game_statusを0に変更
                val b_log = BookLog(
                    u_id = u_id,
                    b_id = b_id,
                    play_times = playTimes
                )
                // 初プレイ時にはログの追加それ以外はプレイ回数の増加
                if (playTimes == 1) { dynamo.addItem(table_b_log, b_log) }
                else { dynamo.updateItem(table_b_log, listOf(u_id, b_id), mapOf("play_times" to playTimes)) }

                if(updated == "DONE"){
                    val dummyMap: Map<String, String> = mapOf()
                    mapOf("response_status" to "success", "result" to dummyMap)
                } else {
                    throw Exception("failed to update game status or failed to update log")
                }
            }
            catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)
    }
}
