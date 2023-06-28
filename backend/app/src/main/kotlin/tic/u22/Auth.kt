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

val utils = Utils()
val REGION = Settings().AWS_REGION
val katogi = Notice(title="a", content="a")

fun main(){
    println(katogi.title::class.qualifiedName)
}