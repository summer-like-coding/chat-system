'use client'

import { Result } from 'antd'
import React from 'react'

const Error: React.FC = () => (
  <Result
    status="error"
    subTitle="Please check and modify the following information before resubmitting."
    title="Submission Failed"
  >
  </Result>
)

export default Error
