import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";

// component
import InfiniteScroller from "~/ui/components/Scroller/Infinite";
import RestaurantItemPhoto from "~/ui/components/Restaurant/Item/Photo";
import EmptyResult from "~/ui/components/EmptyResult";
import IconLoading from "~/ui/components/Loading/icon";

// store
import api from "~/store/api";
// import options from "./options";
import "./index.css";

// selectors && actions
import * as authActions from "~/store/actions/auth";
import * as restaurantActions from "~/store/actions/restaurant";
import * as authSelectors from "~/store/selectors/auth";
import * as restaurantSelectors from "~/store/selectors/restaurant";

import { store } from "~/store";

@translate("translations")
@connect(
  state => ({
	  filters: authSelectors.getFilters(state),
	  config: authSelectors.getConfig(state)
  }),
  { ...authActions, ...restaurantActions }
)
export default class extends Component {
  constructor(props) {
    super(props);
    const elements = restaurantSelectors.getList(store.getState());
    this.state = {
      hasMore: true,
      elements
    };
  }

  loadMoreElement = async page => {
    const { config, filters } = this.props;

	  let data = this.standardFilter(filters);
	  if(config.searchStr) data['keyword'] = config.searchStr;

	  try {
	    const ret = await api.restaurant.searchOutlet(page, data);
	    this.updateView(ret);

	    if (page === 1) {
        this.props.saveRestaurants(ret);
      }
    } catch (err) {
      console.log(err);
    }
  };

  standardFilter = (filter) => {
    let result = {};
    const listParam = Object.keys(filter);
    if(listParam.length) {
	    for(let key of listParam) {
		    if(filter[key] && filter[key]['selected']) {
			    result[key] = filter[key]['selected'];
		    }
	    }
    }
    return result;
  }

  updateView = ret => {
    if (!ret.status && ret.data.data && !this.unmounted) {
      const data = ret.data.data;
      this.setState(prevState => ({
        elements: prevState.elements.concat(data),
        hasMore: data.length > 0
      }));
    }
  };

  removeSearchResult = () => {
    this.scroller.pageLoaded = 0;
    this.setState({ hasMore: true, elements: [] });
  };

	componentWillReceiveProps() {
		this.removeSearchResult();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  renderResult(elements, hasMore) {
    // const { t } = this.props;
    if (elements.length)
      return elements.map(item => (
        <RestaurantItemPhoto
          key={item.outlet_uuid}
          uuid={item.outlet_uuid}
          name={item.name}
          address={item.address}
          logo={item.logo}
          restaurant={item}
        />
      ));

    if (!hasMore)
      return <EmptyResult/>;

    return <div/>
  }

  render() {
    // const { t } = this.props;
    const { elements, hasMore } = this.state;
    return (
      <div className="container-fluid bg-white mb-100">
        <InfiniteScroller
          className="row d-flex"
          hasMore={hasMore}
          loader={<IconLoading />}
          loadMore={this.loadMoreElement}
          pageStart={elements.length ? 1 : 0}
          onItemRef={ref => (this.scroller = ref)}
        >
          {this.renderResult(elements, hasMore)}
        </InfiniteScroller>
      </div>
    );
  }
}