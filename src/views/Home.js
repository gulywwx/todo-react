import * as React from "react";
import Header from "@/components/Header";
import {
  Form,
  Button,
  Input,
  Space,
  Select,
  Table,
  Pagination,
  Drawer,
  DatePicker,
  message,
} from "antd";
import { StarOutlined, StarTwoTone, PlusOutlined } from "@ant-design/icons";
import {
  queryTaskList,
  addTask,
  editTask,
  updateTaskStatus,
  updateMark,
  deleteTask,
} from "@/utils/api";
import CustomError from "@/utils/error";
import "@/styles/home.less";
import moment from "moment";

const AddEditTaskForm = (props) => {
  const {
    title,
    textBtn,
    visible,
    currentRowData,
    onSubmitDrawer,
    onCloseDrawer,
  } = props;
  const [form] = Form.useForm();
  console.log("currentRowData===", currentRowData);
  setTimeout(() => {
    form.setFieldsValue(currentRowData);
  }, 100);
  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (title === "Add Task") {
          onSubmitDrawer(values, 1);
        } else {
          onSubmitDrawer(values, 2);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const onReset = () => {
    form.resetFields();
  };

  const onClose = () => {
    form.resetFields();
    onCloseDrawer();
  };

  return (
    <Drawer
      forceRender
      title={title}
      width={600}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      maskClosable={false}
      footer={
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button onClick={onSubmit} type="primary">
            {textBtn}
          </Button>
          <Button onClick={onReset}>Reset</Button>
          <Button onClick={onClose} danger>
            Cancel
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title" }]}
        >
          <Input placeholder="Please input title" />
        </Form.Item>
        <Form.Item
          label="Expire Date"
          name="date"
          rules={[{ required: true, message: "Please choose expire date" }]}
        >
          <DatePicker
            inputReadOnly={true}
            placeholder="Please choose expire date"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input content" }]}
        >
          <Input.TextArea
            rows={7}
            placeholder="Please input content"
            className="textarea"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      pageNo: 1,
      pageSize: 10,
      loading: false,
      textBtn: "Submit",
      title: "Add Task",
      currentRowData: {
        id: -1,
        title: "",
        date: "",
        content: "",
      },
      visible: false,

      status: null, // 0：Todo 1：Complete 2: Deleted
      dataSource: [],
      columns: [
        {
          title: "ID",
          key: "req",
          align: "center",
          render: (text, record, index) => {
            let num = (this.state.pageNo - 1) * 10 + index + 1;
            return num;
          },
        },
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
          render: (text, record, index) => {
            const fav = this.state.dataSource[index].is_major;
            const style = {
              cursor: "pointer",
              fontSize: "16px",
            };

            const icon =
              fav === false ? (
                <StarOutlined style={style} />
              ) : (
                <StarTwoTone style={style} twoToneColor="#f50" />
              );

            return (
              <div>
                <span onClick={() => this.toggleFav(record, index)}>
                  {icon}
                </span>
                {record.title}
              </div>
            );
          },
        },
        {
          title: "Content",
          dataIndex: "content",
          key: "content",
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: 120,
          render: (text, record) => {
            const txt =
              record.status === 0
                ? "Todo"
                : record.status === 1
                ? "Done"
                : "Deleted";
            return txt;
          },
        },
        {
          title: "Action",
          key: "action",
          width: 300,
          align: "center",
          render: (text, record, index) => (
            <Space size="middle">
              <Button
                style={{
                  marginRight: "10px",
                  display: record.status !== 2 ? "" : "none",
                }}
                onClick={() => this.editTask(record, index)}
              >
                Edit
              </Button>
              <Button
                type="primary"
                ghost
                style={{
                  marginRight: "10px",
                  display: record.status !== 2 ? "" : "none",
                }}
                onClick={() => this.completeTask(record)}
              >
                {record.status === 0
                  ? "Complete"
                  : record.status === 1
                  ? "Todo"
                  : null}
              </Button>
              <Button
                danger
                style={{ display: record.status !== 2 ? "" : "none" }}
                onClick={() => this.removeTask(record.id)}
              >
                Delete
              </Button>
            </Space>
          ),
        },
      ],
    };
  }

  toggleFav = async (record, index) => {
    if (record.status === 2) {
      message.error("The data has been deleted");
    } else {
      let data = {
        id: record.id,
        is_major: this.state.dataSource[index].is_major === true ? false : true,
      };

      updateMark(data).then((res) => {
        console.log("update mark===", res);
        if (res.code === 200) {
          this.setState(
            {
              pageNo: 1,
            },
            () => {
              this.getTaskList();
              message.success("update successful");
            }
          );
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  getTaskList = async () => {
    const { pageNo, pageSize, status } = this.state;
    this.setState({
      loading: true,
    });

    let params = {
      pageNo: pageNo,
      pageSize: pageSize,
      status: status,
    };

    try {
      let response = await queryTaskList(params);
      console.log("task list===", response);
      this.setState({
        loading: false,
      });
      if (response.code === 200 && response.data) {
        this.setState({
          dataSource: response.data.rows.sort(function (a, b) {
            return a.id - b.id;
          }),
          total: response.data.total,
        });
      } else {
        this.setState({
          dataSource: [],
          total: 0,
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
      });
      if (error instanceof CustomError) {
        message.error(error.description);
      } else {
        message.error(error);
      }
    }
  };

  changePage = (pageNo) => {
    console.log("pageNo=", pageNo);
    this.setState(
      {
        pageNo,
      },
      () => {
        this.getTaskList();
      }
    );
  };

  handleChange = (value) => {
    this.setState(
      {
        status: typeof value === "string" ? null : value,
        pageNo: 1,
      },
      () => {
        this.getTaskList();
      }
    );
  };

  addTask = () => {
    this.setState({
      title: "Add Task",
      textBtn: "Submit",
      visible: true,
      currentRowData: {
        id: -1,
        title: "",
        date: "",
        content: "",
      },
    });
  };

  removeTask = async (id) => {
    let data = {
      id: id,
      status: 2,
    };

    try {
      let response = await deleteTask(data);
      if (response.code === 200 && response.data) {
        this.setState(
          {
            pageNo: 1,
          },
          () => {
            this.getTaskList();
            message.success("the task is deleted");
          }
        );
      } else {
        message.error(response.msg);
      }
    } catch (error) {
      message.error(error.description);
    }
  };

  editTask = (record, index) => {
    console.log("edit task===", record);
    this.setState({
      title: "Edit Task",
      textBtn: "Save",
      visible: true,
      currentRowData: {
        id: record.id,
        title: record.title,
        date: moment(record.expired),
        content: record.content,
      },
    });
  };

  completeTask = async (record) => {
    let status = record.status === 0 ? 1 : record.status === 1 ? 0 : null;

    let data = {
      id: record.id,
      status: status,
    };

    try {
      let response = await updateTaskStatus(data);
      if (response.code === 200 && response.data) {
        this.setState(
          {
            pageNo: 1,
          },
          () => {
            this.getTaskList();
            message.success("the task status is updated");
          }
        );
      } else {
        message.error(response.msg);
      }
    } catch (error) {
      message.error(error.description);
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
      currentRowData: {
        id: -1,
        Title: "",
        date: "",
        Content: "",
      },
    });
  };

  onSubmit = async (values, type) => {
    const { currentRowData } = this.state;
    if (type === 1) {
      let data = {
        title: values.title,
        expired: moment(values.date).valueOf(),
        content: values.content,
      };

      try {
        let response = await addTask(data);

        this.setState({
          visible: false,
        });
        if (response.code === 200 && response.data) {
          this.setState(
            {
              pageNo: 1,
            },
            () => {
              this.getTaskList();
              message.success(`Add new task <${values.title}> successfully`);
            }
          );
        } else {
          message.error(response.msg);
        }
      } catch (error) {
        this.setState({
          visible: false,
        });
        message.error(error.description);
      }
    } else if (type === 2) {
      let data = {
        id: currentRowData.id,
        title: values.title,
        expired: moment(values.date).valueOf(),
        content: values.content,
      };

      try {
        let response = await editTask(data);

        this.setState({
          visible: false,
        });
        if (response.code === 200 && response.data) {
          this.setState(
            {
              pageNo: 1,
            },
            () => {
              this.getTaskList();
              message.success(`Update task <${values.title}> successfully`);
            }
          );
        } else {
          message.error(response.msg);
        }
      } catch (error) {
        this.setState({
          visible: false,
        });
        message.error(error.description);
      }
    }
  };

  componentDidMount() {
    console.log("componentDidMount===");
    this.getTaskList();
  }

  render() {
    const {
      total,
      pageNo,
      pageSize,
      loading,
      dataSource,
      columns,
      visible,
      title,
      textBtn,
      currentRowData,
    } = this.state;

    return (
      <div className="home-container">
        <Header curActive={"active"} />
        <div className="content clearfix">
          <div className="list">
            <h2>Task List</h2>
            <div className="list-right">
              <Space size="middle">
                <Select
                  size="large"
                  onChange={this.handleChange}
                  style={{ width: 160 }}
                  allowClear
                  placeholder="Please filter task status"
                >
                  <Select.Option value="">All</Select.Option>
                  <Select.Option value={0}>Todo</Select.Option>
                  <Select.Option value={1}>Done</Select.Option>
                </Select>
                <Button type="primary" size="large" onClick={this.addTask}>
                  <PlusOutlined /> Add new task
                </Button>
              </Space>
            </div>
          </div>

          <Table
            bordered
            rowKey={(record) => record.id}
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            pagination={false}
          />
          <Pagination
            className="pagination"
            total={total}
            style={{ display: loading && total === 0 ? "none" : "" }}
            showTotal={(total) => `Total ${total} data`}
            onChange={this.changePage}
            current={pageNo}
            showSizeChanger={false}
            defaultPageSize={pageSize}
            hideOnSinglePage={false}
          />
        </div>
        <AddEditTaskForm
          title={title}
          textBtn={textBtn}
          visible={visible}
          currentRowData={currentRowData}
          onSubmitDrawer={this.onSubmit}
          onCloseDrawer={this.onClose}
        />
      </div>
    );
  }
}

export default Home;
