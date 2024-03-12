import { NextResponse } from 'next/server'

export class Result {
  static error(msg: string, code = -1) {
    return NextResponse.json({
      code,
      msg,
    })
  }

  static fail<T>(msg: string, data?: T, code = -1) {
    return NextResponse.json({
      code,
      data,
      msg,
    })
  }

  static success<T>(data: T) {
    return NextResponse.json({
      code: 0,
      data,
      msg: 'ok',
    })
  }
}
