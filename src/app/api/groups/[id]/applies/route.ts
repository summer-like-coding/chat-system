/**
 * 查询群组申请列表
 * @swagger
 * /api/groups/[id]/applies:
 *   get:
 *     summary: 查询群组申请列表 @todo
 *     tags:
 *      - 群组
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 群组 ID
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
 *      - name: status
 *        in: query
 *        description: 状态
 *        required: false
 *        type: string
 *        default: ''
 *     responses:
 *       200:
 *         description: '`ResultType<GroupApplyVo[]>` 群组申请列表'
 */
