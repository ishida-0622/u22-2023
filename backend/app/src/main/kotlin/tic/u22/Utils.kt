package tic.u22

import aws.sdk.kotlin.services.dynamodb.*
import aws.sdk.kotlin.services.dynamodb.endpoints.*
import aws.sdk.kotlin.services.dynamodb.model.*
import aws.sdk.kotlin.services.dynamodb.paginators.*
import aws.sdk.kotlin.services.dynamodb.waiters.*
import aws.sdk.kotlin.services.lambda.*
import kotlin.reflect.*
import kotlin.reflect.full.*
import java.time.LocalDateTime

class Utils {
  /**
   * objectをMapに変換する
   *
   * User("1", "ken", 20) の場合は
   *
   * { id: "1", name: "ken", age: 20 } に変換される
   *
   * @param obj 変換したいオブジェクト
   *
   * @return 変換されたMap
   */
  fun <T : Any> toMap(obj: T): Map<String, Any?> {
    return (obj::class as KClass<T>).memberProperties.associate { prop ->
      prop.name to
          prop.get(obj)?.let { value ->
            if (value::class.isData) {
              toMap(value)
            } else {
              value
            }
          }
    }
  }

  /**
   * ListをAttributeValue.L型に変換する
   *
   * @param lst 変換したいList
   *
   * @return 変換されたList
   */
  fun toAttributeValueList(lst: List<Any?>): AttributeValue.L {
    val res = lst.map{
      if(it is AttributeValue) {it} else {toAttributeValue(it)}
    }
    return AttributeValue.L(res)
  }

  /**
   * valueをAttributeValue型に変換する
   *
   * @param value 変換したい値
   *
   * @return 変換された値
   */
  fun toAttributeValue(value: Any?): AttributeValue {
    return when (value) {
      is String -> AttributeValue.S(value)
      is Int, is Long -> AttributeValue.N(value.toString())
      is Boolean -> AttributeValue.Bool(value)
      null -> AttributeValue.Null(true)
      is ByteArray -> AttributeValue.B(value)
      is List<Any?> -> toAttributeValueList(value)
      else -> AttributeValue.S(value as String)
    }
  }

  /**
   * MapのvalueをAttributeValue型に変換する
   *
   * @param mp 変換したいMap
   *
   * @return 変換されたMap
   */
  fun toAttributeValueMap(mp: Map<String, Any?>): Map<String, AttributeValue> {
    return mp.map {
      it.key to toAttributeValue(it.value)
    }.toMap()
  }
}

class Dynamo(val REGION: String){
  val utils = Utils()
  suspend fun add(usedTableName: String, data: TableBase) {
    // 型変換
    val itemValues = utils.toAttributeValueMap(utils.toMap(data))
    // テーブル名とitemを指定
    val req = PutItemRequest {
      tableName = usedTableName
      item = itemValues
    }
    // 追加
    DynamoDbClient { region = REGION }.use { ddb -> ddb.putItem(req) }
  }

  suspend fun scanAll(usedTableName: String): List<Map<String, AttributeValue>> {
    DynamoDbClient { region = REGION }.use { ddb ->
      // テーブル名を指定
      val request = ScanRequest { tableName = usedTableName }
      // 全件取得
      val response = ddb.scan(request)
      // 取得結果を出力
      if (response.items == null) {
        return listOf(mapOf())
      }
      return response.items!!.map { item ->
        item.map { mp ->
          mp.key to mp.value
        }.toMap()
      }
    }
  }

  suspend fun searchByKey(usedTableName: String, keyName: String, keyVal: String): Map<String, AttributeValue> {
    // keyValとnameをMapにセット
    val keys = mutableMapOf<String, Any>()
    keys[keyName] = keyVal

    val keyToGet = utils.toAttributeValueMap(keys)
    // テーブル名とキーを設定
    val req = GetItemRequest {
      key = keyToGet
      tableName = usedTableName
    }

    DynamoDbClient { region = REGION }.use { ddb ->
      // 取得
      val response = ddb.getItem(req)
      // 取得結果を出力
      if (response.item == null) {
        return mapOf()
      }
      return response.item!!.map { mp ->
        mp.key to mp.value
      }.toMap()
    }
  }
  
