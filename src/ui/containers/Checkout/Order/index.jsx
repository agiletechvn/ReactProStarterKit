import React, { Component } from "react";
import classNames from "classnames";
// import { 
//   Button, Form, FormGroup, Label, Input, FormText 
// } from "reactstrap";
import { translate } from "react-i18next";

import { calculateOrderPrice } from "~/ui/utils";

@translate("translations")
export default class extends Component {

  renderCurrency(label, price, className, symbol = "₫"){
      const {t} = this.props;
      return (
        <dl className={classNames("d-flex justify-content-start mb-0", className)}>
            <dt className="p-2">{label}</dt>
            <dd className="ml-auto p-2 font-weight-bold">
              {t("format.currency", {
                price,
                symbol
              })}
            </dd>
          </dl>
      )
  }


  render() {
    const { orderItems, orderInfo, t } = this.props;

    const orderPrices =  calculateOrderPrice(orderItems, orderInfo);
    const currency_symbol = orderItems[0].currency_symbol;

    const orderItemsWithTotalPrice = orderItems.map(item => ({
      ...item,
      totalPrice: item.quantity * item.price
    }));
    

    return (
      <div>
        <h4>{t("LABEL.YOUR_ORDER")}</h4>
        {orderItemsWithTotalPrice.map(item => (
          <div className="d-flex justify-content-start" key={item.item_uuid}>
            <div className="p-2">{item.quantity}x</div>
            <div className="p-2">{item.name}</div>
            <div className="ml-auto p-2">
              {t("format.currency", {
                price: item.totalPrice,
                symbol: item.currency_symbol
              })}
            </div>
          </div>
        ))}        
        
        <hr/>


          {this.renderCurrency(
                "LABEL.SUBTOTAL",
                orderPrices.subtotal,
                "color-gray",
                currency_symbol
              )}
              {this.renderCurrency(
                "Discount",
                orderPrices.discount,
                "color-gray",
                currency_symbol
              )}
              {this.renderCurrency(
                "Delivery free",
                orderPrices.fee,
                "color-gray",
                currency_symbol
              )}
              {this.renderCurrency(
                "Tax",
                orderPrices.tax,
                "color-gray",
                currency_symbol
              )}
              {this.renderCurrency(
                "LABEL.TOTAL_PRICE",
                orderPrices.total,
                "color-black",
                currency_symbol
              )}

      </div>
    );
  }
}