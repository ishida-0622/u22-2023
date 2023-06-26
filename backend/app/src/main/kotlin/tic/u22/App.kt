package tic.u22

import aws.sdk.kotlin.services.dynamodb.*
import aws.sdk.kotlin.services.dynamodb.endpoints.*
import aws.sdk.kotlin.services.dynamodb.model.*
import aws.sdk.kotlin.services.dynamodb.paginators.*
import aws.sdk.kotlin.services.dynamodb.waiters.*
import aws.sdk.kotlin.services.lambda.*
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import java.util.UUID
import kotlin.reflect.*
import kotlin.reflect.full.*
import kotlinx.coroutines.runBlocking

import com.google.gson.Gson
import com.google.gson.JsonParser

// val TABLE_NAME = "<使用するリージョン>"
val REGION = "us-east-1"
// val TABLE_NAME = "<使用するテーブル名>"
val TABLE_NAME = "register_user_test"
// utilsのインスタンス化
val utils = Utils()

// データベースに登録する情報
data class User(
    val u_id: String,
    val family_name: String,
    val last_name: String,
    val famiy_name_roma: String,
    val last_name_roma: String,
    val email: String,
    val password: String,
    val child_lock: String,
    val account_name: String,
    val limit_time: Int = 1440,
    val delete_flg: Boolean = false
)

// 解析したJSONを保持するデータクラス
data class FormValues(
    val familyname: String = "",
    val firstname: String = "",
    val familynameEng: String = "",
    val firstnameEng: String = "",
    val username: String = "",
    val email: String = "",
    val password: String = "",
    val passwordConfirm: String = "",
    val child: String = "",
    val childConfirm: String = "",
    val consent: Boolean = false
)

// レスポンス
data class ApiGatewayResponse(
    val statusCode: Int,
    val body: User,
    val headers: Map<String, String> = mapOf("Content-Type" to "application/json"),
    val isBase64Encoded: Boolean = false
)

class App : RequestHandler<Map<String, Any>, ApiGatewayResponse> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): ApiGatewayResponse = runBlocking {
        // eventが正しく送られてきているかを確認
        if (event == null) throw Exception("eventが空です")

        // JSONを解析する
        val body = event["body"] as String
        val jsonElement = JsonParser.parseString(body)
        val formValuesJson = jsonElement.asJsonObject["formValues"]
        val gson = Gson()
        val formValues = gson.fromJson(formValuesJson, FormValues::class.java)

        // ユーザーの情報を設定
        val id = UUID.randomUUID().toString()
        val familyname = if(formValues.familyname.isNotEmpty()) formValues.familyname else throw Exception("familynameが空です")
        val firstname = if(formValues.firstname.isNotEmpty()) formValues.firstname else throw Exception("firstnameが空です")
        val familynameEng = if(formValues.familynameEng.isNotEmpty()) formValues.familynameEng else throw Exception("familynameEngが空です")
        val firstnameEng = if(formValues.firstnameEng.isNotEmpty()) formValues.firstnameEng else throw Exception("firstnameEngが空です")
        val username = if(formValues.username.isNotEmpty()) formValues.username else throw Exception("usernameが空です")
        val email = if(formValues.email.isNotEmpty()) formValues.email else throw Exception("emailが空です")
        val password = if(formValues.password.isNotEmpty()) formValues.password else throw Exception("passwordが空です")
        val child = if(formValues.child.isNotEmpty()) formValues.child else throw Exception("childが空です")
        val user = User(u_id=id, family_name=familyname, last_name=firstname, famiy_name_roma=familynameEng, last_name_roma=firstnameEng, email=email, password=password, child_lock=child, account_name=username)
        // テーブルに登録する
        try{
            addUser(user)
        } catch (e: Exception) {
            throw e
        }
        return@runBlocking ApiGatewayResponse(200, user)
    }

    suspend fun addUser(user: User): PutItemResponse {
        // 型変換
        val itemValues = utils.toAttributeValueMap(utils.toMap(user))
        // テーブル名とitemを指定
        val req =
            PutItemRequest {
                tableName = TABLE_NAME
                item = itemValues
            }
        DynamoDbClient { region = REGION }.use { ddb ->
            val response = ddb.putItem(req)
            return response
        }
    }
}

fun main() {
    // handlerを起動
    val app = App()
    app.handleRequest(null, null)
}