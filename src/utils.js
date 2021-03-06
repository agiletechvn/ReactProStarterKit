/* eslint-disable */
import moment from "moment";
import i18n from "~/i18n";
import countryData from "country-data";

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  window.navigator.userAgent
);

const KEYCODE_Z = 90;
const KEYCODE_Y = 89;

const defaultCoordsValue = { latitude: 21.0595054, longitude: 105.7787773 };

export const countries = countryData.countries.all
  .filter(country => country.countryCallingCodes.length)
  .map(country => ({
    ...country,
    country_code: +country.countryCallingCodes[0].replace(/[+\s]+/g, "")
  }));

export const ORDER_TYPE = {
  DINE_IN: 1,
  TAKE_AWAY: 2,
  DELIVERY: 3,
  QUICK_SERVICE: 4,
  PRE_ORDER: 5,

  getString(status) {
    switch (status) {
      case this.DELIVERY:
        return i18n.t("LABEL.DELIVERY");
      default:
        return i18n.t("LABEL.TAKEAWAY");
    }
  }
};

export const ORDER_STATUS = {
  NEW: -1,
  CANCELED: 0,
  CONFIRMED: 1,
  ON_THE_WAY: 2,
  DELIVERED: 3,
  PAID: 4,
  HOLD_ON: 5,
  REFUND: 7,

  getString(status) {
    switch (status) {
      case this.NEW:
        return i18n.t("LABEL.NEW");
      case this.CANCELED:
        return i18n.t("LABEL.CANCELED");
      case this.CONFIRMED:
        return i18n.t("LABEL.CONFIRMED");
      case this.ON_THE_WAY:
        return i18n.t("LABEL.ON_THE_WAY");
      case this.DELIVERED:
        return i18n.t("LABEL.DELIVERED");
      case this.PAID:
        return i18n.t("LABEL.PAID");
      case this.HOLD_ON:
        return i18n.t("LABEL.HOLD_ON");
      default:
        return i18n.t("LABEL.REFUND");
    }
  }
};

export const getSiblings = node => {
  let child = node.parentNode.firstChild;

  const siblings = [];
  for (; child; child = child.nextSibling)
    if (child.nodeType === 1 && child !== node) siblings.push(child);
  return siblings;
};

export const isUndo = e => {
  return (
    (e.ctrlKey || e.metaKey) &&
    e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
  );
};

export const isRedo = e => {
  return (
    (e.ctrlKey || e.metaKey) &&
    e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
  );
};

export const chunk = (array, size) => {
  const ret = [];
  for (var i = 0; i < array.length; i += size) {
    ret.push(array.slice(i, size + i));
  }
  return ret;
};

export const getSelection = el => {
  let start, end, rangeEl, clone;

  if (el.selectionStart !== undefined) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    try {
      el.focus();
      rangeEl = el.createTextRange();
      clone = rangeEl.duplicate();

      rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
      clone.setEndPoint("EndToStart", rangeEl);

      start = clone.text.length;
      end = start + rangeEl.text.length;
    } catch (e) {
      /* not focused or not visible */
    }
  }

  return { start, end };
};

export const setSelection = (el, selection) => {
  let rangeEl;

  try {
    if (el.selectionStart !== undefined) {
      el.focus();
      el.setSelectionRange(selection.start, selection.end);
    } else {
      el.focus();
      rangeEl = el.createTextRange();
      rangeEl.collapse(true);
      rangeEl.moveStart("character", selection.start);
      rangeEl.moveEnd("character", selection.end - selection.start);
      rangeEl.select();
    }
  } catch (e) {
    /* not focused or not visible */
  }
};

export const defaultCoords = callback => {
  fetch("http://www.geoplugin.net/json.gp")
    .then(text => text.json())
    .then(json =>
      callback({
        latitude: json.geoplugin_latitude,
        longitude: json.geoplugin_longitude
      })
    )
    .catch(e => {
      console.log(e);
      callback(defaultCoordsValue);
    });
};

export const getCurrentLocation = () => {
  return new Promise(function(resolve, reject) {
    // if (window.location.hostname === "localhost") return resolve(defaultCoords);
    if (navigator.geolocation) {
      // Call getCurrentPosition with success and failure callbacks
      navigator.geolocation.getCurrentPosition(
        function(ret) {
          resolve(ret.coords);
        },
        function(ret) {
          // reject(ret)
          console.log(ret);
          defaultCoords(defaultCoords => resolve(defaultCoords));
        }
      );
    } else {
      console.log("Sorry, your browser does not support geolocation services.");
      defaultCoords(defaultCoords => resolve(defaultCoords));
    }
  });
};

