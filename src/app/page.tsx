'use client'

import Authenticated from '@/components/auth/Authenticated'
import { SmileOutlined } from '@ant-design/icons'
import { Result } from 'antd'

export default function Page() {
  return (
    <>
      <Authenticated />
      <div className="flex size-full">
        <div className="w-full">
          <Result
            icon={<SmileOutlined />}
            title="很好，你已经进入应用"
          />
        </div>
      </div>
    </>
  )
}
