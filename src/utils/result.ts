import { NextResponse } from 'next/server'

/**
 * 自定义结果类型
 */
export class Result {
  /**
   * 错误
   * @param msg 错误消息
   * @param code 错误代码
   * @returns JSON
   */
  static error(msg: string, code = -1) {
    return NextResponse.json({
      code,
      msg,
    })
  }

  /**
   * 失败内容
   * @param msg 失败消息
   * @param data 失败数据
   * @param code 失败代码
   * @returns JSON
   */
  static fail<T>(msg: string, data?: T, code = -1) {
    return NextResponse.json({
      code,
      data,
      msg,
    })
  }

  /**
   * 成功
   * @param data 成功数据
   * @returns JSON
   */
  static success<T>(data: T) {
    return NextResponse.json({
      code: 0,
      data,
      msg: 'ok',
    })
  }
}
