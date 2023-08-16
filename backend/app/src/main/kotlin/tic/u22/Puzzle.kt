package tic.u22

import aws.sdk.kotlin.services.lambda.*
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import aws.sdk.kotlin.services.dynamodb.model.*
import java.util.UUID
import kotlin.reflect.*
import kotlin.reflect.full.*
import kotlinx.coroutines.runBlocking
import java.time.LocalDateTime

import com.google.gson.Gson
import com.google.gson.JsonParser

/**
 * パズルを開始する
 */
class StartPuzzle : RequestHandler<Map<String, Any>, String> {
    val s3 = S3(Settings().AWS_REGION)
    val bucketName = Settings().AWS_BUCKET
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
                val result = dynamo.searchByKey("puzzle", listOf(p_id))
                if(result.isEmpty()){throw Exception("this p_id is not exist")}

                val updated = dynamo.updateItem("status", listOf(u_id), mapOf("game_status" to 1))
                if(updated != "DONE"){
                    throw Exception("failed to update game status: $updated")
                }
                val formattedResult = utils.toMap(utils.attributeValueToObject(result, "puzzle"))
                val res = mapOf(
                    "p_id" to formattedResult["p_id"],
                    "title" to formattedResult["title"],
                    "description" to formattedResult["description"],
                    "icon"  to s3.getObject(bucketName, formattedResult["icon"] as String),
                    "words" to (formattedResult["words"] as List<Map<String, Any>>).map{ word ->
                        mapOf(
                            "word" to word["word"],
                            "shadow" to s3.getObject(bucketName, word["shadow"] as String),
                            "illustration" to s3.getObject(bucketName, word["illustration"] as String),
                            "voice" to s3.getObject(bucketName, word["voice"] as String),
                            "is_displayed" to word["is_displayed"] as Boolean,
                            "is_dummy" to word["is_dummy"] as Boolean
                        )
                    },
                    "create_date" to formattedResult["create_date"],
                    "update_date" to formattedResult["update_date"],
                )

                mapOf(
                    "resposne_status" to "success",
                    "result" to res
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

/**
 * パズルをすべて取得する
 */
class GetPuzzles: RequestHandler<Map<String, Any>, String> {
    val s3 = S3(Settings().AWS_REGION)
    val bucketName = Settings().AWS_BUCKET
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
                val formattedResult = result.map{utils.toMap(utils.attributeValueToObject(it, "puzzle"))}
                val res = formattedResult.map{
                    mapOf(
                        "p_id" to it["p_id"],
                        "title" to it["title"],
                        "description" to it["description"],
                        "icon"  to s3.getObject(bucketName, it["icon"] as String),
                        "words" to (it["words"] as List<Map<String, Any>>).map{ word ->
                            mapOf(
                                "word" to word["word"],
                                "shadow" to s3.getObject(bucketName, word["shadow"] as String),
                                "illustration" to s3.getObject(bucketName, word["illustration"] as String),
                                "voice" to s3.getObject(bucketName, word["voice"] as String),
                                "is_displayed" to word["is_displayed"] as Boolean,
                                "is_dummy" to word["is_dummy"] as Boolean
                            )
                        },
                        "create_date" to it["create_date"],
                        "update_date" to it["update_date"],
                    )
                }
                mapOf(
                    "response_status" to "success",
                    "result" to res
                )
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }

        return gson.toJson(res)
    }
}

/**
 * パズルを登録する
 */
class RegisterPuzzle : RequestHandler<Map<String, Any>, String> {

    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換
                
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "puzzle"
                val s3 = S3(Settings().AWS_REGION)
                val bucketName = Settings().AWS_BUCKET

                val seq = dynamo.updateSequence(tableName)
                if (seq == -1) {throw Exception("p_id could not be updated.")}
                val id = "${seq}".padStart(4, '0')
                val title = if (body["title"] != null) {body["title"]!! as String} else {throw Exception("title is null")}
                val description = if (body["description"] != null) {body["description"]!! as String} else {throw Exception("description is null")}
                val icon = if (body["icon"] != null) {body["icon"]!! as String} else {throw Exception("icon is null")}
                val iconExtension = icon.split(";")[0].split("/")[1]
                s3.putObject(bucketName, "puzzle/p${id}/icon.${iconExtension}", icon, null)

