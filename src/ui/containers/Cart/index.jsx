import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import moment from "moment";

import { Helmet } from "react-helmet";
import { isMobile } from "~/utils";

// redux form
import {
  Field,
  Fields,
  // FieldArray,
  reduxForm,
  SubmissionError
} from "redux-form";

// reactstrap
import {
  Button,
  // FormGroup,
  // Label,
  // Input,
  // DropdownItem,
  Alert
} from "reactstrap";

// import { DirectionsRenderer, Marker } from "react-google-maps";

// components
import { InputField } from "~/ui/components/ReduxForm";
import CardList from "./components/CardList";
import RequestTimeField from "./components/Field/RequestTime";
import OrderTypeField from "./components/Field/OrderType";
import OrderPricesField from "./components/Field/OrderPrices";
import DirectionGmapField from "./components/Field/DirectionGmap";
// import GoogleMapKey from "~/ui/components/GoogleMapKey";
// import Autocomplete from "~/ui/components/Autocomplete";
import ButtonRound from "~/ui/components/Button/Round";
import TopFilter from "~/ui/components/TopFilter";

import * as orderSelectors from "~/store/selectors/order";
import * as orderActions from "~/store/actions/order";
import * as commonActions from "~/store/actions/common";
// import { GOOGLE_API_KEY } from "~/store/constants/api";
// import { fetchJson } from "~/store/api/common";
import { history } from "~/store";

import {
  ORDER_TYPE,
  parseJsonToObject,
  calculateOrderPrice
  // getCurrentLocation
} from "~/utils";

import { validate, getOrderTypeValue } from "./utils";

import "./index.css";

@translate("translations")
@connect(
  state => ({
    orderItems: orderSelectors.getItems(state),
    orderInfo: orderSelectors.getInfo(state),
    initialValues: { ...orderSelectors.getInfo(state), order_note: "" }
  }),
  { ...commonActions, ...orderActions }
)
// do not allow enableReinitialize because we will update state from components inside
@reduxForm({
  form: "Checkout",
  validate,
  destroyOnUnmount: true,
  enableReinitialize: false
})
export default class extends Component {
  constructor(props) {
    super(props);
    this.directions = null;

    // this.props.updateOrder({
    //   restaurant_lat:21.0687001,
    //   restaurant_long:105.82295049999993,
    // });

    this.orderTypes = [];
    props.orderInfo.do_takeaway &&
      this.orderTypes.push({ id: ORDER_TYPE.TAKE_AWAY, title: "Take away" });
    props.orderInfo.do_delivery &&
      this.orderTypes.push({ id: ORDER_TYPE.DELIVERY, title: "Delivery" });

    this.state = {
      directions: null
    };
  }

  saveOrderInfo = data => {
    const { orderInfo, orderItems, t, setToast } = this.props;
    let travel_time = 0;
    if (!data.order_type) {
      data.order_type = ORDER_TYPE.DELIVERY;
    }

    if(data.order_type === ORDER_TYPE.DELIVERY){
      if (this.directions) {
        const { duration, distance } = this.directions.routes[0].legs[0];
        travel_time = duration.value / 60;
        if (
          +orderInfo.delivery_distance &&
          1000 * +orderInfo.delivery_distance < distance.value
        ) {

          setToast(t("LABEL.DISTANCE_TOO_FAR"), "danger");
          return;
        }
      }

      //if (!data.request_time) {
      //  setToast("Can not delivery due to time!", "danger");
      //  return;
      //}

      const orderPrices = calculateOrderPrice(orderItems, orderInfo);

      if (
        orderInfo.min_delivery_cost &&
        orderPrices.total < orderInfo.min_delivery_cost
      ) {
        setToast(t("LABEL.PRICE_TOO_LOW"), "danger");
        return;
      }
      if (
        orderInfo.max_delivery_cost &&
        orderPrices.total > orderInfo.max_delivery_cost
      ) {
        setToast(t("LABEL.PRICE_TOO_HIGH"), "danger");
        return;
      }
    }

    this.props.updateOrder({ ...data, travel_time , request_time: Date.now()/1000});
    history.push("/checkout");
  };

