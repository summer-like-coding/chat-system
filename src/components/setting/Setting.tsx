import { useGlobalStore } from '@/app/store/global'
import { SkinOutlined, UserOutlined } from '@ant-design/icons'
import { Button, ColorPicker, DatePicker, Form, Input, Layout, Menu, Select, Switch } from 'antd'
import React from 'react'

export default function Setting() {
  const [accountFormRef] = Form.useForm()
  const [appearanceFormRef] = Form.useForm()
  const { Content, Sider } = Layout
  const [selectedKey, setSelectedKey] = React.useState<string>('account')
  const setChatBg = useGlobalStore(state => state.setChatBg)
  const toggleTheme = useGlobalStore(state => state.toggleTheme)
  const apperanceConfig = useGlobalStore(state => state.apperanceConfig)

  function saveUserInfo() {
    // console.log('保存用户信息')
  }

  function saveAppearanceInfo() {
    setChatBg(appearanceFormRef.getFieldValue('chatbg'))
    toggleTheme(appearanceFormRef.getFieldValue('theme'))
  }

  function appearanceItem() {
    return (
      <Form
        form={appearanceFormRef}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="主题设置"
          name="theme"
        >
          <Switch
            checkedChildren="light"
            defaultChecked={apperanceConfig.theme === 'light'}
            onChange={checked => appearanceFormRef.setFieldValue('theme', checked ? 'light' : 'dark')}
            unCheckedChildren="dark"
          />
        </Form.Item>
        <Form.Item
          label="聊天背景色"
          name="chatbg"
        >
          <ColorPicker
            defaultValue={apperanceConfig.chatbg}
            onChange={color => appearanceFormRef.setFieldValue('chatbg', color.toHexString())}
          />
        </Form.Item>
        <Form.Item wrapperCol={{
          offset: 8,
          span: 16,
        }}
        >
          <Button htmlType="submit" onClick={saveAppearanceInfo}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    )
  }

  function accountItem() {
    return (
      <Form
        form={accountFormRef}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="用户名">
          <Input className="w-full" />
        </Form.Item>
        <Form.Item label="密码">
          <Input.Password className="w-full" />
        </Form.Item>
        <Form.Item label="邮箱">
          <Input className="w-full" />
        </Form.Item>
        <Form.Item label="出生日期">
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item label="性别">
          <Select
            className="w-full"
            options={[{
              label: '男',
              value: '0',
            }, {
              label: '女',
              value: '1',
            }]}
          />
        </Form.Item>
        <Form.Item wrapperCol={{
          offset: 8,
          span: 16,
        }}
        >
          <Button htmlType="submit" onClick={saveUserInfo}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    )
  }

  const menuItemList = {
    account: {
      content: accountItem(),
      icon: UserOutlined,
      key: 'account',
      title: '账号',
    },
    appearance: {
      content: appearanceItem(),
      icon: SkinOutlined,
      key: 'appearance',
      title: '外观',
    },
  }

  const menuItem = Object.values(menuItemList).map(
    ({ icon, key, title }) => ({
      icon: React.createElement(icon),
      key,
      label: title,
    }),
  )
  return (
    <Layout className="h-auto w-full">
      <Sider className="bg-slate-200 text-center text-white" width="25%">
        <Menu
          defaultOpenKeys={['account']}
          items={menuItem}
          onSelect={({ key }) => {
            setSelectedKey(key)
          }}
          style={{
            height: '100%',
          }}
          theme="light"
        />
      </Sider>
      <Layout>
        <Content
          style={{
            backgroundColor: '#fff',
          }}
        >
          {menuItemList[selectedKey as keyof typeof menuItemList].content}
        </Content>
      </Layout>
    </Layout>
  )
}
