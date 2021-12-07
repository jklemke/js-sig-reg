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

      const _validateAndAddCategorizationStatements = function (nomenQName, nomenPrefLabel, copulaPrefLabel, attributumPrefLabel) {
        const attributumQName = _registration.getUniqueQNameForSignifierId(attributumPrefLabel)
        const copulaQName = _registration.getUniqueQNameForSignifierId(copulaPrefLabel)
        _registration.addSignifier(nomenQName, nomenPrefLabel)
        _registration.addStatement(nomenQName, copulaQName, attributumQName, nomenPrefLabel)
      }

      const _addCategorizationSignifiers = function () {
        // the symmetric copulas of categorization
        _validateAndAddCategorizationStatements('grox:XJ3h0vQrSCvcqech7CwpXHZ0', 'specimenWrtSpecies', 'isSubTraitOf', 'individualWrtAggregate')
        _validateAndAddCategorizationStatements('grox:WK0CjxWXN1z9mhoT5SSsNP2U', 'speciesWrtSpecimen', 'isSubTraitOf', 'aggregateWrtIndividual')
        _validateAndAddCategorizationStatements('grox:H57135RLXgbxpQdKYVI94my1', 'subSpeciesWrtSuperSpecies', 'isSubTraitOf', 'aggregateWrtSuperAggregate')
        _validateAndAddCategorizationStatements('grox:sA0oWPZh76OPzJontiufRvS5', 'superSpeciesWrtSubSpecies', 'isSubTraitOf', 'superAggregateWrtAggregate')
        _validateAndAddCategorizationStatements('grox:xo57ra1o9uvkpd1amXFtLRZg', 'subSpeciesWrtTopDomain', 'isSubTraitOf', 'aggregateWrtJurisdiction')
        _validateAndAddCategorizationStatements('grox:U02oAeuYZgCvsroCSF1N49J9', 'topDomainWrtSubSpecies', 'isSubTraitOf', 'jurisdictionWrtAggregate')
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
