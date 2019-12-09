export const MODULE_DECLARATION = `
module Modules.Foo.Bar exposing (Constructor(..), SomeType, someFn, Msg(..), Step(..))
`.trim()

export const IMPORT_LIST = `
import Basics exposing (..)
import List exposing ((::))
import Maybe exposing ( Maybe(..) )
import Result exposing ( Result(..) )
-- this is a test
----- so many
{-----
import NotToBeImported
  -}
import String
-- import AlsoNotToBeImported
import Tuple
import Browser

import Html exposing (Html,
 button, div, text
  )
import Html.Events exposing (onClick, A, c, E(AS,DEF))
import Foo.Bar as Baz exposing (B, C(..), D, E(..))
import Plink exposing (..)
import Kluck exposing (Chicken(..))
`.trim()

export const REST_OF_MODULE = `
shuffleList : List a -> Random.Generator (List a)
shuffleList list =
    Random.list (List.length list) (Random.float 0 1)
        |> Random.map
            (\rs ->
                List.map2 Tuple.pair list rs
                    |> List.sortBy Tuple.second
                    |> List.map Tuple.first
            )


main : Program () { values : List Int } Msg
main =
    Browser.element { init = init, update = update, view = view, subscriptions = always Sub.none }


init _ =
    ( { values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
      }
    , Cmd.none
    )


type Msg
    = Shuffle
    | Update (List Int)


update msg model =
    case msg of
        Shuffle ->
            ( model, Random.generate Update (shuffleList model.values) )

        Update list ->
            ( { model | values = list }, Cmd.none )


view model foo bar =
    div []
        [ button [ onClick Shuffle ] [ text "Shuffle" ]
        , Html.Keyed.node "div" [] <|
            List.map
                (\value ->
                    ( String.fromInt value
                    , div []
                        [ text <| String.fromInt value
                        ]
                    )
                )
                model.values
        ]

type alias Model =
    { a : A
    , bbbb : B
    , cDEfG : C
    }
type Foo
    = Bar
    | Baz (List Int)
`.trim()

export const PARAMETERIZED_TYPE = `
type ValidRange a
    = Infinity
    | LowerInf (RangeBound a)
    | LowerBounded (LowerBoundedValidRange a)
    | Empty


type LowerBoundedValidRange a
    = UpperInf (RangeBound a)
    | Finite (RangeBound a) (RangeBound a)


type alias RangeBound a =
    { bound : a
    , inclusive : Bool
    }

type Either a b
    = Left a
    | Right b
`

export const FUNCTION_WITH_LET = `
optionalDecoder : Decoder Decode.Value -> Decoder a -> a -> Decoder a
optionalDecoder pathDecoder valDecoder fallback =
    let
        nullOr decoder =
            Decode.oneOf [ decoder, Decode.null fallback ]

        handleResult input =
            case Decode.decodeValue pathDecoder input of
                Ok rawValue ->
                    -- The field was present, so now let's try to decode that value.
                    -- (If it was present but fails to decode, this should and will fail!)
                    case Decode.decodeValue (nullOr valDecoder) rawValue of
                        Ok finalResult ->
                            Decode.succeed finalResult

                        Err finalErr ->
                            -- TODO is there some way to preserve the structure
                            -- of the original error instead of using toString here?
                            Decode.fail (Decode.errorToString finalErr)

                Err _ ->
                    -- The field was not present, so use the fallback.
                    Decode.succeed fallback
    in
    Decode.value
        |> Decode.andThen handleResult
`

export const FUNCTION_WITH_PATTERN = `
functionWithPattern : TypeName -> { a | foo : Int, bar : String }, (Result Http.Error () -> msg) -> Cmd msg
functionWithPattern (ConstructorName id) (({ foo }) as bar) =
    postWithNoResponse ("/api/foobar" ++ String.fromInt id)


myTime : Foo -> Int
myTime (Foo ({ bar } as model)) =
    model.bar

tuplePatterns : (Int, Int) -> Int
tuplePatterns (a, b) = a

unitPattern : () -> Int
unitPattern () = 1

emptyRecordPattern : { a | b : Int } -> Int
emptyRecordPattern {} = 1
`

export const PORTS = `
port load : String -> Cmd msg


port modifyUrl : String -> Cmd msg


port newUrl : String -> Cmd msg


port onUrlChange : (String -> msg) -> Sub msg
`
