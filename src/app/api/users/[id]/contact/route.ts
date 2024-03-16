import type { PathIdParams } from '@/types/global'

import { contactService } from '@/services/contact'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'

/**
 * 查询用户对话信息
 */
export async function GET(request: Request, { params }: PathIdParams) {
  try {
    const page = getPageParams(request)
    const contacts = await contactService.getByUserId(params.id, page)
    return Result.success(contactService.asVoList(contacts))
  }
  catch (e) {
    console.error('Error:', e)
    return Result.error('Internal Server Error')
  }
}
