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
   * テーブルに要素を追加する
   *
   * @param usedTableName String: テーブル名
   * @param data TableBase: データクラス
   */
  suspend fun addItem(usedTableName: String, data: TableBase) {
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
   * キーを使用して検索する
   *
   * @param usedTableName String: テーブル名
   * @param keyVal String: キーの値
   *
   * return List<Map<String, AttributeValue>> AttributeValueMapのデータ
   */
  suspend fun searchByKey(usedTableName: String, keyVal: String): Map<String, AttributeValue> {
    val keyName = tableNameToKey[usedTableName]!!
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
   * @param keyVal String: キーの値
   */
  suspend fun deleteByKey(usedTableName: String, keyVal: String): Unit {
    val keyName = tableNameToKey[usedTableName]!!
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

  /**
   * キーを用いてデータを更新する
   *
   * @param usedTableName String: テーブル名
   * @param keyVal String: キーの値
   * @updateColumn String: 更新対象のカラム名
   * @updateVal Any: 更新後のデータ
   */
  suspend fun updateItem(usedTableName: String, keyVal: String, updateColumn: String, updateVal: Any): Unit {
    val keyName = tableNameToKey[usedTableName]!!
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