import { SkinOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Layout, Menu } from 'antd'
import React from 'react'

export default function Setting() {
  const { Content, Sider } = Layout
  const [selectedKey, _setSelectedKey] = React.useState<string>('appearance')

  function appearanceItem() {
    return (
      <Form>
        <Form.Item label="主题设置">
          <select className="w-full">
            <option>默认</option>
            <option>暗黑</option>
          </select>
        </Form.Item>
        <Form.Item label="聊天背景色">
          <select className="w-full">
            <option>默认</option>
            <option>暗黑</option>
          </select>
        </Form.Item>
      </Form>
    )
  }

  const menuItemList = {
    account: {
      content: <></>,
      icon: UserOutlined,
      title: '账号',
    },
    appearance: {
      content: appearanceItem(),
      icon: SkinOutlined,
      title: '外观',
    },
  }

  const menuItem = Object.values(menuItemList).map(
    ({ icon, title }, index) => ({
      icon: React.createElement(icon),
      key: String(index + 1),
      label: title,
    }),
  )
  return (
    <Layout className="h-auto w-full">
      <Sider className="bg-slate-200 text-center text-white" width="25%">
        <Menu items={menuItem} />
      </Sider>
      <Layout>
        <Content>{menuItemList[selectedKey as keyof typeof menuItemList].content}</Content>
      </Layout>
    </Layout>
  )
}
