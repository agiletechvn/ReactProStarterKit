import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import {
  Button
  // DropdownItem
} from "reactstrap";

// components
import AccountDropdown from "./components/AccountDropdown";
// import ButtonRound from "~/ui/components/Button/Round";
import LoginModal from "~/ui/components/LoginModal";
import Suggestion from "~/ui/components/Suggestion";
import PopoverCart from "./components/PopoverCart";
import Drawer from "~/ui/components/Drawer";
import ModalConfirm from "~/ui/components/ModalConfirm";
import ProcessCheckoutModal from "./components/ProcessCheckoutModal";

// selectors && actions
// import { history } from "~/store";
import * as orderActions from "~/store/actions/order";
import * as authSelectors from "~/store/selectors/auth";
import * as orderSelectors from "~/store/selectors/order";
import * as commonActions from "~/store/actions/common";
import { isMobile } from "~/utils";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    isHome: state.routing.location.pathname === "/",
    isLogged: authSelectors.isLogged(state),
    orderInfo: orderSelectors.getInfo(state),
    orderItems: orderSelectors.getItems(state)
  }),
  {...commonActions, ...orderActions}
)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawerOpen: false
    };

    this.selectedItem = null;
  }

  toggleDrawer = () => {
    const { drawerOpen } = this.state;
    document.querySelector("body").style.overflow = drawerOpen
      ? "auto"
      : "hidden";
    this.setState({
      drawerOpen: !drawerOpen
    });
  };

  onChangeQuantity = (item, quantity) => {
    const number = Number(quantity);
    if(typeof number !== 'number' || !Math.floor(number) || number < 1) return;
    this.props.updateOrderItem({...item, quantity: number});
  }

  increaseOrder = item => {
    this.props.updateOrderItem({...item, quantity: item.quantity + 1});
  };

  decreaseOrder = item => {
    this.selectedItem = item;
    if (item.quantity === 1) {
      // if (window.confirm("Do you want to remove this item?")) {
      //   this.props.removeOrderItem(item);
      // }
      this.modal.open();
    } else {
      this.props.updateOrderItem({...item, quantity: item.quantity - 1});
    }
  };

  handleCancelModal = () => {
    this.modal.close();
  };

  handleConfirmModal = () => {
    this.props.removeOrderItem(this.selectedItem);
    this.modal.close();
  };

  render() {
    const { t, isHome, isLogged, orderItems, orderInfo } = this.props;
    const { drawerOpen } = this.state;
    const totalQuantity = orderItems.reduce((a, item) => a + item.quantity, 0);
    return (
      <div>
        <nav
          className={classNames("navbar fixed-top header", {
            // invisible: isHome
          })}
        >
          <div className="container p-4 my-0 d-flex justify-content-between">
            <div className="d-flex">
              {isMobile ? (
                <span className="navbar-brand" onClick={this.toggleDrawer}>
                  <img src="/images/logo.png" alt=""/>
                  <i
                    className={classNames(
                      "color-red ml-2 fa",
                      drawerOpen ? "fa-angle-up" : "fa-angle-down"
                    )}
                  />
                </span>
              ) : (
                <Link className="navbar-brand" to="/">
                  <img src="/images/logo.png" alt=""/>
                </Link>
              )}

              {!isHome && (
                <Suggestion
                  buttonClass="border-0"
                  inputClass={classNames(
                    { "font-medium": isMobile },
                    "color-cg-040 font-fr-170 pl-2"
                  )}
                  //prepend={
                  //  <i className="fa fa-search color-black-300 mr-2 icon-search" />
                  //}
                  className="d-flex align-items-center header-suggestion"
                />
              )}
            </div>

            <div className="d-flex align-items-center flex-row">
              <Button
                id="popoverCartBtn"
                className="btn-round bg-red border-0"
                onClick={() =>
                  // isMobile ? history.push('/cart') :
                  this.processCheckoutModal.toggle()}
              >
                <i
                  className="fa fa-shopping-cart color-white"
                  aria-hidden="true"
                  id="cart-icon"
                />
                <span className="badge bg-red">{totalQuantity}</span>
              </Button>

              {
                // !isMobile &&
                //<PopoverCart
                //  placement="bottom-start"
                //  target="popoverCartBtn"
                //  orderInfo={orderInfo}
                //  orderItems={orderItems}
                //  onIncreaseOrder={this.increaseOrder}
                //  onDecreaseOrder={this.decreaseOrder}
                //  onItemRef={ref => (this.popoverCart = ref)}
                ///>
              }

              {!isLogged ? (
                <Button
                  onClick={() => this.loginModal.toggle()}
                  className="header-btn-login btn-outline-danger btn-sm text-capitalize ml-4"
                >
                  {t("LINK.FOOTER.LOGIN")}
                </Button>
              ) : (
                <AccountDropdown />
              )}
            </div>

            <ProcessCheckoutModal
              orderInfo={orderInfo}
              orderItems={orderItems}
              className="process-checkout-modal"
              onItemRef={ref => (this.processCheckoutModal = ref)}
              requestor={this.props.requestor}
              onIncreaseOrder={this.increaseOrder}
              onDecreaseOrder={this.decreaseOrder}
              onChangeQuantity={this.onChangeQuantity}
            />
            <LoginModal className="login-modal" onItemRef={ref => (this.loginModal = ref)}/>
          </div>
        </nav>
        {isMobile && <Drawer className={classNames({ hidden: !drawerOpen })}/>}

        <ModalConfirm
          key="modal"
          onItemRef={ref => (this.modal = ref)}
          onCancel={this.handleCancelModal}
          onOK={this.handleConfirmModal}
        >
          {t("LABEL.CONFIRM_REMOVE_CART_ITEM")}
        </ModalConfirm>
      </div>
    );
  }
}
