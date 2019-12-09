module Package (parse, Package, Module, Vs) where

import Json.Decode as Json exposing ((:=))
import List


parse : List (String, String) -> Package
parse input = List.map decode input |> List.concat


decode : (String, String) -> Package
decode (name, json) =
    case Json.decodeString (package name) json of
        Ok v -> v
        Err msg -> []


type alias Package = List Module


type alias Module =
    { packageName : String
    , name : String
    , values : Values
    }


type alias Values =
    { aliases : List Vs
    , types : List (String, List String)
    , values : List Vs
    }

type alias Vs =
    { name : String
    , comment : String
    , signature : String
    }


package : String -> Json.Decoder Package
package packageName =
    let name =
            "name" := Json.string

        v = Json.object3 Vs
            ("name" := Json.string)
            ("comment" := Json.string)
            ("type" := Json.string)

        type' =
            Json.object2 (,) name
                ("cases" := Json.list (Json.tuple2 always Json.string Json.value))

        values =
            Json.object3 Values
                ("aliases" := Json.list v)
                ("types" := Json.list type')
                ("values" := Json.list v)
    in
        Json.list (Json.object2 (Module packageName) name values)
