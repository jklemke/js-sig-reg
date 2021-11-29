// Copyright 2021 Joe Klemke http://grox.com
import { util } from './util.mjs'
import { Axiom } from './axiom.mjs'
import { Signifier } from './signifier.mjs'

// Signature contains an immutable basic structure of namespaces, signifiers, axioms
const Signature = (
  // anonymous IIFE function that is called once after the code is parsed,
  // to define the static attributes and methods, and to return the constructor function
  function () {
    // --------------------------------------------------------------------------------
    // private static attributes and functions (defined once and shared by all Signature objects)
    const _validateQNameForUseAsSignifier = function (QName, namespaces) {
      if (QName === undefined) { throw new Error('Invalid QName for new signifier, ' + QName + '.') }
      if (typeof QName !== 'string') { throw new Error('When adding a signifier, QName must be a string.') }
      if (QName.indexOf(':') < 0) { throw new Error('When adding a signifier, QName must have a registered namespace prefix or use ":" in first position to indicate default namespace.') }
      if (QName.indexOf(':') !== QName.lastIndexOf(':')) { throw new Error('When adding a signifier, only one colon is allowed in QName string.') }
      if (QName.indexOf(':') === QName.length - 1) { throw new Error('When adding a signifier, at least one additional character must follow the colon in QName string.') }
      if (QName.indexOf(':') > 0) {
        const namespacePrefix = QName.split(':')[0]
        if (namespaces[namespacePrefix] === undefined) { throw new Error('When adding a signifier, QName must use an existing namespace prefix. ' + QName + ' was not found.') }
      }
    }

    const _buildPrefLabelFromQName = function (QName) {
      if (QName.indexOf(':') === 0) {
        return QName.substring(1)
      } else {
        return QName.split(':')[1]
      }
    }


    // the actual (anonymous) constructor function which gets invoked by new Signature()
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

      // --------------------------------------------------------------------------------
      // privileged methods (defined with 'this'), public, unique to each Signature instance, with access to private attributes and methods)
      this.addNamespace = function (prefix, URI) {
        if (prefix.includes(':')) { throw new Error('When adding a namespacePrefix, a colon is not allowed in the prefix name. Specified prefix was ' + prefix) }
        // TODO: shall we validate URI syntax?
        _namespaces[prefix] = URI
        return _namespaces
      }

      this.getNamespaces = function () {
        return _namespaces
      }

      this.addSignifier = function (QName, prefLabel) {
        let newSignifier
        let newPrefLabel

        if (_signifiers[QName]) {
          return _signifiers[QName]
        } else {
          _validateQNameForUseAsSignifier(QName, _namespaces)
          if (prefLabel === undefined) {
            newPrefLabel = _buildPrefLabelFromQName(QName)
          } else {
            newPrefLabel = prefLabel
          }
          newSignifier = new Signifier(QName, newPrefLabel)
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
