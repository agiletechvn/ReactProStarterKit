import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Footer from "~/ui/components/Footer";
import Filter from "~/ui/components/Restaurant/Filter";
// import { isMobile } from "~/utils";

import "./index.css";
// when connect to redux should not pass all props to div
@connect(state=>({
  isHome: state.routing.location.pathname === "/restaurant"
}))
export default class Drawer extends Component {

  render(){
    const {isHome, className, onUpdateFilter} = this.props;
    return (
      <div className={classNames("drawer", className)} id="drawer">
        <div className="drawer-inner">  
          <Link id="home-link" className="color-black-300 mb-2" to="/">Home</Link>  
          {isHome && <Filter placeOnDrawer={true} onUpdateFilter={onUpdateFilter}/>}      
          <Footer/>
        </div>
      </div>
    )
  }
}