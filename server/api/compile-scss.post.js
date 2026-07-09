import { compileString } from 'sass'

// Compiles pasted SCSS for custom library components
export default defineEventHandler(async (event) => {
  const { source } = await readBody(event)
  try {
    return { css: compileString(source || '').css }
  } catch (err) {
    setResponseStatus(event, 400)
    return { error: err.message }
  }
})
