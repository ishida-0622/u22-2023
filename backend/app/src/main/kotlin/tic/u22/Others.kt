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
 * u_idを受け取ってログインログを返す
 *
 * @param event Map<String, Any>?: Lambda関数に渡される引数
 * @param context Context?: Context

 * return String : "result": {"datatime": "hoge","u_id":"hoge"}
 */
class ScanL_log : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        // 非同期処理開始
        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換
                val u_id = if(body["u_id"] != null) {body["u_id"]!! as String } else {throw Exception("u_id is null")}

                // DynamoDBのインスタンス化、テーブル名の設定
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "l_log"
                
                println("ログインログを検索")
                val result = dynamo.searchByAny(tableName, "u_id", u_id, "=")
                println("検索完了\n")

                // {"result": {結果の連想配列}}
                if (result.isNotEmpty()) {
                    mapOf(
                        "response_status" to "success",
                        "result" to result.map{
                            utils.toMap(utils.attributeValueToObject(it, tableName))
                })} else {
                    mapOf("response_status" to "fail",
                        "error" to "the value for this u_id does not exist"
                    )
                }
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)       // JSONに変換してフロントに渡す
    }
}