import React from "react";
// import { Field } from "redux-form";
import classNames from "classnames";
import {
  Input,
  Label,
  // InputGroup,
  // InputGroupAddon,
  FormGroup,
  FormFeedback
} from "reactstrap";

export const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  placeholder,
  ...custom
}) => (
  <FormGroup {...custom}>
    {label && <Label>{label}</Label>}
    <Input
      placeholder={placeholder}
      {...input}
      valid={!touched || !error}
      type={type}
      className={classNames({ "h-100": type === "textarea" })}
    />
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);

export const InputField2 = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  placeholder,
  ...custom
  }) => (
  <FormGroup {...custom}>
    <div className="d-flex justify-content-between">
      {label && <Label className="input-field-2-label">{label}</Label>}
      <div>
        <Input
          placeholder={placeholder}
          {...input}
          valid={!touched || !error}
          type={type}
          className={classNames("input-field-2-input",{ "h-100": type === "textarea" })}
        />
        {touched && error && <div className="input-field-2-error">{error}</div>}
      </div>
    </div>
  </FormGroup>
);

export const SelectField = ({
  input,
  label,
  meta: { touched, error, warning },
  children,
  ...custom
}) => (
  <FormGroup {...custom}>
    {label && <Label>{label}</Label>}
    <Input {...input} valid={!touched || !error} type="select">
      {children}
    </Input>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);

export const SelectField2 = ({
  input,
  label,
  meta: { touched, error, warning },
  children,
  ...custom
  }) => (
  <FormGroup {...custom}>
    <div className="d-flex justify-content-between">
      {label && <Label className="input-field-2-label">{label}</Label>}
      <div>
        <Input className="input-field-2-input" {...input} valid={!touched || !error} type="select">
          {children}
        </Input>
        {touched && error && <FormFeedback className="input-field-2-error">{error}</FormFeedback>}
      </div>
    </div>
  </FormGroup>
);
