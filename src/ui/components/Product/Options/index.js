import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";

import * as orderActions from "~/store/actions/order";

@translate("translations")
@connect(null, orderActions)
export default class ProductOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {},
			disableAddToCart: false
		};
	}

	static propTypes = {
		item: PropTypes.object
	};

	addOrderItem(item) {
		const {
			default_price,			
			item_uuid,
			currency,
			name,
			description
		} = item;
		this.props.addOrderItem({
			item_uuid,
			item_options: this.getOptionsUUID(),
			price: default_price,
			quantity: 1,
			name,
			description,
			currency_symbol: currency.symbol
		});
	}

	handleSubmit = () => {
		// clean error
		for (let spanTag of document.querySelectorAll(".text-error-msg")) {
			spanTag.innerText = "";
		}
		// validate mandatory
		let validateResult = this.validateMandatory();

		if (validateResult) {
			// save into order
			// clear checked
		} else {
			this.setState({
				disableAddToCart: true
			});
		}
	};

	getOptionsUUID(){
		return Object.values(this.state.form).map(set=>Object.keys(set).filter(key=>set[key]))
			.reduce((a, b) => a.concat(b), []);		
	}

	validateMandatory(showError = true) {
		const { item } = this.props;		
		const { form } = this.state;
		let validateResult = true;
		console.log(showError, form);
		for (let parent of item.item_options) {
			if (parent.optionSet && parent.mandatory) {
				// check state and show alert message
				if (this.checkObjectFalse(form[parent.opt_set_uuid])) {
					validateResult = false;
					if (showError) {
						document.querySelector("#error-" + parent.opt_set_uuid).innerText =
							"Error, this is mandatory!";
					}
				}
			}
		}
		return validateResult;
	}

	checkObjectFalse(obj) {
		for (let objValue of Object.keys(obj)) {
			if (obj[objValue]) {
				return false;
			}
		}
		return true;
	}

	componentDidMount() {
		const { item } = this.props;
		let formTree = {};

		for (let parent of item.item_options) {
			if (!!parent.optionSet) {
				formTree[parent.opt_set_uuid] = {};
				for (let child of parent.optionSet) {
					formTree[parent.opt_set_uuid][child.option_uuid] = false;
				}
			}
		}		
		this.setState({ form: formTree });
	}

	handleChange = (parentUuid, child, multiChoice) => {
		const { disableAddToCart, form } = this.state;
		if (disableAddToCart) {
			this.setState({
				disableAddToCart: this.validateMandatory(false)
			});
		}

		if (!multiChoice) {
			for (let childUuid of Object.keys(form[parentUuid])) {
				form[parentUuid][childUuid] = false;
			}
		}
		form[parentUuid][child.option_uuid] = form[parentUuid][child.option_uuid]
			? false
			: child;
		this.setState({
			form: form
		});
	};

	renderOption(symbol, parent, t) {
		const inputType = parent.multiple_choice ? "checkbox" : "radio";
		return (
			<div className="col-10 row">
				{parent.optionSet.map((child, index) => {
					const inputName = parent.multiple_choice
						? `data[${parent.id}][${child.id}]`
						: `data[${parent.id}]`;
					return (
						<div className="col-3" key={index}>
							<p>
								<input
									key={child.option_uuid}
									id={child.option_uuid}
									name={inputName}
									onChange={() =>
										this.handleChange(
											parent.opt_set_uuid,
											child,
											parent.multiple_choice
										)}
									type={inputType}
									className="mr-1"
								/>
								<label htmlFor={child.option_uuid}>{child.name}</label>
								{child.price > 0 && (
									<small className="badge badge-danger">
										{t("format.currency", {
											price: child.price,
											symbol: symbol
										})}
									</small>
								)}
							</p>
						</div>
					);
				})}
			</div>
		);
	}

	render() {
		const { t, item, canAddOrder } = this.props;		
		const { disableAddToCart } = this.state;		
		return (
			<div>
				{item.item_options.map((parent, index) => (
					<div className={classNames("row my-3", {"border-bottom":index < item.item_options.length -1})} key={parent.opt_set_uuid}>
						<div className="col-2">
							<span className={classNames({"border-bottom border-danger" : parent.mandatory})}>
								{parent.name}
							</span>
						</div>
						{!!parent.optionSet &&
							this.renderOption(item.currency.symbol, parent, t)}
						<div className="col-12">
							<span
								className="text-danger text-error-msg"
								id={`error-${parent.opt_set_uuid}`}
							/>
						</div>
					</div>
				))}
				<div className="form-group text-right">					
						{canAddOrder && <button
							className="btn btn-danger btn-lg"
							disabled={disableAddToCart}
							onClick={() => this.handleSubmit()}
						>
							{t("BUTTON.ADD_TO_CART")}
						</button>}					
				</div>
			</div>
		);
	}
}