                if (body["words"] == null) {throw Exception("words is null")}
                if (!(body["words"]!! is List<*>)) {throw Exception("words is not List")}
                val words = (body["words"] as List<Any>).map{
                    if(!(it is Map<*, *>)) {throw Exception("words is List, but not List<Map>")}
                    val item = it as Map<String, Any>
                    val word = if(item["word"] == null) {throw Exception("word in words is null")} else {item["word"] as String}
                    val shadow = if(item["shadow"] == null) {throw Exception("shadow in words is null")} else {item["shadow"] as String}
                    val illustration = if(item["illustration"] == null) {throw Exception("illustration in words is null")} else {item["illustration"] as String}
                    val voice = if(item["voice"] == null) {throw Exception("voice in words is null")} else {item["voice"] as String}
                    val is_displayed = if(item["is_displayed"] == null) {throw Exception("is_displayed in words is null")} else {item["is_displayed"] as Boolean}
                    val is_dummy = if(item["is_dummy"] == null) {throw Exception("is_dummy in words is null")} else {item["is_dummy"] as Boolean}
                    val shadowExtension = shadow.split(";")[0].split("/")[1]
                    val illustrationExtension = illustration.split(";")[0].split("/")[1]
                    // val voiceExtension = voice.split(";")[0].split("/")[1]
                    s3.putObject(bucketName, "puzzle/p${id}/${word}/shadow.${shadowExtension}", shadow, null)
                    s3.putObject(bucketName, "puzzle/p${id}/${word}/illustration.${illustrationExtension}", illustration, null)
                    s3.putObject(bucketName, "puzzle/p${id}/${word}/voice.mp3", voice, null)
                    Word(
                        word = word,
                        shadow = "puzzle/p${id}/${word}/shadow.${shadowExtension}",
                        illustration = "puzzle/p${id}/${word}/illustration.${illustrationExtension}",
                        voice = "puzzle/p${id}/${word}/voice.mp3",
                        is_displayed = is_displayed,
                        is_dummy = is_dummy
                    )
                }
                
                // Userデータクラスに以上のデータを渡し、user変数にインスタンス化して渡す
                val puzzle = Puzzle(
                    p_id = "p${id}",
                    title = title,
                    description = description,
                    icon = "puzzle/p${id}/icon.${iconExtension}",
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

/**
 * パズルを一時停止する
 * 
 * @param u_id String: u_id
 * @param p_id String: p_id
 * @param saved_data List<String>: パズル情報
 * 
 * return String: {"response_status": "success", "result": {}}
 */
class PausePuzzle : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}
                if (event["body"] == null) {throw Exception("body is null")}
                val body = utils.formatJsonEnv(event["body"]!!)
                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                val p_id = if (body["p_id"] != null) {body["p_id"]!! as String} else {throw Exception("p_id is null")}
                if (body["saved_data"] == null) {throw Exception("saved_data is null")}
                val saved_data = if (body["saved_data"]!! is List<*>) {body["saved_data"]!! as List<Any>} else {throw Exception("saved_data is not List")}
                

                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "status"

                val status_infos= listOf(p_id, saved_data)
                if (dynamo.searchByKey("puzzle", listOf(p_id)).isEmpty()) {throw Exception("p_id is not exist")}
                val updated = dynamo.updateItem(tableName, listOf(u_id), mapOf("game_status" to 2, "status_infos" to status_infos))

                if (updated == "DONE"){
                    val dummyMap: Map<String, String> = mapOf()
                    mapOf("response_status" to "success", "result" to dummyMap)
                } else {
                    throw Exception("failed to update status")
                }
            }
            catch (e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)
    }
}

