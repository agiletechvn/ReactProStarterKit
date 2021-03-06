/* eslint-disable */

import { takeLatest, takeEvery, all } from "redux-saga/effects";

import api from "~/store/api";
import { setToast } from "~/store/actions/common";
import { saveRestaurants } from "~/store/actions/restaurant";

import { createRequestSaga, takeRequest } from "~/store/sagas/common";

const requestGetOutlets = createRequestSaga({
  request: api.restaurant.getOutlets,
  key: "getRestaurantOutlet",
  success: [data => saveRestaurants(data)],
  failure: [() => setToast("Couldn't get data", "danger")]
});

// root saga reducer
export default [
  // watcher for schedule, define term here
  function* asyncUserFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeRequest("restaurant/getOutlet", api.restaurant.getOutlet),
      takeLatest("restaurant/getOutlets", requestGetOutlets),
      takeRequest("restaurant/searchOutlet", api.restaurant.searchOutlet),
      takeRequest(
        "restaurant/getCategories",
        {
          request: api.restaurant.getCategories,
          cancel: ["@@router/LOCATION_CHANGE"]
        },
        true
      ),
      takeRequest(
        "restaurant/getAllCategories",
        api.restaurant.getAllCategories
      ),
      takeRequest("restaurant/getProductByCategory", {
        request: api.restaurant.getProductByCategory,
        cancel: ["@@router/LOCATION_CHANGE"]
      }),
      takeRequest("restaurant/getProductByCategories", {
        request: api.restaurant.getProductByCategories,
        cancel: ["@@router/LOCATION_CHANGE"]
      }),
      takeRequest(
        "restaurant/getProductFeatured",
        api.restaurant.getProductFeatured
      ),
      takeRequest(
        "restaurant/getRestaurantTag",
        api.restaurant.getRestaurantTag
      ),
      takeRequest("restaurant/getItem", api.item.getDetail)
    ]);
  }
];
