export const MODULE = `-- Comments should be ignored
module Module where
-- Imports should be ignored
import Html exposing (..)

type alias TypeAlias = String

type Type = Constructor1 | Constructor2

function : TypeAlias -> TypeAlias
function ta = ta ++ ta

(%%) : TypeAlias -> TypeAlias
(%%) = function
infixr 7 %%

port somePort : Signal Int
port somePort = Signal.constant 0

multiLineFunction : Type -> String
multiLineFunction someType =
  case someType of

    Constructor1 ->
      "This one"

    Constructor2 ->
      "That one"
`
