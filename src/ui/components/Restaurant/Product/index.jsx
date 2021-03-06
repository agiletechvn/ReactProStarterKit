/* eslint-disable */

import React, { Component } from "react";
// import classNames from "classnames";
import PropTypes from "prop-types";
// import { translate } from "react-i18next";

import { Col } from "reactstrap";
import ProductGroup from "~/ui/components/Product/Group";
import EmptyResult from "~/ui/components/EmptyResult";
import IconLoading from "~/ui/components/Loading/icon";

// @translate("translations")
export default class RestaurantProduct extends Component {
	static propTypes = {
		onAddOrder: PropTypes.func
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {
			// t,
			// i18n,
			products,
			treeCategoryName,
			onAddOrder,
			outlet_slug,
			term,
			...props
		} = this.props;
		return (
			<Col {...props}>
				{Object.keys(products).length > 0 ? (
					<div>
						{Object.keys(products).map((item, index) => (
							<ProductGroup
								outlet_slug={outlet_slug}
								className="row w-100 m-0"
								name={treeCategoryName[item]}
								key={index}
								term={term}
								products={products[item]}
								onAddOrder={onAddOrder}
							/>
						))}
					</div>
				) : (
					<EmptyResult />
				)}
			</Col>
		);
	}
}
