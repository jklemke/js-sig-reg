import { Signature } from '../../web/js/prj/signature.mjs'

test('new Signature()', () => {
  expect(new Signature()).not.toBeUndefined()
})

test('new Signature().addNamespace()', () => {
  expect(new Signature().addNamespace('rdf', 'type')).not.toBeUndefined()
})


test('add single namespace', () => {
  const signature = new Signature()
  const namespaces = signature.addNamespace('grox', 'http://grox.info/')
  expect(namespaces).not.toBeUndefined()
  expect(namespaces.grox).toEqual('http://grox.info/')
})

test('add multiple namespaces', () => {
  const signature = new Signature()
  signature.addNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  signature.addNamespace('rdfs', 'http://www.w3.org/2000/01/rdf-model#')
  signature.addNamespace('dc', 'http://purl.org/dc/elements/1.1/')
  signature.addNamespace('owl', 'http://www.w3.org/2002/07/owl#')
  signature.addNamespace('ex', 'http://www.example.org/')
  signature.addNamespace('xsd', 'http://www.w3.org/2001/XMLmodel#')
  signature.addNamespace('skos', 'http://www.w3.org/2004/02/skos/core#')
  signature.addNamespace('foaf', 'http://xmlns.com/foaf/0.1/')
  signature.addNamespace('grox', 'http://grox.info/')
  const namespaces = signature.getNamespaces()
  expect(namespaces).not.toBeUndefined()
  expect(Object.keys(namespaces).length).toBe(9)
  expect(namespaces.rdf).toEqual('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  expect(namespaces.rdfs).toEqual('http://www.w3.org/2000/01/rdf-model#')
  expect(namespaces.dc).toEqual('http://purl.org/dc/elements/1.1/')
  expect(namespaces.owl).toEqual('http://www.w3.org/2002/07/owl#')
  expect(namespaces.ex).toEqual('http://www.example.org/')
  expect(namespaces.xsd).toEqual('http://www.w3.org/2001/XMLmodel#')
  expect(namespaces.skos).toEqual('http://www.w3.org/2004/02/skos/core#')
  expect(namespaces.foaf).toEqual('http://xmlns.com/foaf/0.1/')
  expect(namespaces.grox).toEqual('http://grox.info/')
})

test('add signifier with and without namespace', () => {
  const signature = new Signature()
  let nomenQName
  let nomenPrefLabel

  nomenQName = 'fox'
  nomenPrefLabel = undefined
  expect(() => {
    signature.addSignifier(nomenQName, nomenPrefLabel)
  }).toThrow()

  nomenQName = ':fox'
  nomenPrefLabel = undefined
  expect(() => {
    signature.addSignifier(nomenQName, nomenPrefLabel)
  }).not.toThrow()

  nomenQName = 'unknown:sox'
  nomenPrefLabel = undefined
  expect(() => {
    signature.addSignifier(nomenQName, nomenPrefLabel)
  }).toThrow()

  signature.addNamespace('grox', 'http://grox.info/')
  nomenQName = 'grox:sox'
  nomenPrefLabel = undefined
  expect(() => {
    signature.addSignifier(nomenQName, nomenPrefLabel)
  }).not.toThrow()
})

test('get QName from added signifier', () => {
  const signature = new Signature()
  let nomenQName
  let nomenPrefLabel
  let retrievedQName

  nomenQName = ':fox'
  nomenPrefLabel = undefined
  signature.addSignifier(nomenQName, nomenPrefLabel)
  retrievedQName = signature.getSignifier(nomenQName).getQName()
  expect(retrievedQName).toEqual(nomenQName)

  signature.addNamespace('grox', 'http://grox.info/')
  nomenQName = 'grox:sox'
  nomenPrefLabel = undefined
  signature.addSignifier(nomenQName, nomenPrefLabel)
  retrievedQName = signature.getSignifier('grox:sox').getQName()
  expect(retrievedQName).toEqual('grox:sox')
})

test('add multiple signifiers', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info/')

  expect(signature.addSignifier('grox:hasTrait')).not.toBeUndefined()
  expect(signature.getSignifier('grox:hasTrait').getQName()).toEqual('grox:hasTrait')
  expect(signature.addSignifier(':alice')).not.toBeUndefined()
  expect(signature.getSignifier(':alice').getQName()).toEqual(':alice')

  const bobSignifier = signature.addSignifier(':bob')
  const carmenSignifier = signature.addSignifier('grox:carmen')
  expect (bobSignifier.getQName()).toEqual(':bob')
  expect (signature.getSignifier(carmenSignifier).getQName()).toEqual('grox:carmen')
})

test('check signifier prefLabels', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info/')

  expect(signature.addSignifier('grox:hasTrait')).not.toBeUndefined()
  expect(signature.getSignifier('grox:hasTrait').getPrefLabel()).toEqual('hasTrait')
  expect(signature.addSignifier(':alice')).not.toBeUndefined()
  expect(signature.getSignifier(':alice').getPrefLabel()).toEqual('alice')

  const bobSignifier = signature.addSignifier(':bob', 'Robert')
  const carmenSignifier = signature.addSignifier('grox:carmen', 'miranda')
  expect (bobSignifier.getPrefLabel()).toEqual('Robert')
  expect (signature.getSignifier(carmenSignifier).getPrefLabel()).toEqual('miranda')
})

