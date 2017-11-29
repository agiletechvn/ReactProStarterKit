/* eslint-disable */
import { apiPost, apiGet } from "~/store/api/common";

export default {
  /**
  * Logs a user in, returning a promise with `true` when done
  * @param  {string} token The token of the user  
  */
  loginFacebook(accessToken) {
    // Post request to server
    return apiPost(`/oauth/facebook/token?access_token=${accessToken}`);
  },

  loginGoogle(accessToken) {
    // Post request to server
    return apiPost(`/oauth/google/token?access_token=${accessToken}`);
  },

  login(email, password) {
    return apiPost("/customer/login", {
      email,
      password
    });
  },

  // wrong order if have many, so prevent wrong name when there are few params, otherwise remain
  signup(email, password, extra) {
    return apiPost("/customer/signup", {
      email,
      password,
      ...extra
    });
  },

  refreshAccessToken(refresh_token) {
    return apiPost(`/auth/customer-refresh-token`, { refresh_token });
  },

  updateAccount(token, data) {
    return apiPost(token, `/auth/update`, data);
  },

  /**
  * Logs the current user out
  */
  logout(token) {
    return apiPost("/customer/logout", {
      token
    });
  },

  resetPassword(email) {
    return apiPost("/customer/reset-password", {
      email
    });
  },

  updateCustomer(token, customer_uuid, name, phone) {
    return apiPost(
      "/customer",
      {
        token,
        customer_uuid,
        name,
        phone
      },
      "PUT"
    );
  },

  addAddress(token, customer_uuid, name, address) {
    return apiPost("/customer/address", {
      token,
      customer_uuid,
      name,
      address
    });
  },

  updateAddress(token, cus_address_uuid, name, address) {
    return apiPost(
      "/customer/address",
      {
        token,
        cus_address_uuid,
        name,
        address
      },
      "PUT"
    );
  },

  deleteAddress(token, cus_address_uuid) {
    return apiPost(
      `/customer/address/${cus_address_uuid}`,
      {
        token
      },
      "DELETE"
    );
  }
};
