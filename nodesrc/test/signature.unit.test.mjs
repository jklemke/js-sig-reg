import { Signature } from '../../web/js/prj/signature.mjs'

test('new Signature()', () => {
  expect(new Signature()).not.toBeUndefined()
})

test('new Signature().addNamespace()', () => {
  expect(new Signature().addNamespace('grox', 'http://grox.info')).not.toBeUndefined()
})

test('add multiple signifiers', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info')

  expect(signature.addSignifier('grox:hasTrait')).not.toBeUndefined()
  expect(signature.addSignifier(':alice')).not.toBeUndefined()
  expect(signature.addSignifier(':bob')).not.toBeUndefined()
  expect(signature.addSignifier(':carmen')).not.toBeUndefined()
})

test('add duplicate signifier using QName and signifier object', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info')
  signature.addSignifier('grox:hasTrait')
  const carmenSignifier1 = signature.addSignifier(':carmen')
  const carmenSignifier2 = signature.getSignifier(carmenSignifier1)

  expect(carmenSignifier1.getQName()).toBe(carmenSignifier2.getQName())
})

test('add duplicate axioms using QName and signifier object', () => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info')
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
  signature.addNamespace('grox', 'http://grox.info')

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
  signature.addNamespace('grox', 'http://grox.info')
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
  signature.addNamespace('grox', 'http://grox.info')
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

  expect(traitSignifier.getAxiomsWithThisAsCopula().length).toBe(3)
  expect(typeSignifier.getAxiomsWithThisAsCopula().length).toBe(4)
})
