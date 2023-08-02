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
                words = listOf(
                    Word(
                        word = "I",
                        shadow = "${Settings().AWS_BUCKET}/puzzle/shadow/I.png",
                        illustration = "${Settings().AWS_BUCKET}/puzzle/image/I.png",
                        voice = "${Settings().AWS_BUCKET}/puzzle/voice/I.mp3",
                        is_displayed = true,
                        is_dummy = false
                    ),
                    Word(
                        word = "have",
                        shadow = "${Settings().AWS_BUCKET}/puzzle/shadow/have.png",
                        illustration = "${Settings().AWS_BUCKET}/puzzle/image/have.png",
                        voice = "${Settings().AWS_BUCKET}/puzzle/voice/have.mp3",
                        is_displayed = false,
                        is_dummy = false
                    ),
                    Word(
                        word = "a pen",
                        shadow = "${Settings().AWS_BUCKET}/puzzle/shadow/a-pen.png",
                        illustration = "${Settings().AWS_BUCKET}/puzzle/image/a-pen.png",
                        voice = "${Settings().AWS_BUCKET}/puzzle/voice/a-pen.mp3",
                        is_displayed = true,
                        is_dummy = false
                    ),
                    Word(
                        word = "am",
                        shadow = "${Settings().AWS_BUCKET}/puzzle/shadow/am.png",
                        illustration = "${Settings().AWS_BUCKET}/puzzle/image/am.png",
                        voice = "${Settings().AWS_BUCKET}/puzzle/voice/am.mp3",
                        is_displayed = false,
                        is_dummy = true
                    )
                )
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
