module Import (parse, Import, Exposed(..)) where

import Regex exposing (find, HowMany(..), Match, regex)
import Array
import String
import Set
import Dict


parse : String -> Dict.Dict String Import
parse source = search source
    |> List.map .submatches
    |> List.map process
    |> imports


imports : List RawImport -> Dict.Dict String Import
imports rawImports =
    let toDict list =
            Dict.union (Dict.fromList (List.map toImport list)) defaultImports
    in
        toDict rawImports


(=>) name exposed =
    (name, Import Nothing exposed)


defaultImports : Dict.Dict String Import
defaultImports =
    Dict.fromList
        [ "Basics" => Every
        , "List" => Some (Set.fromList ["List", "::"])
        , "Maybe" => Some (Set.singleton "Maybe")
        , "Result" => Some (Set.singleton "Result")
        , "Signal" => Some (Set.singleton "Signal")
        ]


type alias RawImport =
    { name : String
    , alias : Maybe String
    , exposed : Maybe (List String)
    }


type alias Import =
    { alias : Maybe String, exposed : Exposed }


type Exposed = None | Some (Set.Set String) | Every


toImport : RawImport -> (String, Import)
toImport { name, alias, exposed } =
    let exposedSet =
            case exposed of
                Nothing -> None
                Just [".."] -> Every
                Just vars -> Some (Set.fromList vars)
    in
        (name, Import alias exposedSet)


join : Maybe (Maybe a) -> Maybe a
join mx =
    case mx of
        Just x -> x
        Nothing -> Nothing


exposes : String -> Maybe (List String)
exposes s =
    if s == ""
    then Nothing
    else String.split "," s |> List.map String.trim |> Just
        

process : List (Maybe String) -> RawImport
process submatches =
    let submatches' = Array.fromList submatches
        name = Maybe.withDefault "" (join (Array.get 0 submatches'))
        alias = join (Array.get 1 submatches')
        exposedStart = Maybe.withDefault "" (join (Array.get 2 submatches'))
        exposedEnd = Maybe.withDefault "" (join (Array.get 3 submatches'))
        exposed = (exposedStart ++ exposedEnd) |> String.trim |> exposes
    in
        { name = name, alias = alias, exposed = exposed }


search : String -> List Match
search file = find All pattern file


pattern = regex "(?:^|\\n)import\\s([\\w\\.]+)(?:\\sas\\s(\\w+))?(?:\\sexposing\\s*\\(((?:\\s*(?:\\w+|\\(.+\\))\\s*,)*)\\s*((?:\\.\\.|\\w+|\\(.+\\)))\\s*\\))?"
