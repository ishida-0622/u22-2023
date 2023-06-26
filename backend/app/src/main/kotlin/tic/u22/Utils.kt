package tic.kotlin.learning.club

import aws.sdk.kotlin.services.dynamodb.*
import aws.sdk.kotlin.services.dynamodb.endpoints.*
import aws.sdk.kotlin.services.dynamodb.model.*
import aws.sdk.kotlin.services.dynamodb.paginators.*
import aws.sdk.kotlin.services.dynamodb.waiters.*
import aws.sdk.kotlin.services.lambda.*
import kotlin.reflect.*
import kotlin.reflect.full.*

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
   * MapのvalueをAttributeValue型(DynamoDBに対応する型)に変換する
   *
   * @param mp 変換したいMap
   *
   * @return 変換されたMap
   */
  fun toAttributeValueMap(mp: Map<String, Any?>): Map<String, AttributeValue> {
    return mp
        .map { it ->
          val value = it.value
          val resValue: AttributeValue =
              when (value) {
                is String -> AttributeValue.S(value)
                is Int, is Long -> AttributeValue.N(value.toString())
                is Boolean -> AttributeValue.Bool(value)
                null -> AttributeValue.Null(true)
                is ByteArray -> AttributeValue.B(value)
                else -> AttributeValue.S(value as String)
              }
          it.key to resValue
        }
        .toMap()
  }
}
