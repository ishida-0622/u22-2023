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
 * 本をすべて取得する
 */
class GetBooks: RequestHandler<Map<String, Any>, String> {
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
                val tableName = "book"

                val result = dynamo.scanAll(tableName)
                val formattedResult = result.map{utils.toMap(utils.attributeValueToObject(it, "book"))}
                val res = formattedResult.map{ b ->
                    mapOf(
                        "b_id" to b["b_id"],
                        "title_jp" to b["title_jp"],
                        "title_en" to b["title_en"],
                        "summary" to b["summary"],
                        "author" to b["author"],
                        "pdf" to s3.getObject(bucketName, b["pdf"] as String),
                        "thumbnail"  to s3.getObject(bucketName, b["thumbnail"] as String),
                        "voice" to (b["voice_keys"] as List<String>).map{
                            s3.getObject(bucketName, it)
                        },
                        "create_date" to b["create_date"],
                        "update_date" to b["update_date"],
                    )
                }

                mapOf(
                    "resposne_status" to "success",
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
 * 本を削除する
 */
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
    val s3 = S3(Settings().AWS_REGION)
    val bucketName = Settings().AWS_BUCKET
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
                val formattedResult = utils.toMap(utils.attributeValueToObject(result, "book"))
                val res = mapOf(
                    "b_id" to formattedResult["b_id"],
                    "title_jp" to formattedResult["title_jp"],
                    "title_en" to formattedResult["title_en"],
                    "summary" to formattedResult["summary"],
                    "author" to formattedResult["author"],
                    "thumbnail"  to s3.getObject(bucketName, formattedResult["thumbnail"] as String),
                    "pdf" to s3.getObject(bucketName, formattedResult["pdf"] as String),
                    "voice" to (formattedResult["voice_keys"] as List<String>).map{
                        s3.getObject(bucketName, it)
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
        return gson.toJson(res)
    }
}

 /**
 * 本を登録する
 */
class RegisterBook : RequestHandler<Map<String, Any>, String> {
    val s3 = S3(Settings().AWS_REGION)
    val bucketName = Settings().AWS_BUCKET

    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換
                
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "book"

                val seq = dynamo.updateSequence(tableName)
                if (seq == -1) {throw Exception("b_id could not be updated.")}
                val id = "${seq}".padStart(4, '0')
                val title_jp = if (body["title_jp"] != null) {body["title_jp"]!! as String} else {throw Exception("title_jp is null")}
                val title_en = if (body["title_en"] != null) {body["title_en"]!! as String} else {throw Exception("title_en is null")}
                val summary = if (body["summary"] != null) {body["summary"]!! as String} else {throw Exception("summary is null")}
                val author = if (body["author"] != null) {body["author"]!! as String} else {throw Exception("author is null")}
                val thumbnail = if (body["thumbnail"] != null) {body["thumbnail"]!! as String} else {throw Exception("thumbnail is null")}
                val pdf = if (body["pdf"] != null) {body["pdf"]!! as String} else {throw Exception("pdf is null")}
                val voices = if (body["voice"] != null && body["voice"]!! is List<Any?>) {body["voice"]!! as List<String>} else if (body["voice"] == null) {throw Exception("voice is null")} else {throw Exception("voice is not List")}

                val thumbnailExtension = thumbnail.split(";")[0].split("/")[1]
                s3.putObject(bucketName, "book/b${id}/thumbnail.${thumbnailExtension}", thumbnail, null)
                val pdfExtension = pdf.split(";")[0].split("/")[1]
                s3.putObject(bucketName, "book/b${id}/pdf.${pdfExtension}", pdf, null)
                val voice_keys = voices.mapIndexed {  index, voice ->
                    s3.putObject(bucketName, "book/b${id}/voice/${index + 1}.mp3", voice, null)
                    "book/b${id}/voice/${index + 1}.mp3"
                }

                // Userデータクラスに以上のデータを渡し、user変数にインスタンス化して渡す
                val book = Book(
                    b_id = "b${id}",
                    title_jp = title_jp,
                    title_en = title_en,
                    summary = summary,
                    author = author,
                    thumbnail = "book/b${id}/thumbnail.${thumbnailExtension}",
                    pdf = "book/b${id}/pdf.${pdfExtension}",
                    voice_keys = voice_keys,
                )

                dynamo.addItem(tableName, book)
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
 * 読み聞かせを一時停止する
 * 
 * @param u_id String: u_id
 * @param b_id String: b_id
 * @param saved_data String: ページ番号
 * 
 * return String: {"response_status": "success", "result": {}}
 */
class PauseBook : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}
                if (event["body"] == null) {throw Exception("body is null")}
                val body = utils.formatJsonEnv(event["body"]!!)
                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                val b_id = if (body["b_id"] != null) {body["b_id"]!! as String} else {throw Exception("b_id is null")}
                val saved_data = if (body["saved_data"] != null) {body["saved_data"]!! as String} else {throw Exception("saved_data is null")}

                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "status"

                if (dynamo.searchByKey("book", listOf(b_id)).isEmpty()) {throw Exception("b_id is not exist")}
                val updated = dynamo.updateItem(tableName, listOf(u_id), mapOf("game_status" to 4, "status_infos" to listOf(b_id, saved_data)))

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