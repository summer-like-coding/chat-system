/**
 * @swagger
 * /api/applies/groups/[id]/:
 *   get:
 *     summary: 查询群申请信息
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
 *         description: '`ResultType<FriendApplyVo | GroupApplyVo>` 申请信息'
 */
