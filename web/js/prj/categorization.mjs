// Copyright 2021 Joe Klemke http://grox.com
import { Registration } from './registration.mjs'
import { Signature } from './signature.mjs'
import { util } from './util.mjs'

// this is a reference to a function, so call with new Categorization()
const Categorization = (

  // anonymous IIFE function that is called once after the code is parsed,
  // to define the static attributes and methods, and to return the constructor function
  function (registration) {
    // --------------------------------------------------------------------------------
    // private static attribute (defined once and shared by all Categorization objects)
    // none for now

    // the actual, anonymous constructor function which gets invoked by 'new Categorization()'
    return function (registration) {
    // --------------------------------------------------------------------------------
      // private attributes, unique to each Categorization instance
      // Categorization is immutable, there are only getters for these
      let _registration = new Registration(new Signature()) // check that Registration object is imported properly
      _registration = undefined // revert to unitialized Registration object

      // --------------------------------------------------------------------------------
      // private methods, unique to each Categorization instance, with access to private attributes and methods
      const _constructCategorization = function (registration) {
        if (registration === undefined) { throw new Error('new Categorization() is missing required argument: registration') }
        if (util.verifyPropertiesOnRegistrationType(registration, 'fail')) {
          _registration = registration
        }
        _addCategorizationSignifiers()
      }

      const _validateAndAddCategorizationAxioms = function (nomenQName, nomenPrefLabel, copulaPrefLabel, attributumPrefLabel) {
        const attributumQName = _registration.getUniqueQNameForSignifierId(attributumPrefLabel)
        const copulaQName = _registration.getUniqueQNameForSignifierId(copulaPrefLabel)
        _registration.addSignifier(nomenQName, nomenPrefLabel)
        _registration.addAxiom(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
      }

      const _addCategorizationSignifiers = function () {
        // the symmetric copulas of categorization
        _validateAndAddCategorizationAxioms('grox:XJ3h0vQrSCvcqech7CwpXHZ0', 'specimenWrtSpecies', 'isSubTraitOf', 'indWrtAgg')
        _validateAndAddCategorizationAxioms('grox:WK0CjxWXN1z9mhoT5SSsNP2U', 'speciesWrtSpecimen', 'isSubTraitOf', 'aggWrtInd')
        _validateAndAddCategorizationAxioms('grox:H57135RLXgbxpQdKYVI94my1', 'subSpeciesWrtSuperSpecies', 'isSubTraitOf', 'subAggWrtSuperAgg')
        _validateAndAddCategorizationAxioms('grox:sA0oWPZh76OPzJontiufRvS5', 'superSpeciesWrtSubSpecies', 'isSubTraitOf', 'superAggWrtSubAgg')
        _validateAndAddCategorizationAxioms('grox:xo57ra1o9uvkpd1amXFtLRZg', 'subSpeciesWrtTopDomain', 'isSubTraitOf', 'subAggWrtDomain')
        _validateAndAddCategorizationAxioms('grox:U02oAeuYZgCvsroCSF1N49J9', 'topDomainWrtSubSpecies', 'isSubTraitOf', 'domainWrtSubAgg')
      }

      // --------------------------------------------------------------------------------
      // 'this' defines a privileged method which is public, unique to each object instance,
      // with access to private attributes and methods

      // constructor code for Categorization, which runs once when the object is instantiated with 'new Categorization()'
      _constructCategorization(registration)
    }
  }
)()

export { Categorization }
