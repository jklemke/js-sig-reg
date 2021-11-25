import { greeting } from '../../web/js/lib/hello.mjs'
// const greeting = require('../../web/js/lib/hello.mjs')

test('getting started', () => {
  expect(greeting('jest')).toBe('Hello, jest. This is hello.mjs.')
})

// console.log(greeting('nodesrc/main.mjs'))