/**
 * u_id, p_idを受け取りゲームステータスの変更、ログの追加を行う
 * 
 * @param event Map<String, Any>?: "u_id": "u_id", "p_id": "p_id"
 * 
 * return String : {"response_status": "success", "result": {}}
 */

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
                val table_p_log = "p_log"
                val table_status = "status"

                val playTimes: Int
                val log = dynamo.searchByKey(table_p_log, listOf(u_id, p_id))
                if (log["play_times"] != null) {
                    playTimes = (utils.toKotlinType(log["play_times"]!!) as String).toInt() + 1
                } else {
                    playTimes = 1
                }
                val updated = dynamo.updateItem(table_status, listOf(u_id), mapOf("game_status" to 0)) // game_statusを0に変更
                val p_log = PuzzleLog(
                    u_id = u_id,
                    p_id = p_id,
                    play_times = playTimes
                )
                // 初プレイ時にはログの追加それ以外はプレイ回数の増加
                if (playTimes == 1) { dynamo.addItem(table_p_log, p_log) }
                else { dynamo.updateItem(table_p_log, listOf(u_id, p_id), mapOf("play_times" to playTimes)) }

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

/**
 * パズルを削除する
 */
class DeletePuzzle: RequestHandler<Map<String, Any>, String> {
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

                val p_id = if (body["p_id"] != null) {body["p_id"]!! as String} else {throw Exception("p_id is null")}

                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "puzzle"

                val result = dynamo.deleteByKey(tableName, listOf(p_id))
                if(result != "DONE"){ throw Exception("$result") }
                val dummyMap: Map<String, String> = mapOf()
                mapOf("response_status" to "success",
                    "result" to dummyMap
                )
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }

        return gson.toJson(res)
    }
}


/**
 * パズルを編集する
 */
class UpdatePuzzle : RequestHandler<Map<String, Any>, String> {

    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換
                
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "puzzle"
                val s3 = S3(Settings().AWS_REGION)
                val bucketName = Settings().AWS_BUCKET

                val p_id = if (body["p_id"] != null) {body["p_id"]!! as String} else {throw Exception("p_id is null")}
                val result = dynamo.searchByKey("puzzle", listOf(p_id))
                val nowData = if(result.isEmpty()){throw Exception("this p_id does not exist")} else { utils.toMap(utils.attributeValueToObject(result, "puzzle")) }
                val title = if (body["title"] != null) {body["title"]!! as String} else {nowData["title"] as String}
                val description = if (body["description"] != null) {body["description"]!! as String} else {nowData["description"] as String}
                val icon = if (body["icon"] != null) {
                    val iconUri = body["icon"]!! as String
                    val iconExtension = iconUri.split(";")[0].split("/")[1]
                    s3.putObject(bucketName, "puzzle/${p_id}/icon.${iconExtension}", iconUri, null)
                    "puzzle/${p_id}/icon.${iconExtension}"
                } else {nowData["icon"] as String}
                val words = if (body["words"] == null) {
                    nowData["words"] as List<Map<String, Any>>
                } else if (!(body["words"]!! is List<*>)) {throw Exception("words is not List")} else {
                    (body["words"] as List<Any>).map{
                        if(!(it is Map<*, *>)) {throw Exception("words is List, but not List<Map>")}
                        val item = it as Map<String, Any>
                        val word = if(item["word"] == null) {throw Exception("word in words is null")} else {item["word"] as String}
                        val shadow = if(item["shadow"] == null) {throw Exception("shadow in words is null")} else {item["shadow"] as String}
                        val illustration = if(item["illustration"] == null) {throw Exception("illustration in words is null")} else {item["illustration"] as String}
                        val voice = if(item["voice"] == null) {throw Exception("voice in words is null")} else {item["voice"] as String}
                        val is_displayed = if(item["is_displayed"] == null) {throw Exception("is_displayed in words is null")} else {item["is_displayed"] as Boolean}
                        val is_dummy = if(item["is_dummy"] == null) {throw Exception("is_dummy in words is null")} else {item["is_dummy"] as Boolean}
                        val shadowExtension = shadow.split(";")[0].split("/")[1]
                        val illustrationExtension = illustration.split(";")[0].split("/")[1]
                        // val voiceExtension = voice.split(";")[0].split("/")[1]
                        s3.putObject(bucketName, "puzzle/${p_id}/${word}/shadow.${shadowExtension}", shadow, null)
                        s3.putObject(bucketName, "puzzle/${p_id}/${word}/illustration.${illustrationExtension}", illustration, null)
                        s3.putObject(bucketName, "puzzle/${p_id}/${word}/voice.mp3", voice, null)
                        mapOf(
                            word to word,
                            shadow to "puzzle/${p_id}/${word}/shadow.${shadowExtension}",
                            illustration to "puzzle/${p_id}/${word}/illustration.${illustrationExtension}",
                            voice to "puzzle/${p_id}/${word}/voice.mp3",
                            is_displayed to is_displayed,
                            is_dummy to is_dummy
                        )
                    }
                }
                
