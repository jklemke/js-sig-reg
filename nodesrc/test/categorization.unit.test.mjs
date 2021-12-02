import { Signature } from '../../web/js/prj/signature.mjs'
import { Registration } from '../../web/js/prj/registration.mjs'
import { Categorization } from '../../web/js/prj/categorization.mjs'
import { test, expect } from '@jest/globals'

test('new Categorization() with Registration()', () => {
  let categorization
  let registration

  expect(() => {
    categorization = new Categorization()
  }).toThrow()

  let signature = { junk: 'bad property' }
  expect(() => {
    registration = new Registration(signature)
  }).toThrow()

  signature = new Signature()
  registration = { rubbish: 'stupid property' }
  expect(() => {
    categorization = new Categorization(registration)
  }).toThrow()

  registration = new Registration(signature)
  expect(categorization = new Categorization(registration)).not.toBeUndefined()
 
})

test('new Categorization() with core Signifiers', () => {
  const signature = new Signature()
  const registration = new Registration(signature)
  const categorization = new Categorization(registration)

  expect(registration.getSignifier('grox:XJ3h0vQrSCvcqech7CwpXHZ0')).not.toBeUndefined()
  expect(registration.getSignifier('grox:WK0CjxWXN1z9mhoT5SSsNP2U')).not.toBeUndefined()
  expect(registration.getSignifier('grox:H57135RLXgbxpQdKYVI94my1')).not.toBeUndefined()
  expect(registration.getSignifier('grox:sA0oWPZh76OPzJontiufRvS5')).not.toBeUndefined()
  expect(registration.getSignifier('grox:xo57ra1o9uvkpd1amXFtLRZg')).not.toBeUndefined()
  expect(registration.getSignifier('grox:U02oAeuYZgCvsroCSF1N49J9')).not.toBeUndefined()
})
