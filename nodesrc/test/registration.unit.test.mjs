import { Signature } from '../../web/js/prj/signature.mjs'
import { Registration } from '../../web/js/prj/registration.mjs'

test('new Registration() with Signature()', () => {
  expect(() => {
    new Registration()
  }).toThrow()

  let signature = { junk: 'bad property' }
  expect(() => {
    new Registration(signature)
  }).toThrow()

  signature = new Signature()
  expect(new Registration(signature)).not.toBeUndefined()
})

test('new Registration() with core Signifiers', () => {
  const signature = new Signature()
  const registration = new Registration(signature)

  expect(registration.getSignifier('rdf:type')).toBeUndefined()
  expect(registration.getSignifier('grox:hasTrait')).toBeUndefined()
  expect(registration.getSignifier('partWrtGen')).toBeUndefined()

  expect(registration.getSignifier('grox:iT4tYHw9xJVf65egdT1hOtNu')).not.toBeUndefined()
  expect(registration.getSignifier('grox:Fy28scb0taxYGdYeexBx3365')).not.toBeUndefined()
  expect(registration.getSignifier('grox:LY41ZUMrKdPh9G3w6b2rxFUY')).not.toBeUndefined()
  expect(registration.getSignifier('grox:QT64ORWiazZEsiU9k2pfhDUf')).not.toBeUndefined()
  expect(registration.getSignifier('grox:QQ46Ef5vecHgr6ctohqU1pTo')).not.toBeUndefined()
  expect(registration.getSignifier('grox:Wb4bglkQ9PrEt3C7y0YCOqpA')).not.toBeUndefined()
  expect(registration.getSignifier('grox:Kr7rkKhBHnxEo2OIddayrxZr')).not.toBeUndefined()
  expect(registration.getSignifier('grox:SW6KX6Y8QRKPpzEoJYoAD4Ya')).not.toBeUndefined()
  expect(registration.getSignifier('grox:Ov4ItKWDuLMVUAlrbDfgBXkW')).not.toBeUndefined()
  expect(registration.getSignifier('grox:WW6JqN8iMmQcvwrRYxDub7N7')).not.toBeUndefined()
  expect(registration.getSignifier('grox:VW4TIqnPANbf73SKLB1pXWr0')).not.toBeUndefined()
  expect(registration.getSignifier('grox:mi1vJ1s5GHf2dD8lswGIyddE')).not.toBeUndefined()
})

test('new GeneralizationChain', () => {
})

test('disjoint Attributum', () => {
})
