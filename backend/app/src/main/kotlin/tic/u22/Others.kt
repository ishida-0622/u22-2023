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
import java.time.LocalDate
import java.time.format.DateTimeFormatter


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
                if(result.isEmpty()){
                    throw Exception("the value for this u_id is not exist")
                }
                mapOf(
                    "response_status" to "success",
                    "result" to result.map{
                        utils.toMap(utils.attributeValueToObject(it, tableName))
                    })
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)       // JSONに変換してフロントに渡す
    }
}

/**
 * 1つのIDを受け取りユーザーの情報を取得する(IDが存在しない場合はfailを返す)
 *
 * @param event Map<String, Any>?: u_id:u_id
 * @param context Context?: Context
 *
 * return String: "result": {"u_id": "u_id", "family_name": "family_name", "first_name": "first_name", "child_lock": "child_lock", "account_name": "account_name"}
 */
class ScanUser : RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
    val res = runBlocking {
      try {
        val dynamo = Dynamo(Settings().AWS_REGION)
        val tableName = "user"

        if (event == null) {throw Exception("event is null")}
        if (event["body"] == null) {throw Exception("body is null")}
        val body = utils.formatJsonEnv(event["body"]!!)
        val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}

        // 検索
        val user = dynamo.searchByKey(tableName, listOf(u_id))
        if(user.isEmpty()) { throw Exception("this u_id does not exist") }
        mapOf("response_status" to "success",
          "result" to utils.toMap(utils.attributeValueToObject(user, "user")))
      } catch(e: Exception){
        mapOf("response_status" to "fail", "error" to "$e")
      }
    }
    return gson.toJson(res)
  }
}

/**
 * 任意の個数のIDを受け取りユーザーの情報を取得する
 *
 * @param event Map<String, Any>?: u_id:[value1, value2, ...]
 * @param context Context?: Context
 *
 * return String: "result": {["u_id": "u_id", "family_name": "family_name", "first_name": "first_name", "email": "email", "password": "password", "child_lock": "child_lock", "account_name": "account_name"],[...]}
 */
class ScanUsers : RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
    val res = runBlocking {
      try {
        val dynamo = Dynamo(Settings().AWS_REGION)
        val tableName = "user"

        if (event == null) {throw Exception("event is null")}
        if (event["body"] == null) {throw Exception("body is null")}
        val body = utils.formatJsonEnv(event["body"]!!)
        val u_id: List<String> = if (body["u_id"] != null) {body["u_id"]!! as List<String>} else {throw Exception("body[u_id] is null")}

        // 検索
        val users = dynamo.searchByKeys(tableName, u_id.map { listOf(it) })
        mapOf("response_status" to "success",
          "result" to users.map{
          utils.toMap(utils.attributeValueToObject(it, "user"))
        })
      } catch(e: Exception){
        mapOf("response_status" to "fail", "error" to "$e")
      }
    }
    return gson.toJson(res)
  }
}

class ScanP_log: RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
      val res = runBlocking {
          try {
            if (event == null) {throw Exception("event is null")}
            if (event["body"] == null) {throw Exception("body is null")}
            val body = utils.formatJsonEnv(event["body"]!!)
            val u_id: String = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("body[u_id] is null")}

              // プレイ履歴の取得
              val dynamo = Dynamo(Settings().AWS_REGION)
              val tableName = "p_log"
              
              val result = dynamo.searchByAny(tableName, "u_id", u_id, "=")
              mapOf("response_status" to "success", 
              "result" to result.map{
                utils.toMap(utils.attributeValueToObject(it, tableName))
              })
          } catch(e: Exception) {
              mapOf("response_status" to "fail", "error" to "$e")
          }
      }

      return gson.toJson(res)
  }
}

class ScanB_log: RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
      val res = runBlocking {
          try {
            if (event == null) {throw Exception("event is null")}
            if (event["body"] == null) {throw Exception("body is null")}
            val body = utils.formatJsonEnv(event["body"]!!)
            val u_id: String = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("body[u_id] is null")}

              // 本の履歴の取得
              val dynamo = Dynamo(Settings().AWS_REGION)
              val tableName = "b_log"
              
              val result = dynamo.searchByAny(tableName, "u_id", u_id, "=")
              mapOf("response_status" to "success",
              "result" to result.map{
                utils.toMap(utils.attributeValueToObject(it, tableName))
              })
          } catch(e: Exception) {
              mapOf("response_status" to "fail", "error" to "$e")
          }
      }
      return gson.toJson(res)
  }
}

