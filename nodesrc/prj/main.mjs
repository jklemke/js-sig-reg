// This is a rudimentary main.mjs that is testing our module functionality. It can be run either with
// node main.mjs
// or
// npm run main

import { greeting } from '../../web/js/lib/hello.mjs'
import { Signature } from '../../web/js/prj/signature.mjs'

console.log(greeting('nodesrc/main.mjs'))

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
