// React
import React from "react";
import { render } from "react-dom";

// bootstrap & font-awesome & google font
import "bootstrap/dist/css/bootstrap.min.css";
import 'font-awesome/css/font-awesome.min.css';
import "typeface-montserrat";

import registerServiceWorker from "./registerServiceWorker";
// import injectTapEventPlugin from 'react-tap-event-plugin'
import i18n from "./i18n";

import Root from "./ui";
import configureStore, { history } from "./store";
import * as authSelectors from "./store/selectors/auth";

const rootElement = document.getElementById("root");

// Needed for onTouchTap
// https://github.com/zilverline/react-tap-event-plugin
// injectTapEventPlugin()

// work offline WPA
registerServiceWorker();

// config for store
configureStore(
  store => {
    // const history = syncHistoryWithStore(browserHistory, store)

    // scroll to top on new location, but preserve scroll position on back action
    // for better user-experience, do this on OnChange event of router, when component is rendered
    history.listen(
      location => location.action !== "POP" && window.scrollTo(0, 0)
    );

    // update language from i18n to store
    i18n.on("languageChanged", lng => {
      const currentLanguage = authSelectors.getCustomer(store.getState()).language;
      if (currentLanguage !== lng) {        
        store.dispatch({
          type: "app/setLanguage",
          payload: lng
        });
      }
    });

    // ready to render
    render(<Root store={store} history={history} />, rootElement);

    // enable hot reload for react code
    if (module.hot) {
      // tracking css changes
      // tracking code changes
      module.hot.accept("./ui", () => {
        // if we use es2015 => this is native so there will be cache, we have to use another instance
        // to force rebuild, other wise just use prev Root
        // this NextRoot is other Component to render, start tracking with inside AppContainer
        const NextRoot = require("./ui").default;
        render(<NextRoot store={store} history={history} />, rootElement);
      });
    }
  },
  err => {
    render(<h1 style={{ color: "red" }}>{err}</h1>, rootElement);
  }
);