import type { NextRequest } from 'next/server'

import { userService } from '@/services/user'
import { Result } from '@/utils/result'

/**
 * 注册新用户
 * @swagger
 * /api/users/resigter/:
 *   post:
 *     summary: 注册新用户
 *     description: |
 *      - 用户名规范：`^[0-9A-Za-z-_]{4,16}$`，4-16 位字母、数字、下划线或短横线
 *      - 密码规范：`^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\da-zA-Z\s]).{8,20}$`，8-20 位字符，包含数字、字母和特殊字符
 *      - 邮箱规范：`^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$`，邮箱格式
 *     tags:
 *      - 用户
 *     requestBody:
 *       description: '`{ username: string, password: string, email: string }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/definitions/UserRegisterBody'
 *     responses:
 *       200:
 *         description: '`ResultType<UserVo>` 用户信息'
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json()
    if (!username || !password || !email) {
      return Result.error('用户名、密码和邮箱不能为空')
    }
    if (!(typeof username === 'string') || (
      /^[0-9A-Za-z-_]{4,16}$/.test(username)
    )) {
      return Result.error('用户名不符合规范，请使用 4-16 位字母、数字、下划线或短横线')
    }
    if (!(typeof password === 'string') || (
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\da-zA-Z\s]).{8,20}$/
    )) {
      return Result.error('密码不符合规范，请使用 8-20 位字符，包含数字、字母和特殊字符')
    }
    if (!(typeof email === 'string') || (
      /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
    )) {
      return Result.error('邮箱不符合规范')
    }

    const user = await userService.registerUser({
      email,
      password,
      username,
    })
    return Result.success(userService.asVo(user))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
