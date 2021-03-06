import React from "react";
import { ConnectedRouter } from "react-router-redux";
import {
  Route,
  Switch
  // Redirect
} from "react-router-dom";
import { Provider } from "react-redux";
import PropTypes from "prop-types";

import App from "./containers/App";

import NotFound from "./containers/NotFound";
import Home from "./containers/Home";
import Search from "./containers/Search";
import Restaurant from "./containers/Restaurant";
import Item from "./containers/Item";
import RestaurantListing from "./containers/RestaurantListing";
import Cart from "./containers/Cart";
import Customer from "./containers/Customer";
// import Order from "./containers/Customer/Order";
import Checkout from "./containers/Checkout";
import PasswordReset from "./containers/PasswordReset";
import VerifyPhone from "./containers/VerifyPhone";

// stateless component
const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route
            exact
            path="/"
            // render={()=><Redirect to="/restaurant" />}
            component={Home}
          />
          <Route exact path="/search" component={Search} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/checkout" component={Checkout} />
          <Route exact path="/restaurant" component={RestaurantListing} />
          <Route path="/customer" component={Customer} />
          <Route exact path="/password-reset" component={PasswordReset} />
          <Route exact path="/verify-phone" component={VerifyPhone} />
          <Route exact path="/:outlet_slug" component={Restaurant} />
          <Route exact path="/:outlet_slug/:item_slug" component={Item} />
          <Route component={NotFound} />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Root;
