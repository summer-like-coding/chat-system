export class Result {
  static error(msg: string, code = -1) {
    return {
      code,
      msg,
    }
  }

  static fail<T>(msg: string, data?: T, code = -1) {
    return {
      code,
      data,
      msg,
    }
  }

  static success<T>(data: T) {
    return {
      code: 0,
      data,
      msg: 'ok',
    }
  }
}
