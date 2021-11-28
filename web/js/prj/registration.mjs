// Copyright 2021 Joe Klemke http://grox.com
import { util } from './util.mjs'
import { DisjointAttributumSet, DisjointCopulaSet } from './disjoint.mjs'

// this is a reference to a function, so can be used with 'new'
// TODO: logic for these
// hasTrait is asymmetric
// specimenOfSpecies is inverse
// species, genus, supergenus is transitive
// instance, class, superclass is transitive
// domain is top level aggregate for all aggregate. a situation is anything in a domain (existence)
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
    const _checkForDisjointAttributums = function (disjointAttributumSets, nomenQName, copulaQName) {
      disjointAttributumSets.forEach((attributumSet) => {
        const nomenCopulaPairs = disjointAttributumSets.getNomenCopulaPairs()
        nomenCopulaPairs.forEach((nomenCopulaPair) => {
          if (nomenCopulaPair.nomen === nomenQName && nomenCopulaPair.copula === copulaQName) {
            let errorMsg = 'nomen ' + nomenQName + ' and copula ' + copulaQName + ' have already been assigned an attribute in disjoint set \n'
            attributumSet.forEach((attributum) => {
              errorMsg += '\t' + attributum + '\n'
            })
            throw new Error(errorMsg)
          }
        })
      })
    }

    const _checkForDisjointCopulas = function (disjointCopulaSets, nomenQName, attributumQName) {
      disjointCopulaSets.forEach((copulaSet) => {
        const nomenAttributumPairs = disjointCopulaSets.getNomenAttributumPairs()
        nomenAttributumPairs.forEach((nomenAttributumPair) => {
          if (nomenAttributumPair.nomen === nomenQName && nomenAttributumPair.copula === attributumQName) {
            let errorMsg = 'nomen ' + nomenQName + ' and attributum ' + attributumQName + ' already been assigned a copula in disjoint set \n'
            copulaSet.forEach((copula) => {
              errorMsg += '\t' + copula + '\n'
            })
            throw new Error(errorMsg)
          }
        })
      })
    }

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

    // the actual, anonymous constructor function which gets invoked by 'new Registration()'
    return function (signature) {
    // --------------------------------------------------------------------------------
      // private attributes, unique to each Registration instance
      // Registration is immutable, there are only getters and adders for these
      let _signature
      const _thisRegistration = this
      const _generalizationChains = []
      const _disjointCopulaSets = []
      const _disjointAttributumSets = []

      // --------------------------------------------------------------------------------
      // private methods, unique to each Registration instance,
      // with access to private attributes and methods
      const _constructRegistration = function (signature) {
        if (signature === undefined) { throw new Error('new Registration() is missing required argument: signature') }
        if (util.verifyPropertiesOnSignatureType(signature, 'fail')) {
          _signature = signature
        }

        // temp tests to ensure these classes can be instantiated
        const genChain = new _GeneralizationChain()
        _generalizationChains.push(genChain)

        _addCoreNamespaces()
        _addCoreSignifiers()
        _addCoreDisjointAttributums()
      }

      const _addCoreDisjointAttributums = function () {
        _disjointAttributumSets.push(
          new DisjointAttributumSet(
            _thisRegistration,
            [
              'partWrtGen',
              'genWrtPart',
              'subGenWrtSuperGen',
              'superGenWrtSubGen',
              'subGenWrtTopDomain',
              'topDomainWrtsubGen'
            ]
          )
        )

        _disjointAttributumSets.push(
          new DisjointAttributumSet(
            _thisRegistration,
            [
              'partHasTraitPart',
              'partHasTraitGen',
              'genHasTraitPart',
              'genHasTraitGen'
            ]
          )
        )

        _disjointAttributumSets.push(
          new DisjointAttributumSet(
            _thisRegistration,
            [
              'partWrtTopDomain',
              'topDomainWrtPart'
            ]
          )
        )
      }

      const _addCoreNamespaces = function () {
        _signature.addNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
        _signature.addNamespace('rdfs', 'http://www.w3.org/2000/01/rdf-model#')
        _signature.addNamespace('dc', 'http://purl.org/dc/elements/1.1/')
        _signature.addNamespace('owl', 'http://www.w3.org/2002/07/owl#')
        _signature.addNamespace('ex', 'http://www.example.org/')
        _signature.addNamespace('xsd', 'http://www.w3.org/2001/XMLmodel#')
        _signature.addNamespace('skos', 'http://www.w3.org/2004/02/skos/core#')
        _signature.addNamespace('foaf', 'http://xmlns.com/foaf/0.1/')
        _signature.addNamespace('grox', 'http://www.grox.info/')
      }

      const _addCoreSignifiers = function () {
        // the symmetric copulas of particularization and generalization
        _validateAndAddSignifier('grox:iT4tYHw9xJVf65egdT1hOtNu', 'partWrtGen')
        _validateAndAddSignifier('grox:Fy28scb0taxYGdYeexBx3365', 'genWrtPart')
        _validateAndAddSignifier('grox:LY41ZUMrKdPh9G3w6b2rxFUY', 'subGenWrtSuperGen')
        _validateAndAddSignifier('grox:QT64ORWiazZEsiU9k2pfhDUf', 'superGenWrtSubGen')
        _validateAndAddSignifier('grox:QQ46Ef5vecHgr6ctohqU1pTo', 'subGenWrtTopDomain')
        _validateAndAddSignifier('grox:Wb4bglkQ9PrEt3C7y0YCOqpA', 'topDomainWrtsubGen')

        // the asymmetric copulas of traits
        _validateAndAddSignifier('grox:Kr7rkKhBHnxEo2OIddayrxZr', 'partHasTraitPart')
        _validateAndAddSignifier('grox:SW6KX6Y8QRKPpzEoJYoAD4Ya', 'partHasTraitGen')
        _validateAndAddSignifier('grox:Ov4ItKWDuLMVUAlrbDfgBXkW', 'genHasTraitPart')
        _validateAndAddSignifier('grox:WW6JqN8iMmQcvwrRYxDub7N7', 'genHasTraitGen')

        // the symmetric copulas of situation (existence of a particular in a domain)
        _validateAndAddSignifier('grox:VW4TIqnPANbf73SKLB1pXWr0', 'partWrtTopDomain')
        _validateAndAddSignifier('grox:mi1vJ1s5GHf2dD8lswGIyddE', 'topDomainWrtPart')

        // copulas of trait hierarchies
        _validateAndAddSignifier('grox:OT7cRTTm9suVcCmdkxVXn9hx', 'isSubTraitOf')
      }

      const _getDisjointSetsforAttributum = function (copula) {
        const existingDisjointSets = []
        for (let i = 0; i < _disjointAttributumSets.length; i++) {
          const attributumSet = _disjointAttributumSets[i].getAttributumSet()
          if (attributumSet[copula]) {
            existingDisjointSets.push(attributumSet)
            break
          }
        }
        return existingDisjointSets
      }

      const _getDisjointSetsforCopula = function (copula) {
        const existingDisjointSets = []
        for (let i = 0; i < _disjointCopulaSets.length; i++) {
          const copulaSet = _disjointCopulaSets[i].getCopulaSet()
          if (copulaSet[copula]) {
            existingDisjointSets.push(copulaSet)
            break
          }
        }
        return existingDisjointSets
      }

      // Signature allows duplicate prefLabels, but
      // here in Registration we provide a mechanism for unique prefLabels
      const _checkForDuplicatePrefLabels = function (prefLabel) {
        const existingSignifiersForPrefLabel = _signature.getSignifiersForPrefLabel(prefLabel)
        if (existingSignifiersForPrefLabel) {
          let existingQNames
          for (const sigId in existingSignifiersForPrefLabel) {
            existingQNames = sigId + ' '
          }
          throw new Error('prefLabel = ' + prefLabel + ' has already been used for QName = ' + existingQNames)
        }
      }

      const _validateAndAddSignifier = function (QName, prefLabel) {
        _checkForDuplicatePrefLabels(prefLabel)
        _signature.addSignifier(QName, prefLabel)
      }

      // _GeneralizationChain is an IIFE constructor function which is private to Registration
      // it is a linked list from bottomGen to topGen, with transitive links between top and bottom.
      // two possible initializations:
      //    if isTopGen
      //      subGen becomes bottomGen, subGen and superGen form a link, topGen is null (can be set later)
      //    if not isTopGen
      //      subgen becomes bottomGen, subGen and superGen form a link, superGen is set as topGen, which cannot be changed
      // copula is immutable, topGen is immutable once set.
      // bottomGen can be changed by setting a new link
      // new link can be inserted between an existing generalizationLink
      const _GeneralizationChain = (

        // anonymous function which returns the _GeneralizationChain constructor
        function () {
          return function (copula, subGen, superGen, isTopGen) {
            // private attributes, unique to each _GeneralizationChain instance
            // let _bottomGeneralization
            // let _topGeneralization
            // let _generalizationLink = {
            //   narrowerGeneralization: null,
            //   broaderGeneralization: null
            // }

            // private methods, unique to each _GeneralizationChain instance, with access to private attributes and methods
            // public _GeneralizationChain methods

            // _GeneralizationChain constructor code
          }
        }
      )()

      // 'this' defines a privileged method which is public, unique to each object instance, with access to private attributes and methods
      // TODO: the basic idea is to use a Registration to manipulate a Signature
      // so Registration has a facade for the public methods of Signature
      this.addDisjointCopulaSet = function (copulaArray) {
        const disjointCopulaSet = new DisjointCopulaSet(copulaArray)
        _disjointCopulaSets.push(disjointCopulaSet)
      }

      this.getDisjointAttributumSetForAttributum = function (attributum) {
      }

      this.addNamespace = function (prefix, uri) {
        return _signature.addNamespace(prefix, uri)
      }

      this.addSignifier = function (QName, prefLabel) {
        return _signature.addSignifier(QName, prefLabel)
      }

      this.getSignifier = function (signifierId) {
        return _signature.getSignifier(signifierId)
      }

      // signifierId can be a QName, a reference to a Signifier Object, or a uniquely-enforced prefLabel
      this.getUniqueQNameForSignifierId = function (signifierId) {
        return _getUniqueQNameForSignifierId(signifierId, _signature)
      }

      // this version of addAxiom checks for attempts to add axioms with disjoint attributums
      this.addAxiom = function (nomen, copula, attributum, altCopulaLabel) {
        const nomenSignifier = _signature.getSignifier(nomen)
        if (nomenSignifier === undefined) { throw new Error('invalid nomen for new Axiom: ' + nomen) }
        const copulaSignifier = _signature.getSignifier(copula)
        if (copulaSignifier === undefined) { throw new Error('invalid copula for new Axiom: ' + copula) }
        const attributumSignifier = _signature.getSignifier(attributum)
        if (attributumSignifier === undefined) { throw new Error('invalid attributum for new Axiom: ' + attributum) }

        const nomenQName = nomenSignifier.getQName()
        const copulaQName = copulaSignifier.getQName()
        const attributumQName = attributumSignifier.getQName()

        const disjointAttributumSets = _getDisjointSetsforAttributum()
        const disjointCopulaSets = _getDisjointSetsforCopula()

        _checkForDisjointAttributums(disjointAttributumSets, nomenQName, copulaQName)
        _checkForDisjointCopulas(disjointCopulaSets, nomenQName, attributumQName)

        return _signature.addAxiom(nomen, copula, attributum, altCopulaLabel)
      }

      this.getAxiomsWithLiteralAsAttributum = function (literal) {
        return _signature.getAxiomsWithLiteralAsAttributum(literal)
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
  logAxiomsWithNomen: function (signifierId) {
    const signifier = this.getSignifier(signifierId)
    if (signifier) {
      const axioms = signifier.getAxiomsWithThisAsNomen()
      axioms.forEach(element => {
        element.log()
      })
    }
  },
  logAxiomsWithCopula: function (signifierId) {
    const signifier = this.getSignifier(signifierId)
    if (signifier) {
      const axioms = signifier.getAxiomsWithThisAsCopula()
      axioms.forEach(element => {
        element.log()
      })
    }
  },
  logAxiomsWithSignifierAsAttributum: function (signifierId) {
    const signifier = this.getSignifier(signifierId)
    if (signifier) {
      const axioms = signifier.getAxiomsWithThisAsAttributum()
      axioms.forEach(element => {
        element.log()
      })
    }
  },
  logAxiomsWithLiteralAsAttributum: function (literal) {
    const axioms = this.getAxiomsWithLiteralAsAttributum(literal)
    if (axioms) {
      axioms.forEach(element => {
        element.log()
      })
    }
  }
}

export { Registration }
