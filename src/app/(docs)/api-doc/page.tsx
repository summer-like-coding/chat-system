import ReactSwagger from '@/app/(docs)/api-doc/react-swagger'
import { getApiDocs } from '@/lib/swagger'

export default async function IndexPage() {
  const spec = await getApiDocs() as Record<string, unknown>
  return (
    <section className="container overflow-auto">
      <ReactSwagger spec={spec} />
    </section>
  )
}
