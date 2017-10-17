import React, { Component } from "react";

import { translate } from "react-i18next";
import { connect } from "react-redux";

// reactstrap
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row
} from "reactstrap";

// redux form
import { Field, FieldArray, reduxForm } from "redux-form";

// components
import { InputField } from "~/ui/components/ReduxForm";


import * as commonActions from "~/store/actions/common";

import { validate } from "./utils";

@translate("translations")
@connect(null, commonActions)
@reduxForm({
  form: "Signup",
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true
})
export default class extends Component {
  render() {
    return (
      <Form>
        <Row>
          <Field
            className="col"
            label="Name"
            name="name"
            component={InputField}
          />
        </Row>
        <Row>
          <Field
            className="col"
            label="Email"
            name="email"
            component={InputField}
          />

          <Field
            className="col"
            label="Password"
            name="password"
            type="password"
            component={InputField}
          />
        </Row>

        <Row>
          <Field
            className="col"
            label="Address name"
            name="address_name"
            component={InputField}
          />

          <Field
            className="col"
            label="Address"
            name="address"
            component={InputField}
          />
        </Row>

        <Button color="primary">Submit</Button>
      </Form>
    );
  }
}