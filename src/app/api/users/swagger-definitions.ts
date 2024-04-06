/**
 * @swagger
 * tags:
 *  - name: 用户
 *    description: 用户注册、登录、信息修改
 * definitions:
 *   UserBody:
 *     properties:
 *       avatar:
 *         type: string
 *       birthday:
 *         type: string
 *       description:
 *         type: string
 *       email:
 *         type: string
 *       gender:
 *         type: string
 *       nickname:
 *         type: string
 *       phone:
 *         type: string
 *   UserRegisterBody:
 *     required:
 *      - username
 *      - password
 *      - email
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       email:
 *         type: string
 */
