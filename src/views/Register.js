import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { register } from "@/store/actions";
import { connect } from "react-redux";
import { Form, Button, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../styles/register.less";
import { validUserName, validPass } from "@/utils/valid";
import CustomError from "@/utils/error";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formRegister: {
        userName: "",
        userEmail: "",
        userPwd: "",
      },
    };
  }
  clearInput = () => {
    this.setState({
      formRegister: {
        userName: "",
        userEmail: "",
        userPwd: "",
      },
    });
  };

  handleChangeRegister = (event) => {
    const target = event.target;
    const value = target.value;
    const id = target.id;

    const { formRegister } = this.state;
    formRegister[id] = value;

    this.setState({
      formRegister: formRegister,
    });
  };

  handleRegister = async (e) => {
    const { register, history } = this.props;
    const { formRegister } = this.state;
    if (!validUserName(formRegister.userName)) {
      message.error("Please input correct user name");
      return false;
    } else if (!validPass(formRegister.userPwd)) {
      message.error("Length of password must be 8 to 20");
      return false;
    }

    try {
      let response = await register(
        formRegister.userName,
        formRegister.userPwd
      );
      if (!response.data) return;
      if (response.code === 200) {
        this.clearInput();
        message.success("register successful");
        history.push("/");
      }
    } catch (error) {
      if (error instanceof CustomError) {
        message.error(error.description);
      } else {
        message.error(error);
      }
    }
  };

  render() {
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <div className="register-container">
        <Form
          {...layout}
          name="normal_register"
          className="register-form"
          initialValues={{
            remember: true,
          }}
          onFinish={this.handleRegister}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              id="userName"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => this.handleChangeRegister(e)}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              id="userEmail"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Email"
              onChange={(e) => this.handleChangeRegister(e)}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              id="userPwd"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              onChange={(e) => this.handleChangeRegister(e)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
            >
              Register
            </Button>
            <Link className="register-form-link" to={"login"}>
              Log in
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withRouter(
  connect((state) => ({ user: state.user }), { register })(Register)
);
