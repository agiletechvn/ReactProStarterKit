import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";

import PhotoGroup from "~/ui/components/PhotoGroup";
// import Rating from "~/ui/components/Rating";
import Menu from "~/ui/components/Menu";
import MenuItem from "~/ui/components/Menu/Item";
import RestaurantOrderSetting from "~/ui/components/Restaurant/OrderSetting";
import RestaurantInfo from "~/ui/components/Restaurant/Info";
import RestaurantTag from "~/ui/components/Restaurant/Tag";
import Readmore from "~/ui/components/Readmore";
import { parseJsonToObject } from "~/store/utils/json";

import "./index.css";
import options from "./options";

@translate('translations')
export default class extends Component {

  render() {
    const {t,outlet, active, onSelectItem} = this.props;
    const gallery = parseJsonToObject(outlet.gallery, ["/images/no-image-icon.png"]);    
    return (
      <div className="row bg-white box-shadow"> 
        <div className="flex-md-nowrap mb-4 block d-md-flex flex-row justify-content-between w-100">
          <div className="pr-md-5 w-100">
            <nav className="breadcrumb text-uppercase color-gray-400 bg-transparent pl-0">
              <Link className="breadcrumb-item color-gray-400" to={`/`}>
  	            {t('LINK.HOME')}
              </Link>
              <Link className="breadcrumb-item color-gray-400" to={`/restaurant`}>
  	            {t('LINK.RESTAURANT')}
              </Link>
              <span className="breadcrumb-item active color-gray-400">
                {outlet.name}
              </span>
            </nav>

            <h4 className="font-weight-bold text-uppercase color-black-400">{outlet.name}</h4>

            <div className="flex-row d-flex justify-content-between">
              <RestaurantInfo outlet={outlet} />
            </div>

            <div className="flex-row d-flex justify-content-between">
              <RestaurantOrderSetting outlet={outlet} />
            </div>

            <Readmore line="500" more={t('LABEL.SHOW_MORE')} 
              // less={t('LABEL.SHOW_LESS')}
            >
              <p className="w-100 mt-3 html-content" dangerouslySetInnerHTML={{__html:outlet.description}}/>
            </Readmore>

            <RestaurantTag outlet={outlet} />          

          </div>

          {gallery ? <PhotoGroup images={gallery} className="photo-group-large mt-md-0 mt-4"/> : ''}        
        </div>
          <div className="border border-white-300 bg-white w-100 border-right-0 border-left-0 border-bottom-0 mt-4">
              <Menu className="menu-decorator text-uppercase">
              {options.menuItems.map((item) =>                 
                <MenuItem active={active === item.id} onClick={()=>onSelectItem && onSelectItem(item.id)} title={<strong className="color-black">{t(item.name)}</strong>} key={item.id}/>
              )}
              </Menu>
          </div>
      </div>
    );
  }
}