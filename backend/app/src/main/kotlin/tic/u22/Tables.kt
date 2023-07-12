package tic.u22

import aws.sdk.kotlin.services.lambda.*
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import java.util.UUID
import kotlin.reflect.*
import kotlin.reflect.full.*
import kotlinx.coroutines.runBlocking

import com.google.gson.Gson

class Tables : RequestHandler<Map<String, Any>, String> {
    override fun handleRequest(event: Map<String, Any>?, context: Context?): String{
        val res = runBlocking {
            val user = User(
                u_id = "u_id",
                family_name = "family_name",
                first_name = "first_name",
                family_name_roma = "family_name_roma",
                first_name_roma = "first_name_roma",
                email = "email",
                password = "password",
                child_lock = "child_lock",
                account_name = "account_name"
            )
            val puzzle = Puzzle(
                p_id = "p_id",
                title = "title",
                description = "description",
                words = listOf(listOf("I", "${Settings().AWS_BUCKET}/puzzle/shape/I.png", "${Settings().AWS_BUCKET}/puzzle/image/I.png", "${Settings().AWS_BUCKET}/puzzle/voice/I.mp3"), listOf("have", "${Settings().AWS_BUCKET}/puzzle/shape/have.png", "${Settings().AWS_BUCKET}/puzzle/image/have.png", "${Settings().AWS_BUCKET}/puzzle/voice/have.mp3"), listOf("a pen", "${Settings().AWS_BUCKET}/puzzle/shape/pen.png", "${Settings().AWS_BUCKET}/puzzle/image/pen.png", "${Settings().AWS_BUCKET}/puzzle/voice/a-pen.mp3"))
            )
            val book = Book(
                b_id = "b_id",
                title_jp = "title_jp",
                title_en = "title_en",
                summary = "summary",
                author = "auhor",
                voice_keys = (1..5).toList().map{"${Settings().AWS_BUCKET}/book/b_id/${it}.mp3"}
            )
            val notice = Notice(
                n_id = "n_id",
                title = "title",
                content = "content"
            )
            val status = Status(
                u_id = "u_id",
                game_status = 2,
                status_infos = listOf("p_id", "n", "I" ,"a pen")
            )
            val l_log = LoginLog(
                u_id = "u_id"
            )
            val p_log = PuzzleLog(
                u_id = "u_id",
                p_id = "p_id",
                play_times = 1
            )
            val b_log = BookLog(
                u_id = "u_id",
                b_id = "b_id",
                play_times = 1
            )
            val datas = listOf(listOf(user, "user", listOf("u_id")), listOf(puzzle, "puzzle", listOf("p_id")), listOf(book, "book", listOf("b_id")), listOf(notice, "notice", listOf("n_id")), listOf(status, "status", listOf("u_id")), listOf(l_log, "l_log", listOf("u_id", "datetime")), listOf(p_log, "p_log", listOf("u_id", "p_id")), listOf(b_log, "b_log", listOf("u_id", "b_id")))

            val dynamo = Dynamo(Settings().AWS_REGION)
            datas.map{
                println(dynamo.addItem(it[1] as String, it[0] as TableBase))
            }
            datas.map{
                println(dynamo.searchByKey(it[1] as String, it[2] as List<String>))
            }
            val response = dynamo.searchByAny("puzzle", "title", "title", "=")
            datas.map{
                println(dynamo.deleteByKey(it[1] as String, it[2] as List<String>))
            }
            mapOf("result" to response.map{
                utils.toMap(utils.attributeValueToObject(it, "puzzle"))
            })
        }
        return gson.toJson(res)
    }
}