test('add duplicate signifier using QName and signifier object', () => {
  const signature = new Signature()
  const carmenSignifier1 = signature.addSignifier(':carmen')
  const carmenSignifier2 = signature.addSignifier(':carmen')
  const carmenSignifier3 = signature.getSignifier(carmenSignifier1)
  expect(carmenSignifier1).toBe(carmenSignifier2)
  expect(carmenSignifier1).toBe(carmenSignifier3)
  expect(carmenSignifier1.getQName()).toEqual(carmenSignifier2.getQName())
  expect(carmenSignifier1.getQName()).toEqual(carmenSignifier3.getQName())
})

test('add duplicate axioms using QName and signifier object', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info/')
  signature.addSignifier('grox:hasTrait')
  const carmenSignifier1 = signature.addSignifier(':carmen')
  const carmenSignifier2 = signature.getSignifier(carmenSignifier1)
  signature.addAxiom(':carmen', 'grox:hasTrait', 'blue')
  signature.addAxiom(carmenSignifier2, 'grox:hasTrait', 'blue')
  signature.addAxiom(carmenSignifier1, 'grox:hasTrait', 'blue')

  expect(carmenSignifier1.getQName()).toBe(carmenSignifier2.getQName())
  expect(carmenSignifier1.getAxiomsWithThisAsNomen().length).toBe(1)
  expect(carmenSignifier2.getAxiomsWithThisAsNomen().length).toBe(1)
})

test('count axioms with different literal attributums', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info/')

  expect(signature.addSignifier('grox:hasTrait')).not.toBeUndefined()
  expect(signature.addSignifier(':alice')).not.toBeUndefined()
  expect(signature.addSignifier(':bob')).not.toBeUndefined()
  expect(signature.addSignifier(':carmen')).not.toBeUndefined()
  expect(signature.addSignifier(':diego')).not.toBeUndefined()
  expect(signature.addSignifier(':iman')).not.toBeUndefined()
  expect(signature.addSignifier(':jamaal')).not.toBeUndefined()

  signature.addAxiom(':alice', 'grox:hasTrait', 'pink')
  signature.addAxiom(':bob', 'grox:hasTrait', 'yellow')
  signature.addAxiom(':carmen', 'grox:hasTrait', 'yellow')
  signature.addAxiom(':diego', 'grox:hasTrait', 'blue')
  signature.addAxiom(':iman', 'grox:hasTrait', 'yellow')
  signature.addAxiom(':jamaal', 'grox:hasTrait', 'blue')

  expect(signature.getAxiomsWithLiteralAsAttributum('pink').length).toBe(1)
  expect(signature.getAxiomsWithLiteralAsAttributum('yellow').length).toBe(3)
  expect(signature.getAxiomsWithLiteralAsAttributum('blue').length).toBe(2)
})

test('count axioms with with different object attributums', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info/')
  signature.addNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')

  const traitSignifier = signature.addSignifier('grox:hasTrait')

  signature.addSignifier(':alice')
  signature.addSignifier(':bob')
  const carmenSignifier = signature.addSignifier(':carmen')
  const diegoSignifier = signature.addSignifier(':diego')
  signature.addSignifier(':diego')
  const jamaalSignifier = signature.addSignifier(':diego')

  signature.addAxiom(':alice', 'grox:hasTrait', ':mother')
  signature.addAxiom(':bob', traitSignifier, ':father')
  signature.addAxiom(carmenSignifier, 'grox:hasTrait', ':mother')
  signature.addAxiom(diegoSignifier, 'grox:hasTrait', ':father')

  const motherSignifier = signature.getSignifier(':mother')
  const fatherSignifier = signature.getSignifier(':father')
  signature.addAxiom(':iman', traitSignifier, motherSignifier)
  signature.addAxiom(jamaalSignifier, 'grox:hasTrait', fatherSignifier)

  expect(motherSignifier.getAxiomsWithThisAsAttributum().length).toBe(3)
  expect(fatherSignifier.getAxiomsWithThisAsAttributum().length).toBe(3)
})

test('count axioms with with different copulas', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info/')
  signature.addNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')

  const traitSignifier = signature.addSignifier('grox:hasTrait')
  const typeSignifier = signature.addSignifier('rdf:type')

  signature.addSignifier(':alice')
  signature.addSignifier(':bob')
  const carmenSignifier = signature.addSignifier(':carmen')
  const diegoSignifier = signature.addSignifier(':diego')
  signature.addSignifier(':diego')
  const jamaalSignifier = signature.addSignifier(':diego')

  signature.addAxiom(':alice', 'grox:hasTrait', 'magenta')
  signature.addAxiom(':alice', 'grox:hasTrait', 'circular')
  signature.addAxiom(':alice', 'grox:hasTrait', 'mammalian')
  signature.addAxiom(':bob', traitSignifier, 'magenta')
  signature.addAxiom(carmenSignifier, 'rdf:type', ':mother')
  signature.addAxiom(diegoSignifier, 'rdf:type', 'grox:father')

  const motherSignifier = signature.getSignifier(':mother')
  const fatherSignifier = signature.getSignifier('grox:father')
  signature.addAxiom(':iman', typeSignifier, motherSignifier)
  signature.addAxiom(jamaalSignifier, 'grox:hasTrait', 'cyan')
  signature.addAxiom(jamaalSignifier, typeSignifier, fatherSignifier)

  expect(motherSignifier.getAxiomsWithThisAsAttributum().length).toBe(2)
  expect(fatherSignifier.getAxiomsWithThisAsAttributum().length).toBe(2)
  expect(signature.getAxiomsWithLiteralAsAttributum('magenta').length).toBe(2)
  expect(signature.getAxiomsWithLiteralAsAttributum('cyan').length).toBe(1)

  expect(traitSignifier.getAxiomsWithThisAsCopula().length).toBe(5)
  expect(typeSignifier.getAxiomsWithThisAsCopula().length).toBe(4)
})

