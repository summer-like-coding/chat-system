'use client'

import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

interface Props {
  spec: Record<string, unknown>
}

function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />
}

export default ReactSwagger
