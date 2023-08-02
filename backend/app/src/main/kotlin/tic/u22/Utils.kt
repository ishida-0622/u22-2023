package tic.u22

import java.io.File
import java.io.FileOutputStream
import java.nio.file.Files
import java.util.Base64
import aws.sdk.kotlin.services.dynamodb.model.*
import kotlin.reflect.*
import kotlin.reflect.full.*
import java.time.LocalDateTime
import com.google.gson.JsonParser
import com.google.gson.Gson

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
            } else if(value is List<*>) {
              toMapInList(value)
            } else if (value is Map<*, *>) {
              toMapInMap(value)
            } else {
              value
            }
          }
    }
  }

  /**
   * toMap内で見つかったListにデータクラスがないか検証して変換する
   */
  private fun toMapInList(lst: List<*>): List<*> {
    return lst.map{
      if (it == null) {
        null
      } else if(it is List<*>) {
        toMapInList(it)
      } else if (it is Map<*, *>) {
        toMapInMap(it)
      } else if (it::class.isData) {
        toMap(it)
      } else {
        it
      }
    }
  }

  /**
   * toMap内で見つかったMapにデータクラスがないか検証して変換する
   */
  private fun toMapInMap(mp: Map<*, *>): Map<*, *> {
    return mp.map{
      if(it.value == null){
        it.key to null
      } else if(it.value is List<*>) {
        it.key to toMapInList(it.value as List<*>)
      } else if (it.value is Map<*, *>) {
        it.key to toMapInMap(it.value as Map<*, *>)
      } else if ((it.value!!)::class.isData) {
        it.key to toMap(it.value as Any)
      } else {
        it.key to it.value
      }
    }.toMap()
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
   * MapをAttributeValue.M型に変換する
   *
   * @param mp 変換したいMap
   *
   * @return 変換されたMap
   */
  fun toAttributeValueM(mp: Map<*, *>): AttributeValue.M {
    val res = mp.map{
      if(!(it.key is String)) {
        throw Exception("key is not String while convert to AttributeValue.M")
      }
      it.key as String to toAttributeValue(it.value)
    }.toMap()
    return AttributeValue.M(res)
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
      is Map<*, *> -> toAttributeValueM(value)
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

  /**
   * AttrbuteValueをKotlinの型に変換する
   *
   * @param v AttributeValue: AttributeValueの値(データベースから取得したカラムなど)
   *
   * retrun Any?: Kotlinの型に変換されたv
   */
  fun toKotlinType(v: AttributeValue): Any? {
    return when(v) {
      is AttributeValue.S -> v.asS()
      is AttributeValue.N -> v.asN()
      is AttributeValue.Bool -> v.asBool()
      is AttributeValue.L -> v.asL().map{toKotlinType(it)}
      is AttributeValue.M -> v.asM().map{it.key to toKotlinType(it.value)}.toMap()
      is AttributeValue.Null -> null
      else -> throw Exception("not supported type")
    }
  }

  /**
   * AttributeValueをTableBaseのデータクラスに変換する
   * このメソッドでデータクラスに変換する際は、必ずデータクラスの変数の内容を含めること。
   * userデータクラスの場合、{"u_id": AttributeValue.S(u_id), ... , "authed": AttributeValue.Bool(authed)}となる。
   *
   * @param attribute Map<String, AttributeValue>: AttributeValueのMap(データベースから取得したデータ)
   * @param tableType String: テーブル名( user | puzzle | book | notice | status | l_log | p_log | b_log | sequence )
   *
   * return TableBase: 指定のデータクラスに変換されたオブジェクト
   */
  fun attributeValueToObject(attribute: Map<String, AttributeValue>, tableType: String): TableBase {
    try {
      val values = attribute.map{
        it.key to toKotlinType(it.value)
      }.toMap()
      return when (tableType) {
        "user" -> User(
          u_id = if(values["u_id"] == null){throw Exception("u_id is null")} else {if(values["u_id"]!! is String){values["u_id"] as String}else{throw Exception("u_id type is ng")}},
          family_name = if(values["family_name"] == null){throw Exception("family_name is null")} else {if(values["family_name"]!! is String){values["family_name"] as String}else{throw Exception("family_name type is ng")}},
          first_name = if(values["first_name"] == null){throw Exception("first_name is null")} else {if(values["first_name"]!! is String){values["first_name"] as String}else{throw Exception("first_name type is ng")}},
          family_name_roma = if(values["family_name_roma"] == null){throw Exception("family_name_roma is null")} else {if(values["family_name_roma"]!! is String){values["family_name_roma"] as String}else{throw Exception("family_name_roma type is ng")}},
          first_name_roma = if(values["first_name_roma"] == null){throw Exception("first_name_roma is null")} else {if(values["first_name_roma"]!! is String){values["first_name_roma"] as String}else{throw Exception("first_name_roma type is ng")}},
          child_lock = if(values["child_lock"] == null){throw Exception("child_lock is null")} else {if(values["child_lock"]!! is String){values["child_lock"] as String}else{throw Exception("child_lock type is ng")}},
          account_name = if(values["account_name"] == null){throw Exception("account_name is null")} else {if(values["account_name"]!! is String){values["account_name"] as String}else{throw Exception("account_name type is ng")}},
          limit_time = if(values["limit_time"] == null){throw Exception("limit_time is null")} else {if(values["limit_time"]!! is String){(values["limit_time"] as String).toInt()}else{throw Exception("limit_time type is ng")}},
          delete_flg = if(values["delete_flg"] == null){throw Exception("delete_flg is null")} else {if(values["delete_flg"]!! is Boolean){values["delete_flg"] as Boolean}else{throw Exception("delete_flg type is ng")}},
        )
        "puzzle" ->  Puzzle(
          p_id = if(values["p_id"] == null){throw Exception("p_id is null")} else {if(values["p_id"]!! is String){values["p_id"] as String}else{throw Exception("p_id type is ng")}},
          title = if(values["title"] == null){throw Exception("title is null")} else {if(values["title"]!! is String){values["title"] as String}else{throw Exception("title type is ng")}},
          description = if(values["description"] == null){throw Exception("description is null")} else {if(values["description"]!! is String){values["description"] as String}else{throw Exception("description type is ng")}},
          icon = if(values["icon"] == null){throw Exception("icon is null")} else {if(values["icon"]!! is String){values["icon"] as String}else{throw Exception("icon type is ng")}},
          words = if(values["words"] == null){throw Exception("words is null")} else {if(values["words"]!! is List<Any?>){
            val wordVal = values["words"]!! as List<Any?>
            wordVal.map{
              if(it is Map<*, *>){
                attributeValueToObject(it.map{ item ->
                  if(!(item.key is String && item.value is Any)){throw Exception("type of word (inside) is ng")}
                  (item.key as String) to toAttributeValue(item.value)
                }.toMap(), "word") as Word
              } else {
                throw Exception("type of word is ng")
              }
            }
          }else{throw Exception("words type is ng")}},
          create_date  = if(values["create_date"] == null){throw Exception("create_date is null")} else {if(values["create_date"]!! is String){values["create_date"] as String}else{throw Exception("create_date type is ng")}},
          update_date  = if(values["update_date"] == null){throw Exception("update_date is null")} else {if(values["update_date"]!! is String){values["update_date"] as String}else{throw Exception("update_date type is ng")}}
        )
        "word" -> Word(
          word = if(values["word"] == null){throw Exception("word is null")} else {if(values["word"]!! is String){values["word"] as String}else{throw Exception("word type is ng")}},
          shadow = if(values["shadow"] == null){throw Exception("shadow is null")} else {if(values["shadow"]!! is String){values["shadow"] as String}else{throw Exception("shadow type is ng")}},
          illustration = if(values["illustration"] == null){throw Exception("illustration is null")} else {if(values["illustration"]!! is String){values["illustration"] as String}else{throw Exception("illustration type is ng")}},
          voice = if(values["voice"] == null){throw Exception("voice is null")} else {if(values["voice"]!! is String){values["voice"] as String}else{throw Exception("voice type is ng")}},
          is_displayed = if(values["is_displayed"] == null){throw Exception("is_displayed is null")} else {if(values["is_displayed"]!! is Boolean){values["is_displayed"] as Boolean}else{throw Exception("is_displayed type is ng")}},
          is_dummy = if(values["is_dummy"] == null){throw Exception("is_dummy is null")} else {if(values["is_dummy"]!! is Boolean){values["is_dummy"] as Boolean}else{throw Exception("is_dummy type is ng")}},
        )
        "book" -> Book(
          b_id = if(values["b_id"] == null){throw Exception("b_id is null")} else {if(values["b_id"]!! is String){values["b_id"] as String}else{throw Exception("b_id type is ng")}},
          title_jp = if(values["title_jp"] == null){throw Exception("title_jp is null")} else {if(values["title_jp"]!! is String){values["title_jp"] as String}else{throw Exception("title_jp type is ng")}},
          title_en = if(values["title_en"] == null){throw Exception("title_en is null")} else {if(values["title_en"]!! is String){values["title_en"] as String}else{throw Exception("title_en type is ng")}},
          summary = if(values["summary"] == null){throw Exception("summary is null")} else {if(values["summary"]!! is String){values["summary"] as String}else{throw Exception("summary type is ng")}},
          author = if(values["author"] == null){throw Exception("author is null")} else {if(values["author"]!! is String){values["author"] as String}else{throw Exception("author type is ng")}},
          thumbnail = if(values["thumbnail"] == null){throw Exception("thumbnail is null")} else {if(values["thumbnail"]!! is String){values["thumbnail"] as String}else{throw Exception("thumbnail type is ng")}},
          pdf = if(values["pdf"] == null){throw Exception("pdf is null")} else {if(values["pdf"]!! is String){values["pdf"] as String}else{throw Exception("pdf type is ng")}},
          voice_keys = if(values["voice_keys"] == null){throw Exception("voice_keys is null")} else {if(values["voice_keys"]!! is List<Any?>){(values["voice_keys"] as List<Any?>).map{ if(it is String){it}else{throw Exception("voice_keys type is ng")}}}else{throw Exception("voice_keys type is ng")}},
          create_date = if(values["create_date"] == null){throw Exception("create_date is null")} else {if(values["create_date"]!! is String){values["create_date"] as String}else{throw Exception("create_date type is ng")}},
          update_date = if(values["update_date"] == null){throw Exception("update_date is null")} else {if(values["update_date"]!! is String){values["update_date"] as String}else{throw Exception("update_date type is ng")}}
        )
        "notice" -> Notice(
          n_id = if(values["n_id"] == null){throw Exception("n_id is null")} else {if(values["n_id"]!! is String){values["n_id"] as String}else{throw Exception("n_id type is ng")}},
          title = if(values["title"] == null){throw Exception("title is null")} else {if(values["title"]!! is String){values["title"] as String}else{throw Exception("title type is ng")}},
          content = if(values["content"] == null){throw Exception("content is null")} else {if(values["content"]!! is String){values["content"] as String}else{throw Exception("content type is ng")}},
          create_date = if(values["create_date"] == null){throw Exception("create_date is null")} else {if(values["create_date"]!! is String){values["create_date"] as String}else{throw Exception("create_date type is ng")}}
        )
        "status" -> Status(
          u_id = if(values["u_id"] == null){throw Exception("u_id is null")} else {if(values["u_id"]!! is String){values["u_id"] as String}else{throw Exception("u_id type is ng")}},
          game_status = if(values["game_status"] == null){throw Exception("game_status is null")} else {if(values["game_status"]!! is String){(values["game_status"] as String).toInt()}else{throw Exception("game_status type is ng")}},
          status_infos = if(values["status_infos"] == null){null} else {if(values["status_infos"]!! is List<Any?>){(values["status_infos"] as List<Any?>).map{ if(it is String){it}else{throw Exception("status_infos type is ng")}}}else{throw Exception("status_infos type is ng")}}
        )
        "l_log" -> LoginLog(
          u_id = if(values["u_id"] == null){throw Exception("u_id is null")} else {if(values["u_id"]!! is String){values["u_id"] as String}else{throw Exception("u_id type is ng")}},
          datetime = if(values["datetime"] == null){throw Exception("datetime is null")} else {if(values["datetime"]!! is String){values["datetime"] as String}else{throw Exception("datetime type is ng")}}
        )
        "p_log" -> PuzzleLog(
          u_id = if(values["u_id"] == null){throw Exception("u_id is null")} else {if(values["u_id"]!! is String){values["u_id"] as String}else{throw Exception("u_id type is ng")}},
          p_id = if(values["p_id"] == null){throw Exception("p_id is null")} else {if(values["p_id"]!! is String){values["p_id"] as String}else{throw Exception("p_id type is ng")}},
          play_times = if(values["play_times"] == null){throw Exception("play_times is null")} else {if(values["play_times"]!! is String){(values["play_times"] as String).toInt()}else{throw Exception("play_times type is ng")}},
          latest_play_datetime = if(values["latest_play_datetime"] == null){throw Exception("latest_play_datetime is null")} else {if(values["latest_play_datetime"]!! is String){values["latest_play_datetime"] as String}else{throw Exception("latest_play_datetime type is ng")}}
        )
        "b_log" -> BookLog(
          u_id = if(values["u_id"] == null){throw Exception("u_id is null")} else {if(values["u_id"]!! is String){values["u_id"] as String}else{throw Exception("u_id type is ng")}},
          b_id = if(values["b_id"] == null){throw Exception("b_id is null")} else {if(values["b_id"]!! is String){values["b_id"] as String}else{throw Exception("b_id type is ng")}},
          play_times = if(values["play_times"] == null){throw Exception("play_times is null")} else {if(values["play_times"]!! is String){(values["play_times"] as String).toInt()}else{throw Exception("play_times type is ng")}},
          latest_play_datetime = if(values["latest_play_datetime"] == null){throw Exception("latest_play_datetime is null")} else {if(values["latest_play_datetime"]!! is String){values["latest_play_datetime"] as String}else{throw Exception("latest_play_datetime type is ng")}}
        )
        "sequence" -> Sequence(
          tablename = if(values["tablename"] == null){throw Exception("tablename is null")} else {if(values["tablename"]!! is String){values["tablename"] as String}else{throw Exception("tablename type is ng")}},
          now_seq = if(values["now_seq"] == null){throw Exception("now_seq is null")} else {if(values["now_seq"]!! is String){(values["now_seq"] as String).toInt()}else{throw Exception("now_seq type is ng")}}
        )
        else -> throw Exception("none type")
      }
    } catch(e: Exception) {
      println("$e")
      println("could not serialized")
      throw Exception("$e")
    }
  }

  /**
   * ファイルをBase64のURIに変換する
   *
   * @param path String: 変換するファイルのパス(ルートディレクトリはfiles)
   *
   * return String 変換後のURI(変換に失敗した場合はエラー内容)
   */
  fun encodeToUri(path: String): String {
    try {
      val file = File("files/${path}")
      val contentType = Files.probeContentType(file.toPath())
      val datas = Files.readAllBytes(file.toPath())
      val base64str = Base64.getEncoder().encodeToString(datas)
      return "data:${contentType};base64,${base64str}"
    } catch(e: Exception) {
      return "$e"
    }
  }

  /**
   * URIからファイルにデコードする
   *
   * @param uri String: 変換前のURI
   * @param fileName String: パス・ファイル名(拡張子を除く・ルートディレクトリはfiles)
   *
   * return 成功した場合は「Done」、失敗した場合はエラー内容
   */
  fun decodeFromUri(uri: String, fileName: String): String {
    try {
      val formattedUri = mapOf(
        "type" to uri.split(":")[1].split("/")[0],
        "extension" to uri.split(";")[0].split("/")[1],
        "data" to uri.split(",")[1]
      )
      val bytes = Base64.getDecoder().decode(formattedUri["data"]);
      val file = FileOutputStream("files/${fileName}.${formattedUri["extension"]}");
      file.write(bytes);
      return "Done"
    } catch(e: Exception) {
      return "$e"
    }
  }

  /**
   * 受け取ったJSONを、KotlinのMapオブジェクトに変換する(テスト・本番環境で同じソースを使用するためのメソッド)
   *
   * @param json Any(String||Map<*, *>): 変換したいオブジェクト
   *
   * return Map<String, Any>: 変換後のオブジェクト(引数の型が求められているものでない場合はエラーを返す)
   */
  fun formatJsonEnv(json: Any): Map<String, Any> {
    if (json is String) {
      return gson.fromJson(json, Map::class.java) as Map<String, Any>
    } else if (json::class.simpleName == "LinkedHashMap") {
      return json as Map<String, Any>
    } else {
      throw Exception("The json's type is not allowed")
    }
  }
}


/**
 * 実行環境で使用する設定変数
 */
class Settings {
    val AWS_REGION = "us-east-1"
    val AWS_BUCKET = "club-katogi"
}


/**
 * テーブル名とそのテーブルのキーを結びつけるマップ
 */
val tableNameToKey: Map<String, List<String>> = mapOf(
  "user" to listOf("u_id"),
  "puzzle" to listOf("p_id"),
  "book" to listOf("b_id"),
  "notice" to listOf("n_id"),
  "status" to listOf("u_id"),
  "l_log" to listOf("u_id", "datetime"),
  "p_log" to listOf("u_id", "p_id"),
  "b_log" to listOf("u_id", "b_id"),
  "sequence" to listOf("tablename")
)

// 全てのデータクラスの親
interface TableBase {}

/**
 * Userデータクラス(テーブル:user)
 *
 * @param u_id: String ユーザーのID
 * @param family_name: String 姓名
 * @param first_name: String 名前
 * @param family_name_roma: String ローマ字姓名
 * @param first_name_roma: String ローマ字名前
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
    val child_lock: String,
    val account_name: String,
    val limit_time: Int = 1440,
    val delete_flg: Boolean = false,
): TableBase

/**
 * Puzzleデータクラス(テーブル:puzzle)
 * Listの部分は、mutableListOf()を使用すること
 *
 * @param p_id: String パズルのID(^p[0-9]{4}$)
 * @param title: String タイトル
 * @param description: String 概要
 * @param icon: String アイコン(default有-設定不要)
 * @param words: List<List<String>> 単語(正解順に格納・[[単語, 形状のS3キー, イラストのS3キー, 音声のS3キー]*単語数])([ [word, ${Settings().AWS_BUCKET}/puzzle/shape/<ファイル名>, ${Settings().AWS_BUCKET}/puzzle/image/<ファイル名>, ${Settings().AWS_BUCKET}/puzzle/voice/<ファイル名>], ])
 * @param create_date: String 作成日時(default:NOW()-設定不要)
 * @param update_date: String 更新日時(default:NOW()-設定不要)
 */
data class Puzzle(
    val p_id: String = "p0000",
    val title: String,
    val description: String,
    val icon: String = "${Settings().AWS_BUCKET}/puzzle/${p_id}/photo/icon.png",
    val words: List<Word>,
    val create_date: String = "${LocalDateTime.now()}",
    val update_date: String = create_date
): TableBase

data class Word(
    val word: String,
    val shadow: String,
    val illustration: String,
    val voice: String,
    val is_displayed: Boolean,
    val is_dummy: Boolean
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
 * @param voice_keys: List<String> 音声のS3キー(ページ順 ["${Settings().AWS_BUCKET}/book/${b_id}/1.mp3", ...])
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
    val datetime: String = "${LocalDateTime.now()}",
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
    val b_id: String = "p0000",
    val play_times: Int = 0,
    val latest_play_datetime: String = "${LocalDateTime.now()}",
): TableBase

/**
 * Sequenceデータクラス(テーブル:sequence)
 *
 * @param tablename: String | puzzle | book | notice |
 * @param now_seq: Int: 現在の最新のID番号
 */
data class Sequence(
    val tablename: String,
    val now_seq: Int
): TableBase

/**
 * Adminアカウントの判定と作成をするクラス
 */
class UseAdmin() {

  /**
   * Adminアカウントか判定する
   *
   * @param u_id String: ユーザーID
   *
   * return Boolean: adminアカウントかどうか
   */
  fun judgeAdmin(u_id: String): Boolean {
    if (u_id.substring(0,5) == "admin") {
      return true
    } else {
      return false
    }
  }

  /**
   * Adminアカウントを作成する
   *
   * @param  u_id String: 元のユーザーID
   *
   * return String: AdminアカウントにしたユーザーID
   */
  fun makeAdmin(u_id: String): String {
    return "admin${u_id.substring(0,19)}${u_id.substring(24, 36)}"
  }
}



/**
 * statusテーブルのstatus_infosへの設定に利用
 * TODO: 仕様変更に対応して変える
 * generateDbForm: フロント形式 -> DB形式
 * generateFrontForm: DB形式(返り値) -> フロント形式
 *
 * @param id: String 本、又はパズルのID
 */
class StatusInfos(val id: String) {
    /**
     * 本の場合：ページ数を基に、データベースに入れる形に変換
     *
     * @param status: Int 現在のページ数
     *
     * @return List<String> IDと連結したデータ
     */
    fun generateDbForm(status: Int): List<String>{
      return mutableListOf(id, status.toString())
    }

    /**
     * パズルの場合：ピースの場所数を基に、データベースに入れる形に変換
     *
     * @param status: Int 現在のピース状況数
     *
     * @return List<String> IDと連結したデータ
     */
    fun generateDbForm(status: List<String>): List<String>{
      val res = mutableListOf(id)
      for (item in status) {
        res.add(item)
      }
      return res
    }
    
    /**
     * フロントに渡す形式に変換
     *
     * @param status List<String> 取得したstatus_infos
     *
     * @return Map<String, Any> フロント形式のステータス情報(マップ)
     */
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