/**
 * u_idを受け取り、ユーザーの情報を取得する
 *
 * @param event Map<String, Any>?: u_id:"value"
 * @param context Context?: Context
 *
 * return String : "result": {"game_status: value","result": [value,...] "u_id": u_id}
 */
class ScanStatus : RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
    val res = runBlocking {
      try {
        val dynamo = Dynamo(Settings().AWS_REGION)
        val tableName = "status"

        if (event == null) {throw Exception("event is null")}
        if (event["body"] == null) {throw Exception("body is null")}
        val body = utils.formatJsonEnv(event["body"]!!)
        val u_id: String = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("body[u_id] is null")}

        val userStatus = dynamo.searchByKey(tableName, listOf(u_id))
        if (userStatus.isNotEmpty()) {
          mapOf("response_status" to "success",
            "result" to utils.toMap(utils.attributeValueToObject(userStatus, tableName)))
        } else {
          mapOf("response_status" to "fail", "error" to "the value for this u_id does not exist")
        }
      } catch(e: Exception){
        mapOf("response_status" to "fail", "error" to "$e")
      }
    }
    return gson.toJson(res)
  }
}

/**
 * u_id, game_statusを受け取り、ステータスを更新する
 *
 * @param u_id String : u_id
 * @param game_status Int : 0 ~ 4
 *
 * return String : {"response_status": "success", "result": {}}
 */
class SetStatus : RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
    val res = runBlocking {
      try {
        if (event == null) {throw Exception("event is null")}
        if (event["body"] == null) {throw Exception("body is null")}
        val body = utils.formatJsonEnv(event["body"]!!)
        val u_id: String = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
        val game_status = if (body["game_status"] != null) {body["game_status"]!! as Int} else {throw Exception("game_status is null")}
        if (game_status < 0 || game_status > 4) {throw Exception("game_status is out of range")}

        val dynamo = Dynamo(Settings().AWS_REGION)
        val tableName = "status"

        val updated = dynamo.updateItem(tableName, listOf(u_id), mapOf("game_status" to game_status))
        if (updated == "DONE"){
          val dummyMap: Map<String, String> = mapOf()
          mapOf("response_status" to "success", "result" to dummyMap)
        } else {
          mapOf("response_status" to "fail", "error" to "failed to update game status: $updated")
        }
      }
      catch(e: Exception){
        mapOf("response_status" to "fail", "error" to "$e")
      }
    }
    return gson.toJson(res)
  }
}

/**
 * ユーザーの指定期間のログイン履歴を取得する
 * 
 * @param u_id String : u_id
 * @param start_date String : 日付
 * @param end_date String : 日付
 * 
 * return "result": [{"u_id": u_id,"date": date},{...}]
 */
class ScanLoginDates : RequestHandler<Map<String, Any>, String> {
  override fun handleRequest(event: Map<String, Any>?, context: Context?): String {
    val res = runBlocking {
      try {
        if (event == null) {throw Exception("event is null")}
        if (event["body"] == null) {throw Exception("body is null")}
        val body = utils.formatJsonEnv(event["body"]!!)
        val u_id: String = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
        val start_date: String = if (body["start_date"] != null) {body["start_date"]!! as String} else {throw Exception("start_date is null")}
        val end_date: String = if (body["end_date"] != null) {body["end_date"]!! as String} else {throw Exception("end_date is null")}

        val dynamo = Dynamo(Settings().AWS_REGION)
        val tableName = "l_log"

        // 全期間のログイン履歴
        val user_login_logs = dynamo.searchByAny(tableName, "u_id", u_id, "=").map {
          utils.toMap(utils.attributeValueToObject(it, tableName))
        }

        // yyyy-MM-ddからyyyyMMddにフォーマットする
        val dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd")
        val start = LocalDate.parse(start_date, dateFormatter)
        val end = LocalDate.parse(end_date, dateFormatter)

        // 指定期間のログイン履歴にフィルターする
        // 開始日と終了日を含む
        val filtered_logs = user_login_logs.filter {
          val datetime = it["datetime"] as String
          val date = LocalDate.parse(datetime.substring(0, 10))
          date.isAfter(start.minusDays(1)) && date.isBefore(end.plusDays(1))
        }

        mapOf("response_status" to "success",
          "result" to filtered_logs)
      }
      catch(e: Exception){
        mapOf("response_status" to "fail", "error" to "$e")
      }
    }
    return gson.toJson(res)
  }
}