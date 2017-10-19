import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

@translate('translations')
export default class extends Component {
	static propTypes = {
		outlet: PropTypes.Object
	};

	render() {
		const { t, outlet, ...props } = this.props;
		const metadata = [];
		if(outlet.online_order_setting) {
			if(outlet.online_order_setting.do_delivery) {
				metadata.push(t('LABEL.DELIVERY'));
			}
			if(outlet.online_order_setting.do_takeaway) {
				metadata.push(t('LABEL.TAKEAWAY'));
			}
			if(outlet.online_order_setting.hours_open) {
				metadata.push(outlet.online_order_setting.hours_open);
			}
			if(outlet.online_order_setting.min_delivery_cost) {
				metadata.push(outlet.online_order_setting.min_delivery_cost);
			}
			if(outlet.online_order_setting.max_delivery_cost) {
				metadata.push(outlet.online_order_setting.max_delivery_cost);
			}
			if(outlet.online_order_setting.delivery_fee) {
				metadata.push(outlet.online_order_setting.delivery_fee);
			}
		}

		return (
			<span>{metadata.join(" | ")}</span>
		);
	}
}