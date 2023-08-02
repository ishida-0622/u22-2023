package tic.u22

import aws.sdk.kotlin.services.dynamodb.*
import aws.sdk.kotlin.services.dynamodb.endpoints.*
import aws.sdk.kotlin.services.dynamodb.model.*
import aws.sdk.kotlin.services.dynamodb.paginators.*
import aws.sdk.kotlin.services.dynamodb.waiters.*
import aws.sdk.kotlin.services.lambda.*
import kotlin.reflect.*
import kotlin.reflect.full.*

/**
 * DynamoDBの操作に関するクラス
 *
 * @param REGION String: リージョン。基本的にはSettings().AWS_REGIONでよい。
 */
class Dynamo(val REGION: String){
  val utils = Utils()

  /**
   * キーを使用して検索する
   *
   * @param usedTableName String: テーブル名
   * @param keyVal List<String>: キーの値[パーティションキー, (ソートキー)]
   *
   * return List<Map<String, AttributeValue>> AttributeValueMapのデータ
   */
  suspend fun searchByKey(usedTableName: String, keyVal: List<String>): Map<String, AttributeValue> {
    if (!tableNameToKey.containsKey(usedTableName)) {
      throw Exception("usedTableName does not exist")
    } else if (tableNameToKey[usedTableName]!!.size != keyVal.size) {
      throw Exception("length of keyVal is mismatched")
    }
    val keyName = tableNameToKey[usedTableName]!!
    // keyValとnameをMapにセット
    val keys = mutableMapOf<String, Any>()
    for(index in 0 until keyName.size) {
      keys[keyName[index]] = keyVal[index]
    }

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

  /**
   * キーを使用して検索する
   *
   * @param usedTableName String: テーブル名
   * @param keyVal List<List<String>>: [キーの値[パーティションキー, (ソートキー)], (..)]
   *
   * return List<Map<String, AttributeValue>> AttributeValueMapのデータ
   */
  suspend fun searchByKeys(usedTableName: String, keyVal: List<List<String>>): List<Map<String, AttributeValue>> {
    if (!tableNameToKey.containsKey(usedTableName)) {
      throw Exception("usedTableName does not exist")
    } else if (keyVal.size == 0) {
      throw Exception("length of keyVal is zero")
    } else {
      for (item in keyVal) {
        if (tableNameToKey[usedTableName]!!.size != item.size) {
          throw Exception("length of keyVal is mismatched")
        }
      }
    }
    val keyName = tableNameToKey[usedTableName]!!
    // keyValとnameをMapにセット
    // val keys = mutableMapOf<String, Any>()

    val keys: List<Map<String, Any>> = keyVal.map{
      it.map { item ->
        keyName[it.indexOf(item)] to item
      }.toMap()
    }
    
    val keyToGets = keys.map {
      utils.toAttributeValueMap(it)
    }
    // テーブル名とキーを設定
    val reqs = keyToGets.map{
      GetItemRequest {
        key = it
        tableName = usedTableName
      }
    }

    DynamoDbClient { region = REGION }.use { ddb ->
      // 取得
      val responses = reqs.map{
        val response = ddb.getItem(it)
        // 取得結果を出力
        if (response.item == null) {
          mapOf()
        } else {
          response.item!!.map { mp ->
            mp.key to mp.value
          }.toMap()
        }
      }
      return responses
    }
  }

  /**
   * テーブルに要素を追加する(複数要素の追加はこのメソッド自体を複数回呼び出すこと)
   *
   * @param usedTableName String: テーブル名
   * @param addData TableBase: データクラス
   */
  suspend fun addItem(usedTableName: String, addData: TableBase): Boolean {
    // 型変換
    val itemValues = utils.toAttributeValueMap(utils.toMap(addData))
    // 既にプライマリーキーが存在する場合はfalseを返す
    if (searchByKey(usedTableName, tableNameToKey[usedTableName]!!.map{utils.toMap(addData)[it].toString()}).size > 0){return false}
    // テーブル名とitemを指定
    val req = PutItemRequest {
      tableName = usedTableName
      item = itemValues
    }
    // 追加
    DynamoDbClient { region = REGION }.use { ddb -> ddb.putItem(req) }
    return true
  }

  /**
   * テーブルの全ての要素を取得する
   *
   * @param usedTableName String: テーブル名
   *
   * return List<Map<String, AttributeValue>> データ(各データがAttributeValueのMap)
   */
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
  
  /**
   * 特定のカラムを使用して検索する
   *
   * @param usedTableName String: テーブル名
   * @param clumn String: 検索に用いるカラム名
   * @param value Any: 検索するデータ
   * @param condition String: 検索の演算子(=, <, <=, >, >=, <>)
   *
   * return List<Map<String, AttributeValue>> データ(各データがAttributeValueのMap)
   */
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

  /**
   * キーを用いてデータを削除する
   *
   * @param usedTableName String: テーブル名
   * @param keyVal List<String>: キーの値[パーティションキー, (ソートキー)]
   *
   * return String: 成功時はDONE、失敗時はエラー文を返す
   */
  suspend fun deleteByKey(usedTableName: String, keyVal: List<String>): String {
    try{
      if (!tableNameToKey.containsKey(usedTableName)) {
        throw Exception("usedTableName does not exist")
      } else if (tableNameToKey[usedTableName]!!.size != keyVal.size) {
        throw Exception("length of keyVal is mismatched")
      }

      if(searchByKey(usedTableName, keyVal).isEmpty()){ throw Exception("the data for this key is not exist") }

      val keyName = tableNameToKey[usedTableName]!!
      // keyValとnameをMapにセット
      val keys = mutableMapOf<String, Any>()
      for(index in 0 until keyName.size) {
        keys[keyName[index]] = keyVal[index]
      }

      val keyToGet = utils.toAttributeValueMap(keys)

      val request = DeleteItemRequest {
          tableName = usedTableName
          key = keyToGet
      }

      DynamoDbClient { region = REGION }.use { ddb ->
          ddb.deleteItem(request)
          return "DONE"
      }
    } catch(e: Exception){
      return "$e"
    }
  }

  /**
   * キーを用いてデータを更新する
   *
   * @param usedTableName String: テーブル名
   * @param keyVal List<String>: キーの値[パーティションキー, (ソートキー)]
   * @updates Map<String, Any>: {更新対象のカラム名: 更新後のデータ}
   *
   * return 成功時はDONE, 失敗時はエラーを返す
   */
  suspend fun updateItem(usedTableName: String, keyVal: List<String>, update: Map<String, Any>): String {
    if (!tableNameToKey.containsKey(usedTableName)) {
      throw Exception("usedTableName does not exist")
    } else if (tableNameToKey[usedTableName]!!.size != keyVal.size) {
      Exception("length of keyVal is mismatched")
    }
    val keyName = tableNameToKey[usedTableName]!!
    if (!searchByKey(usedTableName, keyVal).containsKey(keyName[0])) {
      throw Exception("the value for this key does not exist")
    }
    // keyValとnameをMapにセット
    val keys = mutableMapOf<String, Any>()
    for(index in 0 until keyName.size) {
      keys[keyName[index]] = keyVal[index]
    }

    val itemKey = utils.toAttributeValueMap(keys)

    try {
      val updatedValues = update.map{
        it.key to AttributeValueUpdate {
          value = utils.toAttributeValue(it.value)
          action = AttributeAction.Put
        }
      }.toMap()

      val request = UpdateItemRequest {
          tableName = usedTableName
          key = itemKey
          attributeUpdates = updatedValues
      }

      DynamoDbClient { region = REGION }.use { ddb ->
          ddb.updateItem(request)
          return "DONE"
      }
    } catch(e:Exception) {
      return "$e"
    }
  }

  /**
   * シーケンスをインクリメントし、結果を返す
   *
   * @param usedTableName String: | puzzle | book | notice |
   *
   * return 成功時はシーケンス, 失敗時は-1を返す
   */
  suspend fun updateSequence(usedTableName: String): Int {
    if (!(listOf("puzzle", "book", "notice").contains(usedTableName))) {
      throw Exception("usedTableName is able to only puzzle, book, or notice")
    }

    val itemKey = utils.toAttributeValueMap(mapOf("tablename" to usedTableName))

    val now_seq: Int = (utils.toMap(utils.attributeValueToObject(searchByKey("sequence", listOf(usedTableName)), "sequence"))["now_seq"]!!) as Int

    try {
      val updatedValues = mapOf("now_seq" to AttributeValueUpdate {
          value = utils.toAttributeValue(now_seq + 1)
          action = AttributeAction.Put
        })

      val request = UpdateItemRequest {
          tableName = "sequence"
          key = itemKey
          attributeUpdates = updatedValues
      }

      DynamoDbClient { region = REGION }.use { ddb ->
          ddb.updateItem(request)
          return now_seq + 1
      }
    } catch(e:Exception) {
      println(e)
      return -1
    }
  }
}