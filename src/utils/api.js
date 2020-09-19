import request from "./request";

export function loginUser(data) {
  return request({
    url: `/login`,
    method: "post",
    data,
  });
}

export function registerUser(data) {
  return request({
    url: `/register`,
    method: "post",
    data,
  });
}

export function resetPwd(data) {
  return request({
    url: `/resetPwd`,
    method: "post",
    data,
  });
}

export function queryTaskList(params) {
  return request({
    url: `/queryTaskList`,
    method: "get",
    params,
  });
}

export function addTask(data) {
  return request({
    url: `/addTask`,
    method: "post",
    data,
  });
}

export function editTask(data) {
  return request({
    url: `/editTask`,
    method: "put",
    data,
  });
}

export function updateTaskStatus(data) {
  return request({
    url: `/updateTaskStatus`,
    method: "put",
    data,
  });
}

export function updateMark(data) {
  return request({
    url: `/updateMark`,
    method: "put",
    data,
  });
}

export function deleteTask(data) {
  return request({
    url: `/deleteTask`,
    method: "delete",
    data,
  });
}
