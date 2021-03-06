// @flow
import React, { Component } from "react";
import { Input, Button, Form, Switch } from 'antd';
import Page from '../../components/public/page'
import { connect } from "react-redux";
import { dispatchType, formType, handleSubmitType } from "../../utils/flow";
import { publicFunction } from "../../utils";
import { getExpressInfo, editExpress } from "../../actions/deliver/express";

const {
    parseQuery
} = publicFunction

const FormItem = Form.Item;
type Props = {
    form: formType,
    dispatch: dispatchType,
    editExpress: Function,
    location: {
        search: string,
    }
}
type State = {
    info: {
        id: number,
        company_name: string,
        is_commonly_use: number,
    }
}
@Form.create()
@connect()
export default class ExpressEdit extends Component<Props, State> {
    state = {
        areaList: [],
        info: {
            id: 0,
            company_name: '',
            is_commonly_use: 0,
        }
    }

    async componentDidMount() {
        const { location } = this.props
        const { id } = parseQuery(location.search)
        const e = await getExpressInfo({ params: { id } })
        if (e.code === 0) {
            const { info } = e.result
            this.setState({ info })
        }

    }

    handleSubmit = (e: handleSubmitType) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { dispatch } = this.props
                const { id } = parseQuery(this.props.location.search)
                let params = {
                    id,
                    company_name: values.company_name,
                    is_commonly_use: values.is_commonly_use ? 1 : 0,
                }
                dispatch(editExpress({ params }))
            }
        });
    }

    render() {
        const { info } = this.state
        const { company_name, is_commonly_use } = info
        console.log(is_commonly_use)
        const { getFieldDecorator } = this.props.form
        return (
            <Page>
                <Form onSubmit={this.handleSubmit} style={{ width: 1000 }}>
                    <FormItem
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 4 }}
                        label='物流公司名称'
                    >
                        {getFieldDecorator('company_name', {
                            initialValue: company_name,
                            rules: [{ required: true, message: '请输入物流公司名称' }],
                        })(
                            <Input
                                placeholder="请输入物流公司名称"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 6 }}
                        label='设为常用'
                    >
                        {getFieldDecorator('is_commonly_use', {
                            initialValue: !!is_commonly_use,
                            valuePropName: 'checked',
                            rules: [{ required: true, message: '请选择是否常用' }],
                        })(
                            <Switch />
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ sm: { offset: 3 } }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            保存
                        </Button>
                    </FormItem>
                </Form>
            </Page>
        )
    }
}
