package tic.u22

import java.io.File
import java.util.Base64
import aws.sdk.kotlin.services.s3.*
import aws.sdk.kotlin.services.s3.model.*
import aws.sdk.kotlin.services.s3.model.BucketLocationConstraint
import aws.sdk.kotlin.services.lambda.*
import aws.smithy.kotlin.runtime.content.*
import kotlin.reflect.*
import kotlin.reflect.full.*

/**
 * S3の操作に関するクラス
 *
 * @param REGION String: リージョン。基本的にはSettings().AWS_REGIONでよい。
 */
class S3(val REGION: String) {

    /**
     * S3のオブジェクトを一覧で返す
     *
     * @param bucketName String: バケット名。基本的にはSettings().AWS_BUCKETでよい。
     *
     * return List<Map<String, String>>: オブジェクトの一覧
     */
    suspend fun listObjects(bucketName: String): List<Map<String, String>> {
        val request = ListObjectsRequest {
            bucket = bucketName
        }
        S3Client { region = REGION }.use { s3 ->
            val response = s3.listObjects(request)
            val result = if(response.contents == null){
                println("response.contents is null")
                listOf(mapOf())
            } else {response.contents!!.map{
                mapOf(
                    "key" to "${it.key}",
                    "size" to "${calKb(it.size)}KBs"
                )
            }}
            return result
        }
    }

    /**
     * S3にファイルをアップロードする
     *
     * @param bucketName String: バケット名。基本的にはSettings().AWS_BUCKETでよい。
     * @param objectKey String: S3のキー。パスとファイル名のこと。例: images/img.png ※"./"は不要
     * @param objectPath String: ローカルのファイルパス・ファイル名。ルートディレクトリはfiles。
     * @param metadataVal Map<String, String>?: ユーザー定義メタデータ。null許容。
     *
     * return String: 成功: eTag, 失敗: エラー内容
     */
    suspend fun putObject(bucketName: String, objectKey: String, objectUri: String, metadataVal: Map<String, String>?): String {
        try{
            val objectBytes = utils.decodeFromUri(objectUri)
            if (objectBytes == null) { throw Exception("could not decode to ByteArray from URI") }
            val request = PutObjectRequest {
                bucket = bucketName
                key = objectKey
                metadata = metadataVal
                body = ByteStream.fromBytes(objectBytes)
            }
            S3Client { region = REGION }.use { s3 ->
                val response = s3.putObject(request)
                return "${response.eTag}"
            }
        } catch(e: Exception) {
            println(e)
            return "$e"
        }
    }

    /**
     * オブジェクトをダウンロードする
     *
     * @param bucketName String: バケット名。基本的にはSettings().AWS_BUCKETでよい。
     * @param keyName String: S3のキー。パスとファイル名のこと。例: images/img.png ※"./"は不要
     * @param path String: ローカルのファイルパス・ファイル名。ルートディレクトリはfiles。
     *
     * return String: 成功: URI, 失敗: 例外のスロー
     */
    suspend fun getObject(bucketName: String, keyName: String): String {
        val request = GetObjectRequest {
            bucket = bucketName
            key = keyName
        }
        S3Client { region = REGION }.use { s3 ->
            val resp = s3.getObject(request) { resp ->
                // println("${resp.contentEncoding}")
                val byteResp = resp.body!!.toByteArray()
                val uriResp = Base64.getUrlEncoder().encodeToString(byteResp)
                "data:${resp.contentType};base64,${uriResp}"
            }
            return resp
        }
    }

    /**
     * オブジェクトを削除する
     *
     * @param bucketName String: バケット名。基本的にはSettings().AWS_BUCKETでよい。
     * @param objectName String: S3のキー。パスとファイル名のこと。例: images/img.png ※"./"は不要
     *
     * return String: 成功: Done, 失敗: エラー内容
     */
    suspend fun deleteObject(bucketName: String, objectName: String): String {
        try {
            val objectId = ObjectIdentifier {
                key = objectName
            }
            val delOb = Delete {
                objects = listOf(objectId)
            }
            val request = DeleteObjectsRequest {
                bucket = bucketName
                delete = delOb
            }
            S3Client { region = REGION }.use { s3 ->
                s3.deleteObjects(request)
            }
            return "Done"
        } catch (e: Exception) {
            return "$e"
        }
    }



    /**
     * ファイルサイズKbで計算する(プライベート関数)
     *
     * @param intValue Long: バイト数
     *
     * return Long: Kbにしたファイルサイズ
     */
    private fun calKb(intValue: Long): Long {
        return intValue / 1024
    }



}