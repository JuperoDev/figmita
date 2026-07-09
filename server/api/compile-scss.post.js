import { compileString } from 'sass'

// Compiles pasted SCSS / indented-Sass for custom library components
export default defineEventHandler(async (event) => {
  const { source, syntax } = await readBody(event)
  try {
    return {
      css: compileString(source || '', {
        syntax: syntax === 'indented' ? 'indented' : 'scss',
      }).css,
    }
  } catch (err) {
    setResponseStatus(event, 400)
    return { error: err.message }
  }
})
