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
            try {
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
                val dummyMap: Map<String, String> = mapOf()
                if(result == "DONE"){mapOf("response_status" to "success", "result" to (dummyMap))}else{mapOf("response_status" to "fail", "error" to "$result")}
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }

        return gson.toJson(res)
    }
}

/**
 * ユーザー情報を変更する
 */
class UpdateUser : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換

                // 以下nullチェックを行いながら、値をStringとして受け取って変数に代入する
                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                val updateInfos: MutableMap<String, String> = mutableMapOf()
                if (body["family_name"] != null) {updateInfos["family_name"] = (body["family_name"]!! as String)}
                if (body["first_name"] != null) {updateInfos["first_name"] = (body["first_name"]!! as String)}
                if (body["family_name_roma"] != null) {updateInfos["family_name_roma"] = (body["family_name_roma"]!! as String)}
                if (body["first_name_roma"] != null) {updateInfos["first_name_roma"] = (body["first_name_roma"]!! as String)}
                if (body["child_lock"] != null) {updateInfos["child_lock"] = (body["child_lock"]!! as String)}
                if (body["account_name"] != null) {updateInfos["account_name"] = (body["account_name"]!! as String)}
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "user"
                println(dynamo.searchByKey(tableName, listOf(u_id)))
                val result = dynamo.updateItem(tableName, listOf(u_id), updateInfos)
                println(dynamo.searchByKey(tableName, listOf(u_id)))
                val dummyMap: Map<String, String> = mapOf()
                
                if (result == "DONE") {
                    mapOf(
                        "response_status" to "success",
                        "result" to dummyMap
                    )
                } else {throw Exception("$result")}
            } catch(e: Exception) {
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
 * ユーザー情報を登録する(アプリケーションで使用するデータの登録)
 */
class SignUp : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{

        val res = runBlocking {
            try {
                if (event == null) {throw Exception("event is null")}           // event引数のnullチェック
                if (event["body"] == null) {throw Exception("body is null")}    // bodyのnullチェック
                val body = utils.formatJsonEnv(event["body"]!!)                 // bodyをMapオブジェクトに変換

                // 以下nullチェックを行いながら、値をStringとして受け取って変数に代入する
                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                if (body["family_name"] == null) { throw Exception("family_name is null") }
                if (body["first_name"] == null) { throw Exception("first_name is null") }
                if (body["family_name_roma"] == null) { throw Exception("family_name_roma is null") }
                if (body["first_name_roma"] == null) { throw Exception("first_name_roma is null") }
                if (body["child_lock"] == null) { throw Exception("child_lock is null") }
                if (body["account_name"] == null) { throw Exception("account_name is null") }
                val dynamo = Dynamo(Settings().AWS_REGION)
                val tableName = "user"
                val user = User(
                    u_id = u_id,
                    family_name = body["family_name"] as String,
                    first_name = body["first_name"] as String,
                    family_name_roma = body["family_name_roma"] as String,
                    first_name_roma = body["first_name_roma"] as String,
                    child_lock = body["child_lock"] as String,
                    account_name = body["account_name"] as String
                )

                if (!dynamo.addItem(tableName, user)){ throw Exception("Failed to add user") }
                val dummyMap: Map<String, String> = mapOf()

                mapOf(
                    "response_status" to "success",
                    "result" to dummyMap
                )
            } catch(e: Exception) {
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
 * ログインする(ログインログの追加)
 */
class Login: RequestHandler<Map<String, Any>, String> {
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
                val u_id = if (body["u_id"] != null) {body["u_id"]!! as String} else {throw Exception("u_id is null")}
                val log = LoginLog(
                    u_id = u_id
                )

                // ユーザーの退会処理
                val dynamo = Dynamo(Settings().AWS_REGION)
                dynamo.addItem("l_log", log)
                val dummyMap: Map<String, String> = mapOf()
                mapOf("response_status" to "success", "result" to dummyMap)
            } catch(e: Exception) {
                mapOf("response_status" to "fail", "error" to "$e")
            }
        }
        return gson.toJson(res)
    }
}