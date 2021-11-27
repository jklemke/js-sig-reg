// Copyright 2021 Joe Klemke http://grox.com
import { util } from './util.mjs'
import { Axiom } from './axiom.mjs'

// Signature contains an immutable basic structure of namespaces, signifiers, axioms
const Signature = (
  // anonymous IIFE function that is called once after the code is parsed,
  // to define the static attributes and methods, and to return the constructor function
  function () {
    // --------------------------------------------------------------------------------
    // private static attributes (defined once and shared by all Signature objects)
    //

    // the actual constructor function which gets invoked by new Signature()
    return function () {
      // --------------------------------------------------------------------------------
      // private attributes, unique to each Signature instance
      // Signature is immutable, there are only getter methods for these
      const _thisSignature = this
      const _namespaces = {}
      const _axioms = []
      const _signifiers = {}
      const _prefLabels = {}

      // --------------------------------------------------------------------------------
      // private methods, unique to each Signature instance, with access to private attributes and methods
      const _constructSignature = function () {
      }

      // _Signifier is an IIFE constructor function which is private to Signature
      const _Signifier = (
        function () {
          return function (QName, prefLabel) {
            let _QName = null
            let _prefLabel = null
            const _axiomsWithThisAsNomen = []
            const _axiomsWithThisAsCopula = []
            const _axiomsWithThisAsAttributum = []

            const _constructSignifier = function (QName, prefLabel) {
              if (QName === undefined) { throw new Error('Invalid QName for new signifier, ' + QName + '.') }
              if (typeof QName !== 'string') { throw new Error('When adding a signifier, QName must be a string.') }
              if (QName.indexOf(':') < 0) { throw new Error('When adding a signifier, QName must have a registered namespace prefix or use ":" in first position to indicate default namespace.') }
              if (QName.indexOf(':') !== QName.lastIndexOf(':')) { throw new Error('When adding a signifier, only one colon is allowed in QName string.') }
              if (QName.indexOf(':') === QName.length - 1) { throw new Error('When adding a signifier, at least one additional character must follow the colon in QName string.') }
              if (!prefLabel) {
                if (QName.indexOf(':') === 0) {
                  prefLabel = QName.substring(1)
                } else {
                  prefLabel = QName.split(':')[1]
                }
              }
              _QName = QName
              _prefLabel = prefLabel
            }

            this.notifyOfParticipationAsNomen = function (axiom) {
              _axiomsWithThisAsNomen.push(axiom)
              if (axiom.getCopulaLabel() !== undefined) {
                this[axiom.getCopulaLabel()] = axiom.getAttributum()
              }
            }

            this.notifyOfParticipationAsCopula = function (axiom) {
              _axiomsWithThisAsCopula.push(axiom)
            }

            this.notifyOfParticipationAsAttributum = function (axiom) {
              _axiomsWithThisAsAttributum.push(axiom)
            }

            this.getQName = function () {
              return _QName
            }

            this.getPrefLabel = function () {
              return _prefLabel
            }

            // TODO: these get statements are the beginning of a SELECT API
            // there may be multiple theorems for a single axiom/triple
            this.getAxiomsWithThisAsNomen = function () {
              return _axiomsWithThisAsNomen
            }

            this.getAxiomsWithThisAsCopula = function () {
              return _axiomsWithThisAsCopula
            }

            this.getAxiomsWithThisAsAttributum = function () {
              return _axiomsWithThisAsAttributum
            }

            // _Signifier constructor code
            _constructSignifier(QName, prefLabel)
          }
        }
      )()

      _Signifier.prototype = {
        // public, non-privileged methods (one copy for all _Signifiers)
        // uses 'this' to call instance-specific methods, but has no access to private attributes or methods
        log: function () {
          let msg = 'Signifier: '
          msg = msg + 'QName = ' + this.getQName()
          msg = msg + ', prefLabel = ' + this.getPrefLabel()
          console.log(msg)
        }
      }

      // _Signature privileged methods (defined with 'this.', public, unique to each Signature instance, with access to private attributes and methods)
      this.addNamespace = function (prefix, URI) {
        if (prefix.includes(':')) { throw new Error('When adding a namespacePrefix, a colon is not allowed in the prefix name. Specified prefix was ' + prefix) }
        // TODO: shall we validate URI syntax?
        _namespaces[prefix] = URI
        const newNamespace = prefix + ':' + URI
        return newNamespace
      }

      this.addSignifier = function (QName, prefLabel, signifierParticipationType) {
        if (_signifiers[QName]) {
          return _signifiers[QName]
        } else {
          const newSignifier = new _Signifier(QName, prefLabel, signifierParticipationType)
          const newPrefLabel = newSignifier.getPrefLabel()
          const newQName = newSignifier.getQName()
          if (_prefLabels[newPrefLabel]) {
            _prefLabels[newPrefLabel][newQName] = newSignifier
          } else {
            _prefLabels[newPrefLabel] = {}
            _prefLabels[newPrefLabel][newQName] = newSignifier
          }
          _signifiers[newQName] = newSignifier
          return newSignifier
        }
      }

      this.getSignifier = function (signifierId) {
        let signifier = _signifiers[signifierId]
        if (signifier === undefined && util.verifyPropertiesOnSignifierType(signifierId)) {
          signifier = _signifiers[signifierId.getQName()]
        }
        return signifier
      }

      this.getSignifiersForPrefLabel = function (prefLabel) {
        return _prefLabels[prefLabel]
      }

      this.getAxiom = function (nomen, copula, attributum) {
        let existingNomen
        let existingCopula
        let existingAttributum
        let existingAxiom

        if (nomen !== undefined) {
          existingNomen = this.getSignifier(nomen)
        }
        if (existingNomen !== undefined) {
          existingCopula = this.getSignifier(copula)
        }
        if (existingCopula !== undefined) {
          existingAttributum = this.getSignifier(attributum)
        }
        if (
          existingNomen !== undefined &&
          existingCopula !== undefined &&
          existingAttributum === undefined
        ) {
          const testAxioms = this.getAxiomsWithLiteralAsAttributum(attributum)
          if (testAxioms !== undefined) {
            for (let i = 0; i < testAxioms.length; i++) {
              if (
                testAxioms[i].getNomen().getQName() === existingNomen.getQName() &&
                testAxioms[i].getCopula().getQName() === existingCopula.getQName()
              ) {
                existingAttributum = attributum
                existingAxiom = testAxioms[i]
                break
              }
            }
          }
        }
        return existingAxiom
      }

      this.addAxiom = function (nomen, copula, attributum, altCopulaLabel) {
        const existingAxiom = this.getAxiom(nomen, copula, attributum)
        if (existingAxiom) {
          return existingAxiom
        } else {
          const newAxiom = new Axiom(nomen, copula, attributum, altCopulaLabel, _thisSignature)
          _axioms.push(newAxiom)
          return newAxiom
        }
      }

      // TODO: getAxioms is the beginning of a query language
      this.getAxiomsWithLiteralAsAttributum = function (literal) {
        const selectedAxioms = []
        if (typeof literal === 'string') {
          _axioms.forEach(element => {
            if (element.getAttributum() === literal) {
              selectedAxioms.push(element)
            }
          })
        }
        return selectedAxioms
      }

      // ------------------------------
      // constructor code for Signature (runs once when Signature is instantiated with 'new')
      _constructSignature()
    }
  }
)()

Signature.prototype = {
}

export { Signature }