  // componentDidMount() {
  //   const { orderInfo } = this.props;
  //   if (!orderInfo.order_lat && !orderInfo.order_lat) {
  //     this.loadAddressFromGmap();
  //   }
  // }

  handleReceiveAddress = (order_lat, order_long, order_address) => {
    this.props.updateOrder({
      order_lat,
      order_long,
      order_address
    });
  };

  renderTimePicker = ({ request_time, order_type }) => {
    const { orderInfo, t } = this.props;

    const orderTypeValue = getOrderTypeValue(
      order_type.input.value,
      this.orderTypes
    );

    const hoursRange = parseJsonToObject(
      orderTypeValue === ORDER_TYPE.TAKE_AWAY
        ? orderInfo.hours_takeaway
        : orderInfo.hours_delivery
    );

    return (
      <div className="d-md-flex justify-content-between">
        <OrderTypeField
          checkedValue={orderTypeValue}
          orderTypes={this.orderTypes}
          {...order_type}
        />
        <div>
          <RequestTimeField
            label={t(
              orderTypeValue === ORDER_TYPE.DELIVERY
                ? "LABEL.DELIVERY"
                : "LABEL.TAKEAWAY"
            )}
            hoursRange={hoursRange}
            {...request_time}
          />
        </div>
      </div>
    );
  };

  onSelectTopFilter = (id, value) => {
    if(id === 'order_type'){
      const {
        orderInfo
        } = this.props;

      this.props.updateOrder({...orderInfo, order_type: value[0]});
    }
  }

