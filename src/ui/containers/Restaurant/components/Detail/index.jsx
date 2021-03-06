import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";
// import classNames from "classnames";

// import api from "~/store/api";
import { Marker } from "react-google-maps";
import GoogleMapKey from "~/ui/components/GoogleMapKey";
import { formatCurrency, parseJsonToObject } from "~/utils";
import "./index.css";

@translate("translations")
export default class extends Component {
	initGmap = ref => {
		this.googleMap = ref;
		this.Maps = window.google.maps;
		this.directionsService = new this.Maps.DirectionsService();
		this.placeService = new this.Maps.places.AutocompleteService();
		this.geocoder = new this.Maps.Geocoder();
		const { lat, long } = this.props.outlet;
		this.loadDirectionFromGmap(lat, long);
	};

	async loadDirectionFromGmap(lat, long) {
		if (lat && long) {
			this.directionsService.route(
				{
					origin: new this.Maps.LatLng(lat, long),
					destination: new this.Maps.LatLng(lat, long),
					travelMode: this.Maps.TravelMode.DRIVING
				},
				(result, status) => {
					if (status === this.Maps.DirectionsStatus.OK) {
						this.setState({
							directions: result
						});
					} else {
						console.error(
							`error fetching directions ${JSON.stringify(result)}`
						);
					}
				}
			);
		}
	}

	componentDidUpdate() {

    try {
      window.dispatchEvent(new Event("resize"));
    }catch (err){
      console.log("err ----------- ", err);
    }
	}

	render() {
		const { t, outlet } = this.props;
		const lat = outlet.lat;
		const lng = outlet.long;
		const position = { lat: +lat, lng: +lng };

		const hoursDelivery =
			outlet.online_order_setting && outlet.online_order_setting.hours_delivery
				? parseJsonToObject(outlet.online_order_setting.hours_delivery)
				: false;
		const symbol = outlet.currency ? outlet.currency.symbol : undefined;

    let order_setting = {};
    if(outlet && outlet.online_order_setting) order_setting = outlet.online_order_setting;

		return (
			<div className="w-100">
				{order_setting.do_delivery === 1 && order_setting.delivery_fee !== 0 &&
						<div className="w-100">
							<h3 className="font-largest color-black w-100">
								<span className="font-weight-bold">{t("LABEL.FEES")}</span>
							</h3>
							<p>
								{formatCurrency(
									outlet.online_order_setting.delivery_fee,
									symbol
								)}
							</p>
						</div>
					}

				{order_setting.do_delivery === 1 &&
					<div className="w-100">
						<h3 className="font-largest color-black w-100">
							<span className="font-weight-bold">
								{t("LABEL.MIN_MAX_ORDER_AMOUNT")}
							</span>
						</h3>
						<ul>
							<li>
								<i className="fa fa-arrow-down" />{" "}
								{formatCurrency(
									outlet.online_order_setting.min_delivery_cost,
									symbol
								)}
							</li>
							<li>
								<i className="fa fa-arrow-up" />{" "}
								{formatCurrency(
									outlet.online_order_setting.max_delivery_cost,
									symbol
								)}
							</li>
						</ul>
					</div>
				}

				{hoursDelivery && (
					<div className="w-100">
						<h3 className="font-largest color-black w-100">
							<span className="font-weight-bold">
								{t("LABEL.DELIVERING_HOURS")}
							</span>
						</h3>
						<ul>
							{Object.keys(hoursDelivery).map((day, key) => {
								const currentDayConfig = hoursDelivery[day];
								return currentDayConfig.open ? (
									<li key={key}>
										{day} :{" "}
										{currentDayConfig.from.time || currentDayConfig.from} -{" "}
										{currentDayConfig.to.time || currentDayConfig.to}
									</li>
								) : (
									""
								);
							})}
						</ul>
					</div>
				)}

				{lat &&
					lng && (
						<div className="w-100">
							<h3 className="font-largest color-black w-100">
								<span className="font-weight-bold">{t("LABEL.LOCAL_MAP")}</span>
							</h3>
							<GoogleMapKey
								onItemRef={this.initGmap}
								height={400}
								defaultCenter={position}
							>
								{<Marker position={position} />}
							</GoogleMapKey>
						</div>
					)}
			</div>
		);
	}
}
