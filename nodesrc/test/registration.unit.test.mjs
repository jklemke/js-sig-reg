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

test('add signifier with and without namespace', () => {
  const signature = new Signature()
  const registration = new Registration(signature)
  let nomenQName
  let nomenPrefLabel

  nomenQName = 'fox'
  nomenPrefLabel = undefined
  expect(() => {
    registration.addSignifier(nomenQName, nomenPrefLabel)
  }).toThrow()

  nomenQName = ':fox'
  nomenPrefLabel = undefined
  expect(() => {
    registration.addSignifier(nomenQName, nomenPrefLabel)
  }).not.toThrow()

  nomenQName = 'unknown:fox'
  nomenPrefLabel = undefined
  expect(() => {
    registration.addSignifier(nomenQName, nomenPrefLabel)
  }).toThrow()

  nomenQName = 'grox:fox'
  nomenPrefLabel = undefined
  expect(() => {
    registration.addSignifier(nomenQName, nomenPrefLabel)
  }).not.toThrow()
})

test('add Axiom using core signifiers', () => {
  const signature = new Signature()
  const registration = new Registration(signature)

  const nomenQName = 'grox:fox'
  const nomenPrefLabel = undefined
  registration.addSignifier(nomenQName, nomenPrefLabel)

  const attributumQName = 'grox:canine'
  const attributumPrefLabel = undefined
  registration.addSignifier(attributumQName, attributumPrefLabel)

  const copulaPrefLabel = 'subGenWrtSuperGen'
  const copulaQName = registration.getUniqueQNameForSignifierId(copulaPrefLabel)

  expect(() => {
    registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
  }).not.toBeUndefined()
})

test('add Axiom using isSubTraitOf', () => {
  const signature = new Signature()
  const registration = new Registration(signature)

  const nomenQName = 'grox:XJ3h0vQrSCvcqech7CwpXHZ0'
  const nomenPrefLabel = 'specimenWrtSpecies'
  registration.addSignifier(nomenQName, nomenPrefLabel)

  const attributumPrefLabel = 'partWrtGen'
  const copulaPrefLabel = 'isSubTraitOf'
  const attributumQName = registration.getUniqueQNameForSignifierId(attributumPrefLabel)
  const copulaQName = registration.getUniqueQNameForSignifierId(copulaPrefLabel)

  expect(() => {
    registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
  }).not.toBeUndefined()
})

test('new GeneralizationChain', () => {
})

test('disjoint Attributum', () => {
})
