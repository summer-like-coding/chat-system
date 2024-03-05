/* eslint-disable tailwindcss/no-custom-classname */

import { MessageOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Badge } from 'antd'
import { useRouter } from 'next/navigation'

import './style.css'

function ToolBar() {
  const router = useRouter()
  function checkLogin() {
    // 跳转到登录页面
    router.push('/login')
  }
  return (
    <aside className="side-toolbar">
      <div className="tool-content">
        <Avatar
          onClick={checkLogin}
          shape="square"
          size={32}
          style={{
            backgroundColor: '#fde3cf',
            color: '#f56a00',
            margin: '16px auto',
          }}
        >
          S
        </Avatar>
        <div>
          <Badge overflowCount={99}>
            <MessageOutlined
              className="tool-icon"
              style={{ color: '#848484', fontSize: 28 }}
            />
          </Badge>
        </div>
      </div>
      <div className="tool-footer">
        <Badge overflowCount={99}>
          <SettingOutlined
            className="tool-icon"
            style={{ color: '#848484', fontSize: 28 }}

          />
        </Badge>
      </div>
    </aside>
  )
}

export default ToolBar
