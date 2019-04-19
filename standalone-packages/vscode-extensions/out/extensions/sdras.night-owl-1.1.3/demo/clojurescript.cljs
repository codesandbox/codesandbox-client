(ns hello.world.clojurescript
  (:require [reagent.core :as r])

(def counter (r/atom 0))
(def text-component-style {:background-color :grey
                           :border "1px solid black"
                           :padding "5px"})

(defn counter-clicked []
  (.log js/console "You clicked the counter component.")
  (swap! counter inc))

(defn text-counter [text]
  [:div {:on-click counter-clicked
         :style text-component-style})
    (str text @counter])

(defn main-component []
  [:div
    [:p {:style {:color :red}} "Hello world! Click the element below:"]
    [text-counter "Clicked: "]])
