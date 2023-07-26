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
 * 全てのお知らせを返す
 *
 * @param event Map<String, Any>? : null
 * @param context Context? : null
 *
 * return String : "result": [{"n_id":"n_id", "title":"title", "content":"content", "create_date":"create_date"}]
 */
class GetNotices : RequestHandler<Map<String, Any>, String> {
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
          throw Exception("Failed to retrieve notices")
        }
      } catch(e: Exception){
        mapOf("response_status" to "fail", "error" to "$e")
      }
    }
    return gson.toJson(res)
  }
}

/**
 * お知らせを登録する
 */
class RegisterNotice : RequestHandler<Map<String, Any>, String> {

    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換
                
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "notice"

                val seq = dynamo.updateSequence(tableName)
                if (seq == -1) {throw Exception("n_id could not be updated.")}
                val id = "${seq}".padStart(4, '0')
                val title = if (body["title"] != null) {body["title"]!! as String} else {throw Exception("title is null")}
                val content = if (body["content"] != null) {body["content"]!! as String} else {throw Exception("content is null")}
                
                // Userデータクラスに以上のデータを渡し、user変数にインスタンス化して渡す
                val notice = Notice(
                    n_id = "n${id}",
                    title = title,
                    content = content
                )

                dynamo.addItem(tableName, notice)
                val dummyMap: Map<String, String> = mapOf()
                mapOf("response_status" to "success", "result" to dummyMap)
            } catch (e:Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)       // JSONに変換してフロントに渡す
    }
}