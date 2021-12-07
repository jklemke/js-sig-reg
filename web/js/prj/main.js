import { greeting } from '../lib/hello.mjs'
import { Signature } from '../prj/signature.mjs'
import { Registration } from '../prj/registration.mjs'
import { Categorization } from '../prj/categorization.mjs'

const greetingBtn = document.getElementById('greetingBtn')
greetingBtn.addEventListener('click', (ev) => {
  const userName = document.getElementById('usernameTextbox').value
  exerciseGreeting(userName)
})

const signatureBtn = document.getElementById('signatureBtn')
signatureBtn.addEventListener('click', (ev) => {
  exerciseSignature()
})

const registrationBtn = document.getElementById('registrationBtn')
registrationBtn.addEventListener('click', (ev) => {
  exerciseRegistration()
})

const categorizationBtn = document.getElementById('categorizationBtn')
categorizationBtn.addEventListener('click', (ev) => {
  exerciseCategorization()
})

function exerciseGreeting (name) {
  console.log(greeting(name))
}

function exerciseSignature () {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info')
  signature.addNamespace('grox', 'http://www.grox.info/')
  signature.addNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  signature.addNamespace('rdfs', 'http://www.w3.org/2000/01/rdf-model#')
  signature.addNamespace('dc', 'http://purl.org/dc/elements/1.1/')
  signature.addNamespace('owl', 'http://www.w3.org/2002/07/owl#')
  signature.addNamespace('ex', 'http://www.example.org/')
  signature.addNamespace('xsd', 'http://www.w3.org/2001/XMLmodel#')
  signature.addNamespace('skos', 'http://www.w3.org/2004/02/skos/core#')
  signature.addNamespace('grox', 'http://www.grox.info/')
  signature.addNamespace('foaf', 'http://xmlns.com/foaf/0.1/')

  console.log('signifiers ----------------------------------------')

  const hasTraitSig = signature.addSignifier('grox:hasTrait')
  hasTraitSig.log()

  const aliceSignifier = signature.addSignifier(':alice')
  aliceSignifier.log()

  const bobSignifier = signature.addSignifier(':bob')
  bobSignifier.log()

  const carmenSignifier = signature.addSignifier(':carmen')
  carmenSignifier.log()

  const carmenSignifier2 = signature.getSignifier(carmenSignifier)
  carmenSignifier2.log()

  signature.addAtomicStatement(':alice', 'grox:hasTrait', 'green')
  signature.addAtomicStatement(bobSignifier, 'grox:hasTrait', 'green')
  signature.addAtomicStatement(carmenSignifier, 'grox:hasTrait', 'red')
  signature.addAtomicStatement(carmenSignifier2, 'grox:hasTrait', 'red')
  signature.addAtomicStatement(':alice', 'grox:hasTrait', ':mother')

  console.log('AtomicStatements with alice as nomem ----------------------------------------')
  const aliceAtomicStatements = aliceSignifier.getAtomicStatementsWithThisAsNomen()
  aliceAtomicStatements.forEach(AtomicStatement => {
    AtomicStatement.log()
  })

  console.log('AtomicStatements with carmen as nomem ----------------------------------------')
  const carmenAtomicStatements = carmenSignifier.getAtomicStatementsWithThisAsNomen()
  carmenAtomicStatements.forEach(AtomicStatement => {
    AtomicStatement.log()
  })

  console.log('AtomicStatements with :mother signifier as attributum ----------------------------------------')
  const motherAtomicStatements = signature.getSignifier(':mother').getAtomicStatementsWithThisAsAttributum()
  motherAtomicStatements.forEach(AtomicStatement => {
    AtomicStatement.log()
  })

  console.log('AtomicStatements with green literal as attributum ----------------------------------------')
  const greenAtomicStatements = signature.getAtomicStatementsWithLiteralAsAttributum('green')
  greenAtomicStatements.forEach(AtomicStatement => {
    AtomicStatement.log()
  })

  console.log('AtomicStatements with red literal as attributum ----------------------------------------')
  // const redAtomicStatements = signature.getAtomicStatementsWithLiteralAsAttributum('red')
  signature.getAtomicStatementsWithLiteralAsAttributum('red').forEach(AtomicStatement => {
    AtomicStatement.log()
  })

  console.log('AtomicStatements with hasTrait as copula ----------------------------------------')
  const traitSignifier = signature.getSignifier('grox:hasTrait')
  const traitAtomicStatements = traitSignifier.getAtomicStatementsWithThisAsCopula()
  traitAtomicStatements.forEach(AtomicStatement => {
    AtomicStatement.log()
  })
}

function exerciseRegistration () {
  const signature = new Signature()
  const registration = new Registration(signature)

  registration.logSignifier('rdf:type')
  registration.logSignifier('grox:hasTrait')
  registration.logSignifier('individualWrtAggregate')

  registration.logSignifier('grox:iT4tYHw9xJVf65egdT1hOtNu')
  registration.logSignifier('grox:Fy28scb0taxYGdYeexBx3365')
  registration.logSignifier('grox:LY41ZUMrKdPh9G3w6b2rxFUY')
  registration.logSignifier('grox:QT64ORWiazZEsiU9k2pfhDUf')
  registration.logSignifier('grox:QQ46Ef5vecHgr6ctohqU1pTo')
  registration.logSignifier('grox:Wb4bglkQ9PrEt3C7y0YCOqpA')
  registration.logSignifier('grox:Kr7rkKhBHnxEo2OIddayrxZr')
  registration.logSignifier('grox:SW6KX6Y8QRKPpzEoJYoAD4Ya')
  registration.logSignifier('grox:Ov4ItKWDuLMVUAlrbDfgBXkW')
  registration.logSignifier('grox:WW6JqN8iMmQcvwrRYxDub7N7')
  registration.logSignifier('grox:VW4TIqnPANbf73SKLB1pXWr0')
  registration.logSignifier('grox:mi1vJ1s5GHf2dD8lswGIyddE')
}

function exerciseCategorization () {
  const signature = new Signature()
  const registration = new Registration(signature)
  const categorization = new Categorization(registration)

  registration.logSignifier('grox:iT4tYHw9xJVf65egdT1hOtNu')
  registration.logSignifier('grox:XJ3h0vQrSCvcqech7CwpXHZ0')
  registration.logSignifier('grox:WK0CjxWXN1z9mhoT5SSsNP2U')
  registration.logSignifier('grox:xo57ra1o9uvkpd1amXFtLRZg')
  registration.logSignifier('grox:U02oAeuYZgCvsroCSF1N49J9')
}

