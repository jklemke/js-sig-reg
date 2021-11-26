
import { greeting } from '../lib/hello.mjs'
import { Signature } from '../prj/signature.mjs'

const greetingBtn = document.getElementById('greetingBtn')
greetingBtn.addEventListener('click', (ev) => {
  const userName = document.getElementById('usernameTextbox').value
  console.log(greeting(userName))
})

const signatureBtn = document.getElementById('signatureBtn')
signatureBtn.addEventListener('click', (ev) => {
  const signature = new Signature()
  signature.addNamespace('grox', 'http://grox.info')

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
  const motherSignifier = signature.getSignifier(':mother')
  const motherAxioms = motherSignifier.getAxiomsWithThisAsAttributum()
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
})
