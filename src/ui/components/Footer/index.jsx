import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import classNames from "classnames";

// components
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import Dropdown from "~/ui/components/Dropdown";

import "./index.css";
import options from "./options";

// selectors
import api from "~/store/api";
import * as authSelectors from "~/store/selectors/auth";
import * as authActions from "~/store/actions/auth";

import { isMobile } from "~/utils";

@translate("translations")
@connect(
  state => ({
    isLogged: authSelectors.isLogged(state),
    config: authSelectors.getConfig(state),
    isHome: state.routing.location.pathname === "/restaurant"
  }),
  authActions
)
export default class extends Component {
  async componentWillMount() {
    const { config, updateConfig } = this.props;
    if (!config.languages) {
      const ret = await api.setting.getSettingLanguages();
      updateConfig("languages", ret.data);
    }
  }

  renderLanguage() {
    const { t, config, i18n } = this.props;
    let defaultLang = i18n.language;
    if (defaultLang === "en-US") {
      defaultLang = "en";
    }
    const defaultLangName = t(`languages.${defaultLang}`);
    if (!config.languages) return defaultLangName;

    let selectedItem = null;

    config.languages.map(item => {
      if(item.iso_code === defaultLang) selectedItem = item;
      return false;
    });
    return (
      <Dropdown
        title={<span>{selectedItem ? selectedItem.name : defaultLangName}<i className="footer-language-caret ml-1 fa fa-caret-up" aria-hidden="true"/></span>}
        className={classNames(
          isMobile ? "dropinline" : "dropup",
          "text-uppercase dropdown-language"
        )}
      >
        {config.languages.map(item => (
          <a
            key={item.id}
            className={classNames({
              "text-info": item.iso_code === defaultLang
            })}
            onClick={() => i18n.changeLanguage(item.iso_code)}
          >
            {item.name}
          </a>
        ))}
      </Dropdown>
    );
  }

  render() {
    const { t, isHome } = this.props;
    return (
      <footer
        className={classNames(
          "footer text-center menu-bottom bg-white float-left w-100",
          {
            "fixed-bottom": isHome && !isMobile
          }
        )}
      >
        <Menu className="d-flex justify-content-center align-items-end text-uppercase h-50">
          <MenuItem className="font-fr-115 color-cg-040 footer-menu-language" title={this.renderLanguage()} />
          <MenuItem className="font-fr-115 color-cg-040" link="/about" title={t("LINK.FOOTER.ABOUT_US")} />
          <MenuItem className="font-fr-115 color-cg-040" link="/about" title={t("LINK.FOOTER.TECHNOLOGY")} />
          <MenuItem className="font-fr-115 color-cg-040" link="/about" title={t("LINK.FOOTER.JOIN_US")} />
        </Menu>
        <Menu className="d-flex justify-content-center align-items-start bottom h-50">
          {options.items.map((item, index) => (
            <MenuItem className="font-fr-110 color-cg-074" key={index} link={item.link} title={t(item.title)} />
          ))}
        </Menu>
      </footer>
    );
  }
}
