import * as types from "../actionTypes";
import { loginUser, registerUser } from "@/utils/api";
import CustomError from "@/utils/error";

export const login = (username, password) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await loginUser({
        username: username.trim(),
        password: password,
      });
      console.log("login===", res);

      if (res.code === 200) {
        dispatch(saveUserInfo(res.data));
        resolve(res);
      } else {
        dispatch(clearUserInfo());
        reject(new CustomError(res.data, res.msg, null));
      }
    } catch (error) {
      dispatch(clearUserInfo());
      reject(error);
    }
  });
};

export const register = (username, password) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await registerUser({
        username: username.trim(),
        password: password,
      });
      console.log("register===", res);

      if (res.code === 200) {
        dispatch(saveUserInfo(res.data));
        resolve(res);
      } else {
        dispatch(clearUserInfo());
        reject(new CustomError(res.data, res.msg, null));
      }
    } catch (error) {
      dispatch(clearUserInfo());
      reject(error);
    }
  });
};

export const logout = () => (dispatch) => {
  console.log("logout");
  dispatch(clearUserInfo());
  window.location.href = "/login";
};

export const saveUserInfo = (data) => {
  return {
    type: types.SET_USER_INFO,
    data,
  };
};

export const clearUserInfo = () => {
  return {
    type: types.CLEAR_USER_INFO,
  };
};
