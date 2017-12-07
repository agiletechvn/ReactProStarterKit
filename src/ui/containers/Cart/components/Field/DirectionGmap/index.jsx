import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { connect } from "react-redux";
import { translate } from "react-i18next";
// import classNames from "classnames";

// import { Helmet } from "react-helmet";

// redux form
// import {
// Field,
// Fields,
// FieldArray,
// reduxForm,
// SubmissionError
// } from "redux-form";

// reactstrap
import {
  Button,
  // FormGroup,
  // Label,
  // Input,
  DropdownItem
  // Alert
} from "reactstrap";

import { DirectionsRenderer, Marker } from "react-google-maps";

// components
import GoogleMapKey from "~/ui/components/GoogleMapKey";
import Autocomplete from "~/ui/components/Autocomplete";
// import ButtonRound from "~/ui/components/Button/Round";

// import * as orderSelectors from "~/store/selectors/order";
// import * as orderActions from "~/store/actions/order";
import { GOOGLE_API_KEY } from "~/store/constants/api";
import { fetchJson } from "~/store/api/common";

import {
  ORDER_TYPE,
  // parseJsonToObject,
  // calculateOrderPrice,
  getCurrentLocation
} from "~/utils";

import { getOrderTypeValue } from "../../../utils";

@translate("translations")
// @connect(null, orderActions)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      predictions: [],
      overlay: null
    };
  }

  initGmap = ref => {
    this.googleMap = ref;
    this.Maps = window.google.maps;
    this.directionsService = new this.Maps.DirectionsService();
    this.placeService = new this.Maps.places.AutocompleteService();
    this.geocoder = new this.Maps.Geocoder();
    const { order_lat, order_long } = this.props.orderInfo;
    this.loadDirectionFromGmap(order_lat, order_long);
  };

  async loadAddressFromGmap() {
    // use guard code so do not have to remove } at the end
    this.loadingIcon && this.loadingIcon.classList.remove("hidden");
    // const { lat, lng } = this.state;
    const { latitude: lat, longitude: lng } = await getCurrentLocation();
    const { results } = await fetchJson(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    this.loadingIcon && this.loadingIcon.classList.add("hidden");
    this.props.onReceiveAddress &&
      this.props.onReceiveAddress(lat, lng, results[0].formatted_address);
    // this.props.updateOrder({
    //   order_lat: lat,
    //   order_long: lng,
    //   order_address: results[0].formatted_address
    // });
    this.loadDirectionFromGmap(lat, lng);
  }

  async loadDirectionFromGmap(lat, long) {
    const { orderInfo, t } = this.props;
    const originLat = +orderInfo.restaurant_lat;
    const originLong = +orderInfo.restaurant_long;
    if (lat && long && originLat && originLong && this.directionsService) {
      this.directionsService.route(
        {
          origin: new this.Maps.LatLng(originLat, originLong),
          destination: new this.Maps.LatLng(lat, long),
          travelMode: this.Maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === this.Maps.DirectionsStatus.OK) {
            this.setState({
              directions: result
            });
            this.props.onReceiveDirections &&
              this.props.onReceiveDirections(result);
          } else {
            console.error(
              `error fetching directions ${JSON.stringify(result)}`
            );
          }
        }
      );
    } else {
      this.setState({
        overlay: t("LABEL.NOT_DETERMINE_ROUTE")
      });
    }
  }

  componentDidMount() {
    const { orderInfo } = this.props;
    if (!orderInfo.order_lat && !orderInfo.order_lat) {
      this.loadAddressFromGmap();
    }
  }

  renderAddressLabel(label, address) {
    return (
      <h6 className="color-gray text-uppercase mb-4 w-100">
        {label}:
        <span className="color-gray-400 ml-2">{address}</span>
      </h6>
    );
  }

  searchGoogleMap = keywords => {
    if (!keywords.length || this.isSearching) return;
    this.isSearching = true;
    this.placeService.getQueryPredictions(
      { input: keywords },
      (predictions, status) => {
        if (status === this.Maps.places.PlacesServiceStatus.OK) {
          this.setState({
            predictions
          });
        } else {
          this.setState({
            predictions: []
          });
        }
        this.isSearching = false;
      }
    );
  };

  chooseAddress(description) {
    this.geocoder.geocode({ address: description }, (results, status) => {
      if (status === this.Maps.GeocoderStatus.OK) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();

        this.props.onReceiveAddress &&
          this.props.onReceiveAddress(lat, lng, description);

        // this.props.updateOrder({
        //   order_lat: lat,
        //   order_long: lng,
        //   order_address: description
        // });
        this.loadDirectionFromGmap(lat, lng);
      }
    });
  }

  render() {
    const {
      t,
      orderInfo,
      order_type,
      order_address,
      orderTypes
      // error
    } = this.props;

    const { directions, predictions } = this.state;
    const position = {
      lat: +orderInfo.restaurant_lat,
      lng: +orderInfo.restaurant_long
    };

    const orderTypeValue = getOrderTypeValue(
      order_type.input.value,
      orderTypes
    );

    return (
      <div>
        {this.renderAddressLabel(
          t("LABEL.BUSINESS_ADDRESS"),
          orderInfo.restaurant_address
        )}

        {orderTypeValue === ORDER_TYPE.DELIVERY && (
          <div>
            {this.renderAddressLabel(
              t("LABEL.ADDRESS"),
              orderInfo.order_address
            )}

            <div className="mb-2 d-flex justify-content-between">
              <Autocomplete
                className="w-100"
                placeholder={t("PLACEHOLDER.TYPE_YOUR_ADDRESS")}
                value={order_address.input.value}
                onSearch={this.searchGoogleMap}
              >
                {predictions.map(({ description }, index) => (
                  <DropdownItem
                    onClick={() => this.chooseAddress(description)}
                    key={index}
                  >
                    {description}
                  </DropdownItem>
                ))}
              </Autocomplete>

              <Button
                color="info"
                onClick={() => this.loadAddressFromGmap()}
                className="ml-2 float-right"
              >
                <i
                  className="fa fa-refresh fa-spin mr-2 hidden"
                  ref={ref => (this.loadingIcon = ref)}
                />
                {t("LABEL.MAP")}
              </Button>
            </div>

            <GoogleMapKey
              onItemRef={this.initGmap}
              height={400}
              defaultCenter={position}
            >
              {directions ? (
                <DirectionsRenderer directions={directions} />
              ) : position.lat && position.lng ? (
                <Marker position={position} />
              ) : (
                <span className="w-100 text-center text-danger vertical-center">
                  Can not address the location of business
                </span>
              )}
            </GoogleMapKey>

            {directions && (
              <div className="d-flex flex-row justify-content-between mt-auto w-100">
                <span>
                  <strong>Distance:</strong>{" "}
                  {directions.routes[0].legs[0].distance.text}
                </span>
                <span>
                  <strong>Time estimated:</strong>
                  {directions.routes[0].legs[0].duration.text}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
