import React, { Component } from "react";
import { translate } from "react-i18next";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// reactstrap
import {
  Button,
  // Form,
  // FormGroup
  // Row,
  // ListGroup,
  // ListGroupItem
} from "reactstrap";

// import ButtonRound from "~/ui/components/Button/Round";

// store
import * as commonActions from "~/store/actions/common";
import * as authActions from "~/store/actions/auth";
import * as authSelectors from "~/store/selectors/auth";

// components
import { InputField } from "~/ui/components/ReduxForm";
import AddressListField from "./components/AddressListField";
import { validate } from "./utils";

@translate("translations")
@connect(
  state => ({
    initialValues: {
      ...authSelectors.getCustomer(state),
      address: authSelectors.getAddress(state)
    },
    token: authSelectors.getToken(state)
  }),
  { ...commonActions, ...authActions }
)
@reduxForm({
  form: "Profile",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {
  updateCustomer = ({ customer_uuid, name, phone, address }) => {
    const { token, requestor } = this.props;
    requestor(
      "customer/requestUpdateCustomer",
      token,
      customer_uuid,
      name,
      phone
    );
    // update address
    address.forEach(item => {
      const { cus_address_uuid, name, address } = item;
      if (cus_address_uuid) {
        requestor(
          "customer/requestUpdateAddress",
          token,
          cus_address_uuid,
          name,
          address
        );
      } else {
        requestor(
          "customer/requestAddAddress",
          token,
          customer_uuid,
          name,
          address
        );
      }
    });
  };

  render() {
    const { handleSubmit, submitting, t } = this.props;
    return (
      <div className="personal-info pl-5">
        <h3>Personal info</h3>

        <Field label="Username" name="name" component={InputField} />

        <Field label="Phone" name="phone" component={InputField} />

        <hr />

        <h3>My addresses</h3>
        <FieldArray name="address" component={AddressListField} />

        <hr />

        <Button
          disabled={submitting}
          onClick={handleSubmit(this.updateCustomer)}
          color="primary"
        >
          {t("BUTTON.UPDATE")}
        </Button>
      </div>
    );
  }
}