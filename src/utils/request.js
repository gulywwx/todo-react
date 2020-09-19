import axios from "axios";
import store from "@/store";
import CustomError from "./error";
import {
  ERROR_AUTH_CHECK_TOKEN_FAIL,
  ERROR_AUTH_CHECK_TOKEN_TIMEOUT,
  ERROR_AUTH_TOKEN,
} from "@/utils/constant";
import { logout } from "@/store/actions";

const apiUrl = "/api";

axios.defaults.headers["Content-Type"] = "application/json";

const request = axios.create({
  baseURL: apiUrl,
  timeout: 60 * 1000,
});

// request interceptor
request.interceptors.request.use(
  (config) => {
    // console.log('store.getState()===',store.getState().user)
    if (store.getState().user.data.token) {
      config.headers["Authorization"] =
        "Bearer " + store.getState().user.data.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
request.interceptors.response.use(
  (response) => {
    console.log(response.data);
    // token is invalid, jump to login page
    if (
      response.data.code === ERROR_AUTH_CHECK_TOKEN_FAIL ||
      response.data.code === ERROR_AUTH_CHECK_TOKEN_TIMEOUT ||
      response.data.code === ERROR_AUTH_TOKEN
    ) {
      store.dispatch(logout());
      throw new CustomError(
        "token is invalid. Please login again",
        "token is invalid. Please login again",
        null
      );
    }

    return response.data;
  },
  (error) => {
    console.log("error===", error.response);
    const { status } = error.response;

    if (status === 401 || status === 403) {
      store.dispatch(logout());
      throw new CustomError(
        "token is invalid. Please login again",
        error.message,
        error.stack
      );
    } else {
      throw new CustomError(
        "network issue. Please try again",
        error.message,
        error.stack
      );
    }
  }
);

export default request;
