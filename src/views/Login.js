import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, Button, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { validUserName, validPass } from "@/utils/valid";
import { login } from "@/store/actions";
import { connect } from "react-redux";
import "../styles/login.less";
import CustomError from "@/utils/error";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formLogin: {
        userName: "",
        userPwd: "",
      },
    };
  }

  clearInput = () => {
    this.setState({
      formLogin: {
        userName: "",
        userPwd: "",
      },
    });
  };

  handleChangeLogin = (event) => {
    const target = event.target;
    const value = target.value;
    const id = target.id;

    const { formLogin } = this.state;
    formLogin[id] = value;

    this.setState({
      formLogin: formLogin,
    });
  };

  handleLogin = async (e) => {
    const { login, history } = this.props;
    const { user } = this.props;
    const { formLogin } = this.state;

    if (!validUserName(formLogin.userName)) {
      message.error("Please input correct user name");
      return false;
    }

    if (!validPass(formLogin.userPwd)) {
      message.error("Length of password must be 8 to 20");
      return false;
    }

    try {
      let response = await login(formLogin.userName, formLogin.userPwd);
      if (!response.data) return;
      if (response.code === 200) {
        this.clearInput();
        // console.log(user);
        message.success("login successful");
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
      <div className="login-container">
        <Form
          {...layout}
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={this.handleLogin}
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
              onChange={(e) => this.handleChangeLogin(e)}
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
              onChange={(e) => this.handleChangeLogin(e)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            <Link className="login-form-link" to={"register"}>
              Register
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withRouter(
  connect((state) => ({ user: state.user }), { login })(Login)
);
