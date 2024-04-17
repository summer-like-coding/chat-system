import type { FormInstance } from 'antd'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { Upload, message } from 'antd'
import React from 'react'

export default function UploadImg({
  accountFormRef,
}: {
  accountFormRef: FormInstance<any>
}) {
  const [loading, { setFalse: setLoadingFalse, setTrue: setLoadingTrue }] = useBoolean(false)
  const uploadButton = (
    <button style={{ background: 'none', border: 0 }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  function beforeUpload(file: File) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
      return false
    }
    return isJpgOrPng
  }

  function handleChange(info: any) {
    if (info.file.status === 'uploading') {
      setLoadingTrue()
      return
    }
    if (info.file.status === 'done') {
      setLoadingFalse()
      const imgUrl = info.file.response.data.url
      accountFormRef && accountFormRef.setFieldsValue({
        avatar: imgUrl,
      })
    }
  }

  return (
    <Upload
      action="/api/upload/files"
      beforeUpload={beforeUpload}
      listType="picture-card"
      maxCount={1}
      name="file"
      onChange={handleChange}
    >
      {uploadButton}
    </Upload>
  )
}
