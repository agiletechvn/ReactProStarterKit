import { takeLatest, takeEvery, all } from "redux-saga/effects";

import api from "~/store/api";
import { createRequestSaga, takeRequest } from "~/store/sagas/common";
import { setToast, forwardTo } from "~/store/actions/common";

import {
  setAuthState,
  saveLoggedUser,
  removeLoggedUser,
  // deleteAddress,
  updateCustomer,
  addAddress,
  updateAddress
} from "~/store/actions/auth";

// const requestLoginFacebook = createRequestSaga({
//   request: api.auth.loginFacebook,
//   key: 'loginFacebook',
//   cancel: 'app/logout',
//   success: [
//     (data) => saveLoggedUser(data),
//     () => setAuthState(true),
//     () => setToast('Logged successfully!!!'),
//     // () => forwardTo('/dashboard'),
//   ],
//   failure: [
//     () => setToast('Couldn\'t login', 'danger')
//   ],
// })

// const requestLoginGoogle = createRequestSaga({
//   request: api.auth.loginGoogle,
//   key: 'loginGoogle',
//   cancel: 'app/logout',
//   success: [
//     (data) => saveLoggedUser(data),
//     () => setAuthState(true),
//     () => setToast('Logged successfully!!!'),
//     // () => forwardTo('/dashboard'), // action creator may return nothing to match
//   ],
//   failure: [
//     () => setToast('Couldn\'t login', 'danger')
//   ],
// })

const requestLogin = createRequestSaga({
  request: api.auth.login,
  key: "login",
  cancel: "app/logout",
  success: [
    ({ data }) => saveLoggedUser(data),
    () => setAuthState(true),
    () => setToast("Logged successfully!!!")
    // () => forwardTo('/customer/profile'), // action creator may return nothing to match
  ],
  failure: [
    // () => setToast('Couldn\'t login', 'danger')
  ]
});

const requestSignup = createRequestSaga({
  request: api.auth.signup,
  key: "signup",
  cancel: "app/login",
  success: [() => setToast("Create Account successfully!!!")],
  failure: [() => setToast("Couldn't create account", "danger")]
});

const requestLogout = createRequestSaga({
  request: api.auth.logout,
  key: "logout",
  success: [() => setToast("Logout successfully!!!")],
  failure: [() => setToast("Couldn't logout", "danger")],
  stop: [
    () => removeLoggedUser(),
    () => setAuthState(false),
    () => forwardTo("/restaurant")
  ]
});

const requestUpdateCustomer = createRequestSaga({
  request: api.auth.updateCustomer,
  success: [({ data }) => updateCustomer(data)],
  failure: [() => setToast("Couldn't update customer", "danger")]
});

const requestUpdateAddress = createRequestSaga({
  request: api.auth.updateAddress,
  success: [({ data }) => updateAddress(data)]
});

const requestAddAddress = createRequestSaga({
  request: api.auth.addAddress,
  success: [({ data }) => addAddress(data)]
});

const requestDeleteAddress = createRequestSaga({
  request: api.auth.deleteAddress
});

const requestResetPassword = createRequestSaga({
  request: api.auth.resetPassword
});

// root saga reducer
const asyncAuthWatchers = [
  // like case return, this is take => call
  // inner function we use yield*
  // from direct watcher we just yield value
  function* asyncLoginFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      // takeLatest('app/loginFacebook', requestLoginFacebook),
      // takeLatest('app/loginGoogle', requestLoginGoogle),
      takeLatest("app/login", requestLogin),
      takeLatest("app/signup", requestSignup),

      // customer
      takeEvery("customer/requestAddAddress", requestAddAddress),
      takeEvery("customer/requestUpdateAddress", requestUpdateAddress),
      takeEvery("customer/requestDeleteAddress", requestDeleteAddress),
      takeLatest("customer/requestUpdateCustomer", requestUpdateCustomer),
      takeLatest("customer/resetPassword", requestResetPassword),

      // actions that do not update store
      takeRequest("customer/resendPhoneCode", api.auth.resendPhoneCode),
      takeRequest("customer/verifyPhoneCode", api.auth.verifyPhoneCode)
    ]);
  },

  function* asyncLogoutFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([takeLatest("app/logout", requestLogout)]);
  }
];

export default asyncAuthWatchers;