  render() {
    const {
      orderItems,
      t,
      handleSubmit,
      // change,
      // submitting,
      orderInfo,
      clearItems,
      error
    } = this.props;

    const { directions } = this.state;

    if (!orderItems || !orderItems.length) {
      return (
        <div className="text-center p-2">
          <img src="/images/no-data.png" height="100" alt="" />
          <p className="color-gray text-uppercase">
            {t("LABEL.SHOPPING_CART_EMPTY")}
          </p>
        </div>
      );
    }

    const initOrders = this.orderTypes.map(el => ({
      name: el.title,
      value: el.id
    }));

    const orderTime = Date.now();
    let deliveryTime = null;
    if (directions)
      deliveryTime =
        orderTime + directions.routes[0].legs[0].duration.value * 1000;

    const orderPrices = calculateOrderPrice(orderItems, orderInfo);
    const currency_symbol = orderItems[0].currency_symbol;

    let filterCategories = [
      {
        id: "order_type",
        title: t("BUTTON.FILTER.ORDERING_METHODS"),
        type: "radio",
        values: initOrders,
        selected: orderInfo.order_type,
        placement: "bottom",
        showResult: 1,
        multiple: 0
      },
      {
        id: "order_time",
        title: "Order time " + moment(orderTime).format('HH.mm'),
        type: "label"
      }
    ];

    if(orderInfo.order_type === ORDER_TYPE.DELIVERY){
      filterCategories = filterCategories.concat([
        {
          id: "distance",
          title: "Distance " + (directions ? directions.routes[0].legs[0].distance.text : ""),
          type: "label"
        },
        {
          id: "delivery_time",
          title: deliveryTime? "delivery time " + moment(deliveryTime).format('HH.mm') : "-",
          type: "label"
        }
      ]);
    }

    return (
      <div className="your-cart map-background">
        <Helmet>
          <title>{t("LABEL.YOUR_CART")}</title>
          <meta name="description" content={t("LABEL.YOUR_CART")} />
        </Helmet>

        <TopFilter
          onSelected={this.onSelectTopFilter}
          categories={filterCategories}
        />

        <div className="container box-shadow">
          <div className="block bg-white p-0 your-cart-1">
            <div className="">
              {
                //<Fields
                //  names={["order_type", "request_time"]}
                //  component={this.renderTimePicker}
                ///>
              }

              <Fields
                names={["order_type", "order_address"]}
                orderTypes={this.orderTypes}
                orderInfo={orderInfo}
                orderItems={orderItems}
                onReceiveAddress={this.handleReceiveAddress}
                onReceiveDirections={directions => {
                  this.directions = directions;
                  this.setState({ directions });
                }}
                component={DirectionGmapField}
              />
            </div>

            {
              //<nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
              //  <a
              //    role="button"
              //    onClick={history.goBack}
              //    className="breadcrumb-item color-gray-400"
              //  >
              //    &lt; {t("LINK.BACK")}
              //  </a>
              //</nav>
              //<h2 className="w-100 text-uppercase font-weight-bold color-black d-flex">
              //  {t("LABEL.YOUR_CART")}
              //  <ButtonRound className="ml-4" onClick={clearItems} icon="times" />
              //</h2>
            }
          </div>
          <div className="block your-cart-2">
            <div className="block">
              <CardList />
            </div>
            <div className="ml-4 mb-2 text-uppercase font-fr-120 color-cg-074">
              Add a note
            </div>
            <div className="d-md-flex flex-md-row">
              <div className="your-cart-note">
                <div className="">
                  <Field
                    name="order_note"
                    type="textarea"
                    className="w-100"
                    component={InputField}
                  />
                </div>
              </div>

              <div className="w-100 ml-md-5">
                <div className="d-flex justify-content-between text-uppercase font-fr-140 color-cg-074">
                  <div>subtotal</div>
                  <div>{
                    t("format.currency", {
                      price: orderPrices.subtotal,
                      symbol: currency_symbol
                    })
                  }</div>
                </div>
                {orderInfo.order_type === ORDER_TYPE.DELIVERY &&
                <div className="mt-md-4 d-flex justify-content-between text-uppercase font-fr-140 color-cg-074">
                  <div>delivery fee</div>
                  <div>{
                    t("format.currency", {
                      price: orderPrices.fee,
                      symbol: currency_symbol
                    })
                  }</div>
                </div>
                }
                <div className="mt-md-4 d-flex justify-content-between text-uppercase font-fr-160">
                  <div className="color-cg-040">total price</div>
                  <div className="color-red">{
                    t("format.currency", {
                      price: orderPrices.total,
                      symbol: currency_symbol
                    })
                  }</div>
                </div>
                <div className="mt-md-5 pt-md-3">
                  <Button
                    className="your-cart-btn-continue text-uppercase"
                    onClick={handleSubmit(this.saveOrderInfo)}
                  >
                    {t("BUTTON.CONTINUE")}
                  </Button>
                </div>
              </div>
            </div>
            {
              //  <CardList />
              //
              //  <div className="row border p-2 no-gutters">
              //
              //
              //  <div className="col">
              //  <h6 className="color-gray text-uppercase mb-4">
              //{t("LABEL.ADD_NOTE")}
              //  </h6>
              //  <Field
              //  name="order_note"
              //  type="textarea"
              //  className="w-100 border-gray-300"
              //  component={InputField}
              //  />
              //
              //  <Field
              //  orderInfo={orderInfo}
              //  orderItems={orderItems}
              //  name="order_type"
              //  component={OrderPricesField}
              //  />
              //  {
              //    // <Field
              //    //   placeholder={t("PLACEHOLDER.TYPE_YOUR_PROMO_CODE")}
              //    //   className="custom-input text-uppercase"
              //    //   name="order_promotion_code"
              //    //   component={InputField}
              //    // />
              //  }
              //  </div>
              //  </div>
              //
              //  <div className="my-4 row no-gutters justify-content-end">
              //  <Button
              //  className="bg-red col-md-3 btn-lg btn-block text-uppercase border-0"
              //  onClick={handleSubmit(this.saveOrderInfo)}
              //  >
              //  {t("BUTTON.PAY_NOW")}
              //  </Button>
              //  </div>
              //
              //  {error && <Alert color="danger">{error}</Alert>}
            }
          </div>
        </div>
      </div>
    );
  }
}
