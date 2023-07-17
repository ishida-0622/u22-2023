package tic.u22

fun typeOf(value Any): String{
    return value::class.qualifiedName
}