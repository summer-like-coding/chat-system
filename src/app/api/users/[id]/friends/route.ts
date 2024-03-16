import type { PathIdParams } from '@/types/global'

import { friendService } from '@/services/friend'
import { userService } from '@/services/user'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'

/**
 *
 */
export async function GET(request: Request, { params }: PathIdParams) {
  try {
    const page = getPageParams(request)
    const friends = await friendService.getFriends(params.id, page)
    return Result.success(userService.asVoList(friends))
  }
  catch (e) {
    console.error('Error:', e)
    return Result.error('Internal Server Error')
  }
}
