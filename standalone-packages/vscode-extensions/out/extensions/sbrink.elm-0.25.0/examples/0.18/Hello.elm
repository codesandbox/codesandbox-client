module Main exposing (..)

import Html exposing (Html, div, button, text)
import Html.Events exposing (onClick)
import ModuleExample exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, Cmd.none )
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }


type alias Model =
    Int


initialModel : Model
initialModel =
    0


type Msg
    = Increment
    | Decrement
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Increment ->
            ( model + 1, Cmd.none )

        Decrement ->
            ( model - 1, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ button [ onClick Decrement ] [ text "-" ]
        , div [] [ viewCounter model ]
        , button [ onClick Increment ] [ text "+" ]
        ]
