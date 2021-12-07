// Copyright 2021 Joe Klemke http://grox.com
import { util } from './util.mjs'
import { DisjointAttributumSet, DisjointCopulaSet } from './disjoint.mjs'
import { AggregationChain } from './aggregation.mjs'
import { SymmetricCopulaPair, AsymmetricCopulaPair } from './symmetry.mjs'

// this is a reference to a function, so can be used with 'new'
// TODO: logic for these
// hasTrait is asymmetric
// specimenOfSpecies is inverse
// species, genus, supergenus is transitive
// instance, class, superclass is transitive
// domain is a top level aggregate for all aggregate. an individual or an aggregate may be situated in a domain (existence)
// specimen, species and genus are categorization, that is they do not copy trait
// instance, class, and superclass are classification, that is they do copy traits
// every item in the plurality must have the prototypical traits of the prototype
// consecutive of enumeration are ordered
// item of list is unordered finite list
// expression is a molecular, combination of other aggregates
const Registration = (

  // anonymous IIFE function that is called once after the code is parsed,
  // to define the static attributes and methods, and to return the constructor function
  function (signature) {
    // --------------------------------------------------------------------------------
    // private static attributes and functions (defined once and shared by all Registration objects)
    // with no access to private attributes and functions

    // retrieve a QName either by QName, signifier reference,
    // or by unique prefLabel, if it exists
    // throws an error if called with a duplicated prefLabel
    const _getUniqueQNameForSignifierId = function (signifierId, signature) {
      let existingQNames
      let existingQName
      let numQNames = 0
      const existingSignifier = signature.getSignifier(signifierId)
      if (existingSignifier) {
        existingQName = existingSignifier.getQName()
      } else {
        const existingSignifiersForPrefLabel = signature.getSignifiersForPrefLabel(signifierId)
        if (existingSignifiersForPrefLabel) {
          for (const sigId in existingSignifiersForPrefLabel) {
            existingQNames = sigId + ' '
            numQNames++
          }
          if (numQNames > 1) {
            throw new Error('prefLabel = ' + signifierId + ' has been used for multiple QNames = ' + existingQNames)
          } else {
            existingQName = existingQNames.trim()
          }
        }
      }
      return existingQName
    }

    const _buildDisjointAttributumErrorMsg = function (nomenQName, copulaQName, attributumQName, AtomicStatement, disjointAttributumSet, signature) {
      let errorMsg =
        '\nCannot assign attributum from disjoint set\n' +
        '\t' + attributumQName + ' ' + signature.getSignifier(attributumQName).getPrefLabel() + '\n' +
        'the AtomicStatement\n' +
        '\tnomen ' + nomenQName + ' ' + signature.getSignifier(nomenQName).getPrefLabel() + '\n' +
        '\tcopula ' + copulaQName + ' ' + signature.getSignifier(copulaQName).getPrefLabel() + '\n' +
        '\tattributum ' + AtomicStatement.attributumQName + ' ' + signature.getSignifier(AtomicStatement.attributumQName).getPrefLabel() + '\n' +
        'has already been added from disjoint attributum set\n'
      const attributumSet = disjointAttributumSet.getAttributumSet()
      for (const attributum in attributumSet) {
        errorMsg = errorMsg + '\t' + attributum + ' ' + signature.getSignifier(attributum).getPrefLabel() + '\n'
      }
      return errorMsg
    }

    // Signature allows duplicate prefLabels, but
    // here in Registration we provide a mechanism for ensuring unique prefLabels
    // at least for our core signifiers
    const _checkForDuplicatePrefLabels = function (QName, prefLabel, signature) {
      let testPrefLabel
      const existingSignifier = signature.getSignifier(QName)
      if (prefLabel !== undefined) {
        testPrefLabel = prefLabel
      } else {
        if (QName.indexOf(':') === 0) {
          testPrefLabel = QName.substring(1)
        } else {
          testPrefLabel = QName.split(':')[1]
        }
      }
      if (existingSignifier !== undefined) {
        const existingPrefLabel = existingSignifier.getPrefLabel()
        const existingQName = existingSignifier.getQName()
        if (existingPrefLabel !== testPrefLabel) {
          throw new Error('Cannot add signifier ' + existingQName + ' with prefLabel ' + testPrefLabel + '. It has already been added with prefLabel ' + existingPrefLabel + '.')
        }
      } else {
        const existingSignifiersForPrefLabel = signature.getSignifiersForPrefLabel(testPrefLabel)
        if (existingSignifiersForPrefLabel) {
          let existingQNames
          for (const sigId in existingSignifiersForPrefLabel) {
            existingQNames = sigId + ' '
          }
          throw new Error('prefLabel = ' + testPrefLabel + ' has already been used for QName = ' + existingQNames)
        }
      }
    }

    // the actual, anonymous constructor function which gets invoked by 'new Registration()'
    return function (signature) {
    // --------------------------------------------------------------------------------
      // private attributes, unique to each Registration instance
      // Registration is immutable, there are only getters and adders for these
      let _signature
      const _thisRegistration = this
      const _aggregationChains = []
      const _disjointCopulaSets = []
      const _disjointAttributumSets = []
      const _symmetricCopulaSets = []

      // --------------------------------------------------------------------------------
      // private methods, unique to each Registration instance,
      // with access to private attributes and methods
      const _constructRegistration = function (signature) {
        if (signature === undefined) { throw new Error('new Registration() is missing required argument: signature') }
        if (util.verifyPropertiesOnSignatureType(signature, 'fail')) {
          _signature = signature
        }

        // temp tests to ensure these classes can be instantiated
        // const genChain = new GeneralizationChain()
        // _generalizationChains.push(genChain)

        _addCoreNamespaces()
        _addCoreSignifiers()
        _addCoreAggregationChains()
      }

      const _addCoreAggregationChains = function () {
        const individualWrtAggregate = _getUniqueQNameForSignifierId('individualWrtAggregate', _signature)
        const aggregateWrtSuperAggregate = _getUniqueQNameForSignifierId('aggregateWrtSuperAggregate', _signature)
        const aggregateWrtJurisdiction = _getUniqueQNameForSignifierId('aggregateWrtJurisdiction', _signature)
        const aggregationChain = new AggregationChain(individualWrtAggregate, aggregateWrtSuperAggregate)
        aggregationChain.insertLink(aggregateWrtSuperAggregate, aggregateWrtJurisdiction)
        _aggregationChains.push(aggregationChain)
      }

      const _addCoreNamespaces = function () {
        _signature.addNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
        _signature.addNamespace('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
        _signature.addNamespace('dc', 'http://purl.org/dc/elements/1.1/')
        _signature.addNamespace('owl', 'http://www.w3.org/2002/07/owl#')
        _signature.addNamespace('ex', 'http://www.example.org/')
        _signature.addNamespace('xsd', 'http://www.w3.org/2001/XMLschema#')
        _signature.addNamespace('skos', 'http://www.w3.org/2004/02/skos/core#')
        _signature.addNamespace('foaf', 'http://xmlns.com/foaf/0.1/')
        _signature.addNamespace('grox', 'http://grox.info/')
      }

      const _addSymmetricCopulas = function (symmetricPrefLabelSet) {
        _symmetricCopulaSets.push(
          new SymmetricCopulaPair(
            _thisRegistration,
            symmetricPrefLabelSet
          )
        )
      }

      const _addAsymmetricCopulas = function (symmetricPrefLabelSet) {
        _symmetricCopulaSets.push(
          new AsymmetricCopulaPair(
            _thisRegistration,
            symmetricPrefLabelSet
          )
        )
      }

      const _addCoreSignifiers = function () {
        // the copula of trait hierarchies
        _validateAndAddSignifier('grox:OT7cRTTm9suVcCmdkxVXn9hx', 'isSubTraitOf')

        _validateAndAddSignifier('grox:Kr7rkKhBHnxEo2OIddayrxZr', 'individualHasTraitIndividual')
        _validateAndAddSignifier('grox:SW6KX6Y8QRKPpzEoJYoAD4Ya', 'individualHasTraitAggregate')
        _validateAndAddSignifier('grox:Ov4ItKWDuLMVUAlrbDfgBXkW', 'aggregateHasTraitIndividual')
        _validateAndAddSignifier('grox:WW6JqN8iMmQcvwrRYxDub7N7', 'aggregateHasTraitAggregate')
        _addDisjointCopulasAndAttributums([
          'individualHasTraitIndividual',
          'individualHasTraitAggregate',
          'aggregateHasTraitIndividual',
          'aggregateHasTraitAggregate'
        ])
/*        _addAsymmetricCopulas([
          'individualHasTraitIndividual',
          'individualHasTraitAggregate',
          'aggregateHasTraitIndividual',
          'aggregateHasTraitAggregate'
        ])
        _addAsymmetricCopulas([
          'individualHasTraitIndividual',
          'individualHasTraitAggregate',
          'aggregateHasTraitIndividual',
          'aggregateHasTraitAggregate'
        ])
*/
        _validateAndAddSignifier('grox:iT4tYHw9xJVf65egdT1hOtNu', 'individualWrtAggregate')
        _validateAndAddSignifier('grox:Fy28scb0taxYGdYeexBx3365', 'aggregateWrtIndividual')
        _validateAndAddSignifier('grox:LY41ZUMrKdPh9G3w6b2rxFUY', 'aggregateWrtSuperAggregate')
        _validateAndAddSignifier('grox:QT64ORWiazZEsiU9k2pfhDUf', 'superAggregateWrtAggregate')
        _validateAndAddSignifier('grox:QQ46Ef5vecHgr6ctohqU1pTo', 'aggregateWrtJurisdiction')
        _validateAndAddSignifier('grox:Wb4bglkQ9PrEt3C7y0YCOqpA', 'jurisdictionWrtAggregate')
        _addDisjointCopulasAndAttributums([
          'individualWrtAggregate',
          'aggregateWrtIndividual',
          'aggregateWrtSuperAggregate',
          'superAggregateWrtAggregate',
          'aggregateWrtJurisdiction',
          'jurisdictionWrtAggregate'
        ])
        _addSymmetricCopulas([
          'individualWrtAggregate',
          'aggregateWrtIndividual'
        ])
        _addSymmetricCopulas([
          'aggregateWrtSuperAggregate',
          'superAggregateWrtAggregate'
        ])
        _addSymmetricCopulas([
          'aggregateWrtJurisdiction',
          'jurisdictionWrtAggregate'
        ])

        // the symmetric signifiers of individuals situated in a domain
        // these are disjoint as copulas and as attributums
        _validateAndAddSignifier('grox:VW4TIqnPANbf73SKLB1pXWr0', 'individualWrtJurisdiction')
        _validateAndAddSignifier('grox:mi1vJ1s5GHf2dD8lswGIyddE', 'jurisdictionWrtIndividual')
        _addDisjointCopulasAndAttributums([
          'individualWrtJurisdiction',
          'jurisdictionWrtIndividual'
        ])
        _addSymmetricCopulas([
          'individualWrtJurisdiction',
          'jurisdictionWrtIndividual'
        ])
      }

      const _addDisjointCopulasAndAttributums = function (disjointPrefLabelSet) {
        _disjointAttributumSets.push(
          new DisjointAttributumSet(
            _thisRegistration,
            disjointPrefLabelSet
          )
        )
        _disjointCopulaSets.push(
          new DisjointCopulaSet(
            _thisRegistration,
            disjointPrefLabelSet
          )
        )
      }

      const _validateAndAddSignifier = function (QName, prefLabel) {
        _checkForDuplicatePrefLabels(QName, prefLabel, _signature)
        _signature.addSignifier(QName, prefLabel)
      }

      const _checkForDisjointAttributums = function (nomenQName, copulaQName, attributumQName) {
        _disjointAttributumSets.forEach((disjointAttributumSet) => {
          const attributumSet = disjointAttributumSet.getAttributumSet()
          for (const attributum in attributumSet) {
            if (attributum === attributumQName) {
              const AtomicStatements = disjointAttributumSet.getAtomicStatements()
              AtomicStatements.forEach((AtomicStatement) => {
                if (AtomicStatement.nomenQName === nomenQName && AtomicStatement.copulaQName === copulaQName) {
                  const errorMsg = _buildDisjointAttributumErrorMsg(nomenQName, copulaQName, attributumQName, AtomicStatement, disjointAttributumSet, _signature)
                  throw new Error(errorMsg)
                }
              })
              disjointAttributumSet.addAtomicStatement(nomenQName, copulaQName, attributumQName)
            }
          }
        })
      }

      // 'this' defines a privileged method which is public, unique to each object instance, with access to private attributes and methods
      // TODO: the basic idea is to use a Registration to manipulate a Signature
      // so Registration has a facade for the public methods of Signature
      this.addNamespace = function (prefix, uri) {
        return _signature.addNamespace(prefix, uri)
      }

      this.addSignifier = function (QName, prefLabel) {
        _checkForDuplicatePrefLabels(QName, prefLabel, _signature)
        return _signature.addSignifier(QName, prefLabel)
      }

      this.getSignifier = function (signifierId) {
        return _signature.getSignifier(signifierId)
      }

      // signifierId can be a QName, a reference to a Signifier Object, or a uniquely-enforced prefLabel
      this.getUniqueQNameForSignifierId = function (signifierId) {
        return _getUniqueQNameForSignifierId(signifierId, _signature)
      }

      const _checkForSymmetricCopula = function (nomenQName, copulaQName, attributumQName) {

      }

      // this version of addAtomicStatement checks for attempts to add AtomicStatements with disjoint attributums.
      // signature.addAtomicStatement will create signifiers if they don't exist.
      // However, registration.addAtomicStatement allows only already existing signifiers.
      this.addAtomicStatement = function (nomen, copula, attributum, altCopulaLabel) {
        const nomenSignifier = _signature.getSignifier(nomen)
        if (nomenSignifier === undefined) { throw new Error('invalid nomen for new AtomicStatement: ' + nomen) }
        const copulaSignifier = _signature.getSignifier(copula)
        if (copulaSignifier === undefined) { throw new Error('invalid copula for new AtomicStatement: ' + copula) }
        const attributumSignifier = _signature.getSignifier(attributum)
        if (attributumSignifier === undefined) { throw new Error('invalid attributum for new AtomicStatement: ' + attributum) }

        const nomenQName = nomenSignifier.getQName()
        const copulaQName = copulaSignifier.getQName()
        const attributumQName = attributumSignifier.getQName()

        _checkForDisjointAttributums(nomenQName, copulaQName, attributumQName)
        const newAtomicStatement = _signature.addAtomicStatement(nomen, copula, attributum, altCopulaLabel)
        _checkForSymmetricCopula(nomenQName, copulaQName, attributumQName)
        return newAtomicStatement
      }

      this.getAtomicStatementsWithLiteralAsAttributum = function (literal) {
        return _signature.getAtomicStatementsWithLiteralAsAttributum(literal)
      }

      // constructor code for Registration, which runs once when the object is instantiated with 'new Registration()'
      _constructRegistration(signature)
    }
  }
)()

// when 'new' is called, a copy of the prototype is created, and the constructor code is run on it
Registration.prototype = {
  // public, non-privileged methods (one copy for all objects,
  // uses 'this' to call object-specific methods and attributes,
  // but has no access to private attributes or methods)
  logSignifier: function (signifierId) {
    const signifier = this.getSignifier(signifierId)
    if (signifier) {
      signifier.log()
    } else {
      console.log('Signifier: ' + signifierId + ' is undefined')
    }
  },
  logAtomicStatementsWithNomen: function (signifierId) {
    const signifier = this.getSignifier(signifierId)
    if (signifier) {
      const AtomicStatements = signifier.getAtomicStatementsWithThisAsNomen()
      AtomicStatements.forEach(element => {
        element.log()
      })
    }
  },
  logAtomicStatementsWithCopula: function (signifierId) {
    const signifier = this.getSignifier(signifierId)
    if (signifier) {
      const AtomicStatements = signifier.getAtomicStatementsWithThisAsCopula()
      AtomicStatements.forEach(element => {
        element.log()
      })
    }
  },
  logAtomicStatementsWithSignifierAsAttributum: function (signifierId) {
    const signifier = this.getSignifier(signifierId)
    if (signifier) {
      const AtomicStatements = signifier.getAtomicStatementsWithThisAsAttributum()
      AtomicStatements.forEach(element => {
        element.log()
      })
    }
  },
  logAtomicStatementsWithLiteralAsAttributum: function (literal) {
    const AtomicStatements = this.getAtomicStatementsWithLiteralAsAttributum(literal)
    if (AtomicStatements) {
      AtomicStatements.forEach(element => {
        element.log()
      })
    }
  }
}

export { Registration }
