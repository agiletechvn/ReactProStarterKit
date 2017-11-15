import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";

// reactstrap
import { Table } from "reactstrap";

// components
import CardItem from "../CardItem";
import ModalConfirm from "~/ui/components/ModalConfirm";

import * as orderSelectors from "~/store/selectors/order";
import * as orderActions from "~/store/actions/order";


import {getItemPrice} from "~/ui/utils";

@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state)
  }),
  orderActions
)
export default class extends Component {

  constructor(props) {
    super(props);
  
    this.selectedItem = null;
  }

  increaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity + 1 });
  }

  decreaseOrder(item) {
    this.props.updateOrderItem({ ...item, quantity: item.quantity - 1 });
  }

  removeOrder(item) {    
    this.selectedItem = item;
    this.modal.open();
  }

  handleCancelModal=()=>{
    this.modal.close();
  };

  handleConfirmModal=()=>{
    this.props.removeOrderItem(this.selectedItem);
    this.modal.close();
  };

  render() {
    const { orderItems, t } = this.props;
    return [
      <Table key="cartList" className="mt-4 text-uppercase table-fixed table-responsive">
        <thead className="color-gray">
          <tr>
            <th className="pl-0 card-title">{t("TABLE.ITEM")}</th>
            <th>{t("TABLE.UNIT_PRICE")}</th>
            <th className="text-center">{t("TABLE.QUANTITY")}</th>
            <th>Vat</th>
            <th>{t("TABLE.TOTAL")}</th>
            <th className="text-center">{t("TABLE.DELETE")}</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map(item => (
            <CardItem
              key={item.item_uuid}
              uuid={item.item_uuid}
              title={item.name}
              image="/images/donut-square.png"
              vat={0}
              price={getItemPrice(item)}
              options={item.item_options}
              priceUnit={item.currency_symbol}
              quantity={item.quantity}
              onIncrease={() => this.increaseOrder(item)}
              onDecrease={() => this.decreaseOrder(item)}
              onRemove={() => this.removeOrder(item)}
            />
          ))}
        </tbody>
      </Table>,
        <ModalConfirm key="modal" onItemRef={ref=>this.modal = ref} 
          onCancel={this.handleCancelModal}
          onOK={this.handleConfirmModal} 
        >
          {t('LABEL.CONFIRM_REMOVE_CART_ITEM')}
        </ModalConfirm>
      ];
  }
}