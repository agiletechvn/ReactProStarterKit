import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

//import { getSiblings } from "~/utils";
import "./index.css";

export default class MenuItem extends Component {
  static defaultProps = {
    activeClassName: "selected",
    active: false,
	  clickIt: false
  };

  renderLink(link, title) {
    return (
      <NavLink
        to={link}
        activeClassName={this.props.activeClassName}
      >
        {title}
      </NavLink>
    );
  }

  handleClick(e, onClick) {
    //if (!this.props.link) {
    //  const { activeClassName } = this.props;
    //
    //  this.node.classList.add(activeClassName);
    //  const siblings = getSiblings(this.node);
    //  siblings.map(sibling => sibling.classList.remove(activeClassName));
    //}

	  // const idToggle = this.node.getAttribute("data-toggle-id");
	  // const classToggle = this.node.getAttribute("data-toggle-class");
	  // if (idToggle && classToggle) {
		 //  var selects = document.getElementsByClassName(classToggle);
		 //  for (var i = 0, il = selects.length; i < il; i++) {
			//   selects[i].style.visibility = "hidden";
		 //  }
		 //  document.getElementById(idToggle).style.visibility = "visible";
	  // }

	  onClick && onClick(e);
  }

  renderItem(title) {
    return <span>{title}</span>;
  }

  componentDidMount() {
	  const { clickIt } = this.props;
	  if(clickIt) {
		  this.node.click();
    }
  }

  render() {
    const { totalItem, title, link, active, onClick, className, activeClassName, icon, id } = this.props;

    const inputClass = classNames("list-inline-item menu-item", {
      [activeClassName]: active
    }, className);

    return (totalItem !== 0 &&
      <li
        ref={ref => (this.node = ref)}
        className={inputClass}
        // data-toggle-id={idToggle}
        // data-toggle-class={classToggle}
        onClick={e => this.handleClick(e, onClick)}
        id={id}
      >
        {link ? this.renderLink(link, title) : this.renderItem(title)}
        {!!icon && <i className={icon}/>}
      </li>
    );
  }
}