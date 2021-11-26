// Copyright 2021 Joe Klemke http://grox.com
import { Registration } from './registration.mjs'
import { Signature } from './signature.mjs'
import { util } from './util.mjs'

// this is a reference to a function, so call with new Categorization()
const Categorization = (

  // anonymous IIFE function that is called once after the code is parsed,
  // to define the static attributes and methods, and to return the constructor function
  function (registration) {
    // private static attribute (defined once and shared by all Categorization objects)
    // none for now

    // the actual, anonymous constructor function which gets invoked by 'new Categorization()'
    return function (registration) {
      // private attributes, unique to each Categorization instance
      // Categorization is immutable, there are only getters for these
      let _registration = new Registration(new Signature()) // check that Registration object is imported properly
      _registration = undefined // revert to unitialized Registration object

      // private methods, unique to each Categorization instance, with access to private attributes and methods
      const _validateAndAddCategorizationAxioms = function (QName, prefLabel, attributum) {
        const attributumQName = _registration.getUniqueQNameForSignifierId(attributum)
        const copulaQName = _registration.getUniqueQNameForSignifierId('isSubTraitOf')
        _registration.addSignifier(QName, prefLabel)
        _registration.addAxiom(QName, copulaQName, attributumQName, prefLabel)
      }

      const _addCategorizationSignifiers = function () {
        // the symmetric copulas of categorization
        _validateAndAddCategorizationAxioms('grox:XJ3h0vQrSCvcqech7CwpXHZ0', 'specimenWrtSpecies', 'partWrtGen')
        _validateAndAddCategorizationAxioms('grox:WK0CjxWXN1z9mhoT5SSsNP2U', 'speciesWrtSpecimen', 'genWrtPart')
        _validateAndAddCategorizationAxioms('grox:H57135RLXgbxpQdKYVI94my1', 'subSpeciesWrtSuperSpecies', 'subGenWrtSuperGen')
        _validateAndAddCategorizationAxioms('grox:sA0oWPZh76OPzJontiufRvS5', 'superSpeciesWrtSubSpecies', 'superGenWrtSubGen')
        _validateAndAddCategorizationAxioms('grox:xo57ra1o9uvkpd1amXFtLRZg', 'subSpeciesWrtTopDomain', 'subGenWrtTopDomain')
        _validateAndAddCategorizationAxioms('grox:U02oAeuYZgCvsroCSF1N49J9', 'topDomainWrtSubSpecies', 'topDomainWrtsubGen')
      }

      // 'this' defines a privileged method which is public, unique to each object instance, with access to private attributes and methods

      // constructor code for Categorization, which runs once when the object is instantiated with 'new Categorization()'
      if (registration === undefined) { throw new Error('new Categorization() is missing required argument: registration') }

      if (util.verifyPropertiesOnRegistrationType(registration, 'fail')) {
        _registration = registration
      }

      _addCategorizationSignifiers()
    }
  }
)()

export { Categorization }
