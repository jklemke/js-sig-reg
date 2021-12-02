// This is a rudimentary main.mjs that is testing our module functionality. It can be run either with
// node main.mjs
// or
// npm run main
import { Signature } from '../../web/js/prj/signature.mjs'
import { Registration } from '../../web/js/prj/registration.mjs'
import { Categorization } from '../../web/js/prj/categorization.mjs'
import { AggregationChain } from '../../web/js/prj/aggregation.mjs'

function exerciseSignature () {
  console.log('exerciseSignature ----------------------------------------')

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

  const hasTraitSig = signature.addSignifier('grox:hasTrait')
  hasTraitSig.log()
  const t2 = signature.getSignifier('grox:hasTrait')
  const q2 = t2.getQName()
  console.log(q2)

  const aliceSignifier = signature.addSignifier(':alice')
  aliceSignifier.log()

  const bobSignifier = signature.addSignifier(':bob')
  bobSignifier.log()

  const carmenSignifier = signature.addSignifier(':carmen')
  carmenSignifier.log()

  const carmenSignifier2 = signature.getSignifier(carmenSignifier)
  carmenSignifier2.log()

  signature.addAxiom(':alice', 'grox:hasTrait', 'green')
  signature.addAxiom(bobSignifier, 'grox:hasTrait', 'green')
  signature.addAxiom(carmenSignifier, 'grox:hasTrait', 'red')
  signature.addAxiom(carmenSignifier2, 'grox:hasTrait', 'red')
  signature.addAxiom(':alice', 'grox:hasTrait', ':mother')

  console.log('axioms with alice as nomem ----------------------------------------')
  const aliceAxioms = aliceSignifier.getAxiomsWithThisAsNomen()
  aliceAxioms.forEach(axiom => {
    axiom.log()
  })

  console.log('axioms with carmen as nomem ----------------------------------------')
  const carmenAxioms = carmenSignifier.getAxiomsWithThisAsNomen()
  carmenAxioms.forEach(axiom => {
    axiom.log()
  })

  console.log('axioms with :mother signifier as attributum ----------------------------------------')
  const motherAxioms = signature.getSignifier(':mother').getAxiomsWithThisAsAttributum()
  motherAxioms.forEach(axiom => {
    axiom.log()
  })

  console.log('axioms with green literal as attributum ----------------------------------------')
  const greenAxioms = signature.getAxiomsWithLiteralAsAttributum('green')
  greenAxioms.forEach(axiom => {
    axiom.log()
  })

  console.log('axioms with red literal as attributum ----------------------------------------')
  // const redAxioms = signature.getAxiomsWithLiteralAsAttributum('red')
  signature.getAxiomsWithLiteralAsAttributum('red').forEach(axiom => {
    axiom.log()
  })

  console.log('axioms with hasTrait as copula ----------------------------------------')
  const traitSignifier = signature.getSignifier('grox:hasTrait')
  const traitAxioms = traitSignifier.getAxiomsWithThisAsCopula()
  traitAxioms.forEach(axiom => {
    axiom.log()
  })
}

function exerciseRegistration () {
  console.log('exerciseRegistration ----------------------------------------')
  const signature = new Signature()
  const registration = new Registration(signature)

  registration.logSignifier('rdf:type')
  registration.logSignifier('grox:hasTrait')
  registration.logSignifier('indWrtAgg')

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

function exerciseDisjointAttributums () {
  const signature = new Signature()
  const registration = new Registration(signature)
  const nomenQName = 'grox:specimenWrtSpecies'
  const nomenPrefLabel = undefined
  const copulaQName = registration.getUniqueQNameForSignifierId('isSubTraitOf')
  let attributumQName

  registration.addSignifier(nomenQName)

  attributumQName = registration.getUniqueQNameForSignifierId('indWrtAgg')
  registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)

  // will error if uncommented
  // attributumQName = registration.getUniqueQNameForSignifierId('aggWrtInd')
  // registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)

  attributumQName = registration.getUniqueQNameForSignifierId('indHasTraitInd')
  registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)

  // will error if uncommented
  // attributumQName = registration.getUniqueQNameForSignifierId('indHasTraitAgg')
  // registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
}

function exerciseAggregation () {
  const signature = new Signature()
  const registration = new Registration(signature)
  const categorization = new Categorization(registration)

  const indWrtAgg = registration.getSignifier('grox:iT4tYHw9xJVf65egdT1hOtNu')
  const subAggWrtSuperAgg = registration.getSignifier('grox:LY41ZUMrKdPh9G3w6b2rxFUY')
  const subAggWrtDomain = registration.getSignifier('grox:QQ46Ef5vecHgr6ctohqU1pTo')

  //  _validateAndAddSignifier('grox:iT4tYHw9xJVf65egdT1hOtNu', 'indWrtAgg')
  //  _validateAndAddSignifier('grox:LY41ZUMrKdPh9G3w6b2rxFUY', 'subAggWrtSuperAgg')
  //  _validateAndAddSignifier('grox:QQ46Ef5vecHgr6ctohqU1pTo', 'subAggWrtDomain')

  let generalizationChain = new AggregationChain(indWrtAgg, subAggWrtSuperAgg)
  generalizationChain.insertLink(subAggWrtSuperAgg, subAggWrtDomain)

  generalizationChain.log()
  generalizationChain.apply('log')
}

exerciseSignature()
exerciseRegistration()
exerciseDisjointAttributums()
exerciseCategorization()
exerciseAggregation()
