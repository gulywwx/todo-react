import React, { useState } from "react";
import "@/styles/header.less";
import avatar from "@/assets/avatar.jpg";
import { DownOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Modal, Form, Button, Input, message } from "antd";
import store from "@/store";
import { logout } from "@/store/actions";
import { validPass } from "@/utils/valid";
import { resetPwd } from "@/utils/api";
import CustomError from "@/utils/error";

const ModifyUserForm = (props) => {
  const { loading, visible, onOk, onCancel } = props;
  const formItemLayout = {
    labelCol: {
      sm: { span: 6 },
    },
    wrapperCol: {
      sm: { span: 12 },
    },
  };

  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      centered
      title="Modify Password"
      okText="confirm"
      cancelText="Cancel"
      onCancel={handleCancel}
      onOk={handleOk}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} {...formItemLayout} name="form_in_modal">
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[{ required: true, message: "Please input old password" }]}
        >
          <Input
            type="password"
            placeholder="Please input old password"
            maxLength={20}
          />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please input new password" }]}
        >
          <Input
            type="password"
            placeholder="Please input new password"
            maxLength={20}
          />
        </Form.Item>
        <Form.Item
          label="Confirm"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm new password" }]}
        >
          <Input
            type="password"
            placeholder="Please confirm new password"
            maxLength={20}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Header = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClick = (e) => {
    console.log(e.key);
    if (e.key === "1") {
      setVisible(true);
    } else {
      store.dispatch(logout());
    }
  };

  const onOk = async (values) => {
    console.log("Received values of form: ", values);

    if (!validPass(values.oldPassword)) {
      message.error("Length of old password must be 8 to 20");
      return false;
    } else if (!validPass(values.newPassword)) {
      message.error("Length of new password must be 8 to 20");
      return false;
    } else if (!validPass(values.confirmPassword)) {
      message.error("confirm password is wrong");
      return false;
    } else if (values.confirmPassword !== values.newPassword) {
      message.error("The two password are not the same");
      return false;
    }

    setLoading(true);
    console.log(store.getState().user.data);
    let username = store.getState().user.data.user.name;

    let data = {
      username: username,
      oldPassword: values.oldPassword,
      newPassword: values.confirmPassword,
    };

    try {
      let response = await resetPwd(data);
      setLoading(false);
      if (response.code === 200) {
        setVisible(false);
        message.success("password reset successful");
      } else {
        message.error(response.data);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof CustomError) {
        message.error(error.description);
      } else {
        message.error(error);
      }
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">Password Change</Menu.Item>
      <Menu.Item key="2">Quit</Menu.Item>
    </Menu>
  );

  return (
    <div className="header-container">
      <div className="header">
        <Dropdown overlay={menu}>
          <a
            className="dropdown-link"
            href="/#"
            onClick={(e) => e.preventDefault()}
          >
            <span className="username">
              {store.getState().user.data.user.name}
            </span>
            <img className="avatar" src={avatar} alt="" />
            <DownOutlined />
          </a>
        </Dropdown>
      </div>

      <ModifyUserForm
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={onCancel}
      />
    </div>
  );
};

export default Header;
