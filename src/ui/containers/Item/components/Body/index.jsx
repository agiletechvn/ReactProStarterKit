import React, { Component } from "react";
// import { translate } from "react-i18next";
import ProductItemPhoto from "~/ui/components/Product/Item/Photo";
import Slider from "~/ui/components/Slider";

import "./index.css";
// import options from "./options";

// @translate('translations')
export default class extends Component {
  render() {
    const { item } = this.props;
    const gallery = JSON.parse(item.gallery);

    return (
      <div className="flex-nowrap d-flex flex-row justify-content-between box-shadow block bg-white mb-4 mt-5 w-100">
        {gallery &&
          gallery.length && (
            <Slider className="mt-2 w-100" num={5} move={1}>
              {gallery.map((item, index) => (
                <ProductItemPhoto key={index} image={item} />
              ))}
            </Slider>
          )}
      </div>
    );
  }
}