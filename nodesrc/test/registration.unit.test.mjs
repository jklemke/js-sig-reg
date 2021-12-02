import { Signature } from '../../web/js/prj/signature.mjs'
import { Registration } from '../../web/js/prj/registration.mjs'
import { test, expect, describe } from '@jest/globals'

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

test('check that core signifiers were created', () => {
  const signature = new Signature()
  const registration = new Registration(signature)
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

test('new Registration() with core Signifiers', () => {
  const signature = new Signature()
  const registration = new Registration(signature)

  expect(registration.getSignifier('rdf:type')).toBeUndefined()
  expect(registration.getSignifier('grox:hasTrait')).toBeUndefined()
  let testQName
  let testPrefLabel
  let testSignifier

  // ----------------------------------------
  testQName = 'grox:iT4tYHw9xJVf65egdT1hOtNu'
  testPrefLabel = 'indWrtAgg'
  testSignifier = registration.getSignifier(testQName)
  expect(registration.getSignifier(testQName)).not.toBeUndefined()
  expect(registration.getSignifier('indWrtAgg')).toBeUndefined()
  expect(registration.getUniqueQNameForSignifierId(testPrefLabel)).not.toBeUndefined()
  expect(
    registration.getSignifier(testQName).getQName()
  ).toBe(
    registration.getUniqueQNameForSignifierId(testPrefLabel)
  )
  expect(
    registration.getSignifier(testQName).getQName()
  ).toBe(
    registration.getUniqueQNameForSignifierId(testQName)
  )
  expect(
    registration.getSignifier(testQName).getPrefLabel()
  ).toBe(
    'indWrtAgg'
  )
  expect(
    registration.getUniqueQNameForSignifierId(testSignifier)
  ).toBe(
    registration.getUniqueQNameForSignifierId(testPrefLabel)
  )

  // ----------------------------------------
  testQName = 'grox:Kr7rkKhBHnxEo2OIddayrxZr'
  testPrefLabel = 'indHasTraitInd'
  testSignifier = registration.getSignifier(testQName)
  expect(registration.getSignifier(testQName)).not.toBeUndefined()
  expect(registration.getSignifier('indHasTraitInd')).toBeUndefined()
  expect(registration.getUniqueQNameForSignifierId(testPrefLabel)).not.toBeUndefined()
  expect(
    registration.getSignifier(testQName).getQName()
  ).toBe(
    registration.getUniqueQNameForSignifierId(testPrefLabel)
  )
  expect(
    registration.getSignifier(testQName).getQName()
  ).toBe(
    registration.getUniqueQNameForSignifierId(testQName)
  )
  expect(
    registration.getSignifier(testQName).getPrefLabel()
  ).toBe(
    'indHasTraitInd'
  )
  expect(
    registration.getUniqueQNameForSignifierId(testSignifier)
  ).toBe(
    registration.getUniqueQNameForSignifierId(testPrefLabel)
  )
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

  nomenQName = ':wolf'
  nomenPrefLabel = undefined
  expect(() => {
    registration.addSignifier(nomenQName, nomenPrefLabel)
  }).not.toThrow()

  nomenQName = 'unknown:dog'
  nomenPrefLabel = undefined
  expect(() => {
    registration.addSignifier(nomenQName, nomenPrefLabel)
  }).toThrow()

  nomenQName = 'grox:coyote'
  nomenPrefLabel = undefined
  expect(() => {
    registration.addSignifier(nomenQName, nomenPrefLabel)
  }).not.toThrow()
})

describe('attempt to add signifiers with duplicate prefLabels', () => {
  test('duplicate prefLabel', () => {
    const signature = new Signature()
    const registration = new Registration(signature)
    let nomenQName
    let nomenPrefLabel

    nomenQName = 'ex:fox'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = ':fox'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).toThrow()
  })

  test('duplicate prefLabel', () => {
    const signature = new Signature()
    const registration = new Registration(signature)
    let nomenQName
    let nomenPrefLabel

    nomenQName = ':giraffe'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = ':giraffe'
    nomenPrefLabel = 'hiawatha'
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).toThrow()
 
    nomenQName = 'grox:potato'
    nomenPrefLabel = 'spud'
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = 'grox:potato'
    nomenPrefLabel = 'tater'
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).toThrow()

    nomenQName = 'grox:house'
    nomenPrefLabel = 'domicile'
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = 'grox:house'
    nomenPrefLabel = 'domicile'
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = 'grox:building'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = 'grox:building'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()
  })

  test('duplicate prefLabel', () => {
    const signature = new Signature()
    const registration = new Registration(signature)
    let nomenQName
    let nomenPrefLabel

    nomenQName = ':wolf'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = 'ex:wolf'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).toThrow()
  })

  test('different namespace with same prefLabel', () => {
    const signature = new Signature()
    const registration = new Registration(signature)
    let nomenQName
    let nomenPrefLabel

    nomenQName = 'grox:coyote'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = 'ex:coyote'
    nomenPrefLabel = undefined
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).toThrow()
  })

  test('specified alternative prefLabel', () => {
    const signature = new Signature()
    const registration = new Registration(signature)
    let nomenQName
    let nomenPrefLabel

    nomenQName = 'grox:rabbit'
    nomenPrefLabel = 'bugs'
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()

    nomenQName = 'ex:rabbit'
    nomenPrefLabel = 'gavagai'
    expect(() => {
      registration.addSignifier(nomenQName, nomenPrefLabel)
    }).not.toThrow()
  })
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

  const copulaPrefLabel = 'subAggWrtSuperAgg'
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

  const attributumPrefLabel = 'indWrtAgg'
  const copulaPrefLabel = 'isSubTraitOf'
  const attributumQName = registration.getUniqueQNameForSignifierId(attributumPrefLabel)
  const copulaQName = registration.getUniqueQNameForSignifierId(copulaPrefLabel)

  expect(() => {
    registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
  }).not.toBeUndefined()
})

describe('attempt to add Axioms with disjoint attributums', () => {

  test('disjoint attributum test', () => {
    const signature = new Signature()
    const nomenQName = 'grox:specimenWrtSpecies'
    const nomenPrefLabel = undefined
    let attributumQName
    const registration = new Registration(signature)
    const copulaQName = registration.getUniqueQNameForSignifierId('isSubTraitOf')
    registration.addSignifier(nomenQName)

    expect(() => {
      attributumQName = registration.getUniqueQNameForSignifierId('indWrtAgg')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)

      attributumQName = registration.getUniqueQNameForSignifierId('indHasTraitInd')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
    }).not.toThrow()
  })

  test('disjoint attributum test', () => {
    const signature = new Signature()
    const nomenQName = 'grox:specimenWrtSpecies'
    const nomenPrefLabel = undefined
    let attributumQName
    const registration = new Registration(signature)
    const copulaQName = registration.getUniqueQNameForSignifierId('isSubTraitOf')
    registration.addSignifier(nomenQName)

    expect(() => {
      attributumQName = registration.getUniqueQNameForSignifierId('aggWrtInd')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)

      attributumQName = registration.getUniqueQNameForSignifierId('indHasTraitAgg')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
    }).not.toThrow()
  })

  test('disjoint attributum test', () => {
    const signature = new Signature()
    const nomenQName = 'grox:specimenWrtSpecies'
    const nomenPrefLabel = undefined
    let attributumQName
    const registration = new Registration(signature)
    const copulaQName = registration.getUniqueQNameForSignifierId('isSubTraitOf')
    registration.addSignifier(nomenQName)

    expect(() => {
      attributumQName = registration.getUniqueQNameForSignifierId('indWrtAgg')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)

      attributumQName = registration.getUniqueQNameForSignifierId('aggWrtInd')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
    }).toThrow()
  })

  test('disjoint attributum test', () => {
    const signature = new Signature()
    const nomenQName = 'grox:specimenWrtSpecies'
    const nomenPrefLabel = undefined
    let attributumQName
    const registration = new Registration(signature)
    const copulaQName = registration.getUniqueQNameForSignifierId('isSubTraitOf')
    registration.addSignifier(nomenQName)

    expect(() => {
      attributumQName = registration.getUniqueQNameForSignifierId('superAggWrtSubAgg')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)

      attributumQName = registration.getUniqueQNameForSignifierId('domainWrtSubAgg')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
    }).toThrow()
  })

  test('disjoint attributum test', () => {
    const signature = new Signature()
    const nomenQName = 'grox:specimenWrtSpecies'
    const nomenPrefLabel = undefined
    let attributumQName
    const registration = new Registration(signature)
    const copulaQName = registration.getUniqueQNameForSignifierId('isSubTraitOf')
    registration.addSignifier(nomenQName)

    expect(() => {
      attributumQName = registration.getUniqueQNameForSignifierId('indHasTraitInd')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)

      attributumQName = registration.getUniqueQNameForSignifierId('indHasTraitAgg')
      registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
    }).toThrow()
  })
})

test('new GeneralizationChain', () => {
})