export const isValidEmail = values => {
  const errors = {};
  if (!values) return errors;
  if (!values.email) {
    errors.email = i18n.t("LABEL.ENTER_EMAIL");
  } else {
    const email = values.email.trim();
    // no-useless-escape
    const test =
      email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) !== null;
    if (!test) errors.email = i18n.t("LABEL.INVALID_EMAIL");
  }
  return errors;
};

export const isValidPhoneNumber = phone => {
  return phone && phone.match(/^\d{10,11}$/) !== null;
};

export const validateLogin = values => {
  const errors = isValidEmail(values);

  if (!values.password) errors.password = i18n.t("LABEL.ENTER_PASSWORD");

  return errors;
};

export const extractMessage = message => {
  let messageValue = message.general
    ? message.general.message || message.general
    : message;
  if (typeof message === "object") {
    for (let key in message) {
      if (key !== "general") {
        messageValue = message[key];
        if (Array.isArray(messageValue)) {
          messageValue = messageValue[0].message;
        }
        break;
      }
    }
  }
  return messageValue;
};

// item_options in item is different from item_options in product
export const getItemPrice = item => {
  return (
    item.price +
    (item.item_options ? item.item_options.reduce((a, b) => a + b.price, 0) : 0)
  );
};

export const calculateOrderPrice = (
  items,
  { consumer_discounts, consumer_taxes, delivery_fee, do_delivery, order_type }
) => {
  const itemsSum = items
    .map(item => getItemPrice(item) * item.quantity)
    .reduce((a, b) => a + b, 0);
  const discountPercent = 0;
  // later
  //consumer_discounts ? consumer_discounts.reduce((a,b)=>a+b,0) : 0;
  const taxPercent = 0;
  // later
  //consumer_taxes ? consumer_taxes.reduce((a,b)=>a+b,0) : 0;
  const discount = itemsSum * discountPercent;
  const subtotal = itemsSum - discount;
  const tax = subtotal * taxPercent;
  // if we choose delivery or by default has delivery
  const fee =
    do_delivery && (!order_type || order_type === ORDER_TYPE.DELIVERY)
      ? delivery_fee
      : 0;

  const total = subtotal + tax + fee;

  return { total, subtotal, tax, discount, fee };
};

export const parseQuery = location => {
  const query = location.search.substring(1);
  const vars = query.split("&");
  const ret = {};
  for (let i = 0; i < vars.length; i++) {
    const [key, value] = vars[i].split("=");
    ret[key] = decodeURIComponent(value);
  }
  return ret;
};

export const slugify = text => {
  return text
    .replace(/[^-a-zA-Z0-9\s+]+/gi, "")
    .replace(/\s+/gi, "-")
    .toLowerCase();
};

export const isUUID = str => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str
  );
};

export const getTodayString = () => {
  return moment().format("dddd");
};

export const parseJsonToObject = (str, defaultValueIfFalse = {}) => {
  if (!str) {
    return defaultValueIfFalse;
  }

  // we will have maximum 2 parse turns
  try {
    const result = JSON.parse(str);
    return typeof result === "object" ? result : JSON.parse(result);
  } catch (e) {
    return defaultValueIfFalse;
  }
};

export const formatCurrency = (price, symbol = "₫") => {
  return i18n.t("format.currency", {
    price: price,
    symbol: symbol
  });
};

export const checkOrderAvailable = outlet => {
  if (!outlet.online_order_setting) return false;
  const {
    do_takeaway,
    do_delivery,
    hours_open,
    published
  } = outlet.online_order_setting;
  if (!published || !hours_open) return false;

  if (!do_delivery && !do_takeaway) {
    return false;
  }
  return true;
};

export const getOrderSetting = outlet => {
  const metadata = [];
  const { online_order_setting: setting, currency = {} } = outlet;

  if (setting) {
    if (setting.do_delivery) {
      metadata.push(i18n.t("LABEL.DELIVERY"));
    }
    if (setting.do_takeaway) {
      metadata.push(i18n.t("LABEL.TAKEAWAY"));
    }

    // display this for delivery only
    if (setting.do_delivery) {
      if (setting.min_delivery_cost) {
        metadata.push(
          i18n.t("LABEL.MIN_ORDER") +
            " " +
            formatCurrency(setting.min_delivery_cost, currency.symbol)
        );
      }
      if (setting.max_delivery_cost) {
        metadata.push(
          i18n.t("LABEL.MAX_ORDER") +
            " " +
            formatCurrency(setting.max_delivery_cost, currency.symbol)
        );
      }
      if (setting.delivery_fee) {
        metadata.push(
          i18n.t("LABEL.DELIVERY_FEE") +
            " " +
            formatCurrency(setting.delivery_fee, currency.symbol)
        );
      }
    }
  }

  return metadata;
};