  suspend fun searchByAny(usedTableName: String, column: String, value: Any, condition: String): List<Map<String, AttributeValue>> {
    DynamoDbClient { region = REGION }.use { ddb ->
      // テーブル名, 検索条件を指定
      val query = ScanRequest {
        tableName = usedTableName
        // 条件式を記述: prepared statement
        filterExpression = "${column} ${condition} :value"
        // :valueの値をセット
        expressionAttributeValues = utils.toAttributeValueMap(mapOf(":value" to value))
      }
      // 取得
      val response = ddb.scan(query)
      // 取得結果を出力
      if (response.items == null) {
        return listOf(mapOf())
      }
      return response.items!!.map { item ->
        item.map { mp ->
          mp.key to mp.value
        }.toMap()
      }
    }
  }

  suspend fun deleteByKey(usedTableName: String, keyName: String, keyVal: String): Unit {
    val keyToGet = mutableMapOf<String, AttributeValue>()
    keyToGet[keyName] = AttributeValue.S(keyVal)

    val request = DeleteItemRequest {
        tableName = usedTableName
        key = keyToGet
    }

    DynamoDbClient { region = REGION }.use { ddb ->
        ddb.deleteItem(request)
        return
    }
  }

  suspend fun updateItem(usedTableName: String, keyName: String, keyVal: String, updateColumn: String, updateVal: Any): Unit {
    val itemKey = mutableMapOf<String, AttributeValue>()
    itemKey[keyName] = AttributeValue.S(keyVal)

    val updatedValues = mutableMapOf<String, AttributeValueUpdate>()
    updatedValues[updateColumn] = AttributeValueUpdate {
        value = utils.toAttributeValue(updateVal)
        action = AttributeAction.Put
    }

    val request = UpdateItemRequest {
        tableName = usedTableName
        key = itemKey
        attributeUpdates = updatedValues
    }

    DynamoDbClient { region = REGION }.use { ddb ->
        ddb.updateItem(request)
        return
    }
  }
}

class Settings {
    val AWS_REGION = "us-east-1"
    val AWS_BUCKET = "sample"
}


interface TableBase {}

/**
 * Userデータクラス(テーブル:user)
 *
 * @param u_id: String ユーザーのID
 * @param family_name: String 姓名
 * @param first_name: String 名前
 * @param family_name_roma: String ローマ字姓名
 * @param first_name_roma: String ローマ字名前
 * @param email: String メールアドレス
 * @param password: String パスワード
 * @param child_lock: String チャイルドロックパスコード
 * @param account_name: String アカウント名
 * @param limit_time: Int 使用制限時間(default:1440-設定不要)
 * @param delete_flg: Boolean 退会フラグ(default:false-設定不要)
 */
data class User(
    val u_id: String,
    val family_name: String,
    val first_name: String,
    val family_name_roma: String,
    val first_name_roma: String,
    val email: String,
    val password: String,
    val child_lock: String,
    val account_name: String,
    val limit_time: Int = 1440,
    val delete_flg: Boolean = false
): TableBase

/**
 * Puzzleデータクラス(テーブル:puzzle)
 * Listの部分は、mutableListOf()を使用すること
 *
 * @param p_id: String パズルのID(^p[0-9]{4}$)
 * @param title: String タイトル
 * @param description: String 概要
 * @param icon: String アイコン(default有-設定不要)
 * @param words: List<List<String>> 単語(正解順に格納・[[単語, 形状のS3キー, 音声のS3キー]*単語数])([ [word, ${Settings().AWS_BUCKET}/puzzle/shape/<ファイル名>, ${Settings().AWS_BUCKET}/puzzle/voice/<ファイル名>], ])
 * @param illust_keys: List<List<String>> 特定の語順で出すイラスト([ [1, 0, 2, ${Settings().AWS_BUCKET}/puzzle/${title}/photo/<ファイル名>],])
 * @param create_date: String 作成日時(default:NOW()-設定不要)
 * @param update_date: String 更新日時(default:NOW()-設定不要)
 */
data class Puzzle(
    val p_id: String = "p0000",
    val title: String,
    val description: String,
    val icon: String = "${Settings().AWS_BUCKET}/puzzle/${p_id}/photo/icon.png",
    val words: List<List<String>>,
    val illust_keys: List<List<String>>,
    val create_date: String = "${LocalDateTime.now()}",
    val update_date: String = create_date
): TableBase

/**
 * Bookデータクラス(テーブル:book)
 * Listの部分は、mutableListOf()を使用すること
 *
 * @param b_id: String 本のID(^b[0-9]{4}$)
 * @param title_jp: String 日本語タイトル
 * @param title_en: String 英語タイトル
 * @param summary: String あらすじ
 * @param author: String 著者
 * @param thumbnail: String サムネイルのS3キー(default有-設定不要(デフォルトではpng))
 * @param pdf: String PDFのS3キー(default有-設定不要)
 * @param voice_keys: List<String> 音声のS3キー(ページ順)
 * @param create_date: String 作成日時(default:NOW()-設定不要)
 * @param update_date: String 更新日時(default:NOW()-設定不要)
 */
data class Book(
    val b_id: String = "b0000",
    val title_jp: String,
    val title_en: String,
    val summary: String,
    val author: String,
    val thumbnail: String = "${Settings().AWS_BUCKET}/book/${b_id}.png",
    val pdf: String = "${Settings().AWS_BUCKET}/book/${b_id}.pdf",
    val voice_keys: List<String>,
    val create_date: String = "${LocalDateTime.now()}",
    val update_date: String = create_date
): TableBase

/**
 * Noticeデータクラス(テーブル:notice)
 *
 * @param n_id: String お知らせのID(^b[0-9]{4}$)
 * @param title: String タイトル
 * @param content: String 内容
 * @param datetime: String 投稿時刻(default:NOW()-設定不要)
 */
data class Notice(
    val n_id: String = "n0000",
    val title: String,
    val content: String,
    val create_date: String = "${LocalDateTime.now()}",
): TableBase

/**
 * Status(テーブル:status)
 * Listの部分は、mutableListOf()を使用すること
 *
 * @param u_id: String ユーザーのID
 * @param game_status: Int ゲームステータス(^[0-4]$)
 * @param status_infos: List<String>(NULL許容) 中断中のデータ
 */
data class Status(
    val u_id: String,
    val game_status: Int,
    val status_infos: List<String>?,
): TableBase

/**
 * LoginLogデータクラス(テーブル:l_log)
 *
 * @param u_id: String ユーザーのID
 * @param datetime: String 投稿時刻(default:NOW()-設定不要)
 */
data class LoginLog(
    val u_id: String,
    val create_date: String = "${LocalDateTime.now()}",
): TableBase

/**
 * PuzzleLogデータクラス(テーブル:p_log)
 *
 * @param u_id: String ユーザーID
 * @param p_id: String パズルのID(^p[0-9]{4}$)
 * @param play_times: Int プレイ数(default:0-設定不要)
 * @param latest_play_datetime: String 最終プレイ時刻(default:NOW()-設定不要)
 */
data class PuzzleLog(
    val u_id: String,
    val p_id: String = "p0000",
    val play_times: Int = 0,
    val latest_play_datetime: String = "${LocalDateTime.now()}",
): TableBase

/**
 * BookLogデータクラス(テーブル:b_log)
 *
 * @param u_id: String ユーザーID
 * @param b_id: String 本の(^p[0-9]{4}$)
 * @param play_times: Int プレイ数(default:0-設定不要)
 * @param latest_play_datetime: String 最終プレイ時刻(default:NOW()-設定不要)
 */
data class BookLog(
    val u_id: String,
    val p_id: String = "p0000",
    val play_times: Int = 0,
    val latest_play_datetime: String = "${LocalDateTime.now()}",
)

/**
 * StatusInfoクラス
 * statusテーブルのstatus_infosへの設定に利用
 *
 * @param id: String 本、又はパズルのID
 */
class StatusInfos(val id: String) {
    /**
     * 本の場合：ページ数を基に、データベースに入れる形に変換
     *
     * @param status: Int 現在のページ数
     * @return List<String> IDと連結したデータ
     */
    fun generateDbForm(status: Int): List<String>{
      return mutableListOf(id, status.toString())
    }

    /**
     * パズルの場合：ピースの場所数を基に、データベースに入れる形に変換
     *
     * @param status: Int 現在のピース状況数
     * @return List<String> IDと連結したデータ
     */
    fun generateDbForm(status: List<String>): List<String>{
      val res = mutableListOf(id)
      for (item in status) {
        res.add(item)
      }
      return res
    }
    
    fun generateFrontForm(status: List<String>): Map<String, Any>{
      val res: MutableMap<String, Any> = mutableMapOf("id" to status[0])
      if(status[0].substring(0, 1) == "b") {
        res["infos"] = status[1].toInt()
      } else {
        val infos: MutableList<String> = mutableListOf()
        for (index in 1 until status.size){
          infos.add(status[index])
        }
        res["infos"] = infos
      }
      return res
    }
}