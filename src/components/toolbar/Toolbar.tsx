/* eslint-disable tailwindcss/no-custom-classname */
import { MessageOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Badge } from 'antd'

import './style.css'

function ToolBar() {
  return (
    <aside className="side-toolbar">
      <div className="tool-content">
        <Avatar
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