                // Userデータクラスに以上のデータを渡し、user変数にインスタンス化して渡す
                val newPuzzle = mapOf(
                    "title" to title,
                    "description" to description,
                    "icon" to icon,
                    "words" to words,
                    "update_date" to "${LocalDateTime.now()}"
                )

                val res = dynamo.updateItem(tableName, listOf(p_id), newPuzzle)
                if(res != "DONE"){ throw Exception(res) }
                val dummyMap: Map<String, String> = mapOf()
                mapOf("response_status" to "success", "result" to dummyMap)
            } catch (e:Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)       // JSONに変換してフロントに渡す
    }
}

/**
 * パズルを再開する
 * 
 * @param u_id String: u_id
 * 
 * return String: {"response_status": "success", "result": {"puzzle_info": パズル情報, "saved_data": 一時保存中のデータ}}
 */
class RestartPuzzle : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}
                if (event["body"] == null) {throw Exception("body is null")}
                val body = utils.formatJsonEnv(event["body"]!!)
                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}

                val dynamo = Dynamo(Settings().AWS_REGION)
                val table_status = "status"
                val table_puzzle = "puzzle"

                // ユーザーのステータスを取得
                val current_status = dynamo.searchByKey(table_status, listOf(u_id))
                if (!current_status.containsKey("u_id")) {throw Exception("this u_id does not exist")} 
                if (!current_status.containsKey("game_status")) {throw Exception("unexpected error: this u_id does not game_status")}

                // 現在のステータス判定
                if((utils.toKotlinType(current_status["game_status"]!!) as String).toInt() != 2) {
                    throw Exception("game status is not 2: now is ${(utils.toKotlinType(current_status["game_status"]!!) as String).toInt()}")
                }

                // ステータスの情報を取り出す
                val status_infos = if (current_status["status_infos"] != null ) {
                    utils.toKotlinType(current_status["status_infos"]!!) as List<String>
                } else {
                    throw Exception("status_infos is null")
                }
                val p_id = if (status_infos[0].isNotEmpty()) {status_infos[0]} else {throw Exception("p_id is null")}
                val status_info = status_infos[1] as Map<String, Any>
                val saved_data = if (status_info["saved_data"] != null) {status_info["saved_data"] as List<String>} else {throw Exception("saved_data is null")}

                // 本を取得
                val puzzle_info = dynamo.searchByKey(table_puzzle, listOf(p_id))
                if (puzzle_info.isEmpty()) {throw Exception("this puzzle is not exist")}

                // ステータスの更新
                val dummyList: List<String> = listOf()
                val updated = dynamo.updateItem(table_status, listOf(u_id), mapOf("game_status" to 1, "status_infos" to dummyList))
                if (updated != "DONE"){throw Exception("failed to update game status: $updated")}

                mapOf(
                    "response_status" to "success",
                    "result" to mapOf(
                        "puzzle_info" to utils.toMap(utils.attributeValueToObject(puzzle_info, table_puzzle)),
                        "saved_data" to saved_data
                    )
                )
            } catch (e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)
    }
}