module ModuleExample exposing (..)

import Html exposing (Html, div, button, text)


viewCounter : Int -> Html msg
viewCounter model =
    text (String.fromInt model)
