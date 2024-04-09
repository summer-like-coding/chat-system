/**
 * @swagger
 * /api/applies/groups/[id]:
 *   get:
 *     summary: 查询群申请信息 @todo
 *     tags:
 *      - 申请
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 申请 ID
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: '`ResultType<GroupApplyVo & { group: GroupVo }>` 申请信息'
 */
