import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import * as commonActions from "~/store/actions/common";

@connect(null, commonActions)
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  logout = () => {
    this.props.requestor("app/logout");
  };

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav={true} className="color-black ml-20">
          <i className="fa fa-bars" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Link to="/customer/order">Order history</Link>
          </DropdownItem>
          <DropdownItem>
            <Link to="/customer/profile">Account</Link>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.logout}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}