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

class StartPuzzle : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        val res = runBlocking {
            try{
                if (event == null) {throw Exception("event is null")}
                if (event["body"] == null) {throw Exception("body is null")}
                val body = utils.formatJsonEnv(event["body"]!!)

                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                val p_id = if (body["p_id"] != null) {body["p_id"]!! as String} else {throw Exception("p_id is null")}

                // DynamoDBのインスタンス化、テーブル名の設定
                val dynamo = Dynamo(Settings().AWS_REGION)

                val status = dynamo.searchByKey("status", listOf(u_id))
                if (!status.containsKey("u_id")) {
                    throw Exception("this u_id does not exist")
                } else if (!status.containsKey("game_status")) {
                    throw Exception("unexpected error: this u_id does not game_status")
                }
                if((utils.toKotlinType(status["game_status"]!!) as String).toInt() != 0) {
                    throw Exception("game status is not 0: now is ${(utils.toKotlinType(status["game_status"]!!) as String).toInt()}")
                }

                val updated = dynamo.updateItem("status", listOf(u_id), mapOf("game_status" to 1))
                if(updated != "DONE"){
                    throw Exception("failed to update game status: $updated")
                }
                val result = dynamo.searchByKey("puzzle", listOf(p_id))

                mapOf(
                    "resposne_status" to "success",
                    "result" to utils.toMap(utils.attributeValueToObject(result, "puzzle"))
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


class GetPuzzles: RequestHandler<Map<String, Any>, String> {
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
                val tableName = "puzzle"

                val result = dynamo.scanAll(tableName)
                mapOf("response_status" to "success",
                    "result" to result.map{
                        utils.toMap(utils.attributeValueToObject(it, "puzzle"))
                    }
                )
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }

        return gson.toJson(res)
    }
}


class RegisterPuzzle : RequestHandler<Map<String, Any>, String> {

    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換
                
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "puzzle"

                val seq = dynamo.updateSequence(tableName)
                val id = "${seq}".padStart(4, '0')
                val title = if (body["title"] != null) {body["title"]!! as String} else {throw Exception("title is null")}
                val description = if (body["description"] != null) {body["description"]!! as String} else {throw Exception("description is null")}
                val icon = if (body["icon"] != null) {body["icon"]!! as String} else {throw Exception("icon is null")}
                val words = if (body["words"] != null) {body["words"]!! as List<List<String>>} else {throw Exception("words is null")}
                
                // Userデータクラスに以上のデータを渡し、user変数にインスタンス化して渡す
                val puzzle = Puzzle(
                    p_id = "p${id}",
                    title = title,
                    description = description,
                    icon = icon,
                    words = words
                )

                dynamo.addItem(tableName, puzzle)
                val dummyMap: Map<String, String> = mapOf()
                mapOf("response_status" to "success", "result" to dummyMap)
            } catch (e:Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)       // JSONに変換してフロントに渡す
    }
}

class FinishPuzzle : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換

                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                val p_id = if (body["p_id"] != null) {body["p_id"]!! as String} else {throw Exception("p_id is null")}

                // DynamoDBのインスタンス化、テーブル名の設定
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "puzzle"

                var playTimes: Int
                val log = dynamo.searchByKey("puzzle", listOf(p_id))
                if (log["play_times"] != null) {
                    playTimes = (utils.toKotlinType(log["play_times"]!!) as String).toInt()
                } else {
                    throw Exception("puzzle play_times is null")
                }
                val updated = dynamo.updateItem(tableName, listOf(u_id), mapOf("game_status" to 0)) // game_statusを0に変更
                val p_log = PuzzleLog(
                    u_id = u_id,
                    p_id = p_id,
                    play_times = playTimes + 1
                )
                dynamo.addItem("puzzle_log", p_log)

                if(updated != "DONE"){
                    throw Exception("failed to update game status: $updated")
                } else {
                    mapOf("response_status" to "success")
                }
            }
            catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)
    }
}