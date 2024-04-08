/**
 * 搜索用户好友列表
 * @swagger
 * /api/users/[id]/friends/search/:
 *   post:
 *     summary: 搜索用户好友列表 @todo
 *     description: 需要鉴权，仅用户自己可查询
 *     tags:
 *      - 用户
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 用户 ID
 *        required: true
 *        type: string
 *      - name: page
 *        in: query
 *        description: 页码
 *        required: false
 *        type: integer
 *        default: 1
 *      - name: size
 *        in: query
 *        description: 每页数量
 *        required: false
 *        type: integer
 *        default: 10
 *     responses:
 *       200:
 *         description: '`ResultType<User[]>` 用户列表'
 */
