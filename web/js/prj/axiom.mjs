// Copyright 2021 Joe Klemke http://grox.com
import { util } from './util.mjs'

// Axiom is an IIFE constructor, instantiated with new Axiom
// An Axiom is an in-memory physical structure of an RDF-like triple,
// but instead of Subject/Predicate/Object we use Nomen/Copula/Attributum.
// This is because "subject","object", and "predicate" are semantically overloaded
const Axiom = (

  function () {
    // static functions that don't require access to private attributes
    const _constructCopulaLabel = function (copula, altCopulaLabel) {
      let copulaLabel
      if (altCopulaLabel !== undefined && (typeof altCopulaLabel) === 'string') {
        copulaLabel = altCopulaLabel
      } else if (util.verifyPropertiesOnSignifierType(copula)) {
        copulaLabel = copula.getPrefLabel()
      }
      return copulaLabel
    }

    return function (nomen, copula, attributum, altCopulaLabel, signature) {
      let _nomen
      let _copula
      let _attributumSignifier
      let _attributumLiteral
      let _copulaLabel = null
      const _thisAxiom = this
      let _signature

      const _constructAxiom = function (nomen, copula, attributum, altCopulaLabel, signature) {
        _signature = signature
        _validateNomenForNewAxiom(nomen)
        _validateCopulaForNewAxiom(copula)
        _validateAttributumForNewAxiom(attributum)
        _copulaLabel = _constructCopulaLabel(_copula, altCopulaLabel)
        _nomen.notifyOfParticipationAsNomen(_thisAxiom)
        _copula.notifyOfParticipationAsCopula(_thisAxiom)
        if (util.verifyPropertiesOnSignifierType(_attributumSignifier)) {
          _attributumSignifier.notifyOfParticipationAsAttributum(_thisAxiom)
        }
      }

      const _validateNomenForNewAxiom = function (nomen) {
        if (util.verifyPropertiesOnSignifierType(nomen)) {
          _nomen = nomen
        }
        if (_nomen === undefined) {
          const testNomen = _signature.getSignifier(nomen)
          if (testNomen !== undefined) { _nomen = testNomen }
        }
        if (_nomen === undefined) {
          if (typeof nomen === 'string') {
            _nomen = _signature.addSignifier(nomen)
          }
        }
        if (_nomen === undefined) { throw new Error('Invalid Nomen for new Axiom, ' + nomen + '.') }
      }

      const _validateCopulaForNewAxiom = function (copula) {
        if (util.verifyPropertiesOnSignifierType(copula)) {
          _copula = copula
        }
        if (_copula === undefined) {
          const testCopula = _signature.getSignifier(copula)
          if (testCopula !== undefined) { _copula = testCopula }
        }
        if (_copula === undefined) {
          if (typeof copula === 'string') {
            _copula = _signature.addSignifier(copula, altCopulaLabel)
          }
        }
        if (_copula === undefined) { throw new Error('Invalid Copula for new Axiom, ' + copula + '.') }
      }

      const _validateAttributumForNewAxiom = function (attributum) {
        if (util.verifyPropertiesOnSignifierType(attributum)) {
          _attributumSignifier = attributum
        }
        if (_attributumSignifier === undefined) {
          const testAttributum = _signature.getSignifier(attributum)
          if (testAttributum) { _attributumSignifier = testAttributum }
        }
        if (_attributumSignifier === undefined) {
          // if Attributum string has one colon, assume the caller wants it to be a new Signifier
          if (
            typeof attributum === 'string' &&
            attributum.includes(':') &&
            attributum.lastIndexOf(':') === attributum.indexOf(':')
          ) {
            _attributumSignifier = _signature.addSignifier(attributum)
          }
        }
        if (_attributumSignifier === undefined) {
          // if Attributum string is any other string, then store it as a string literal
          if (typeof attributum === 'string') { _attributumLiteral = attributum }
        }
        if (_attributumSignifier === undefined && _attributumLiteral === undefined) { throw new Error('Invalid Attributum for new Axiom, ' + attributum + '.') }
      }

      this.getNomen = function () {
        return _nomen
      }

      this.getCopula = function () {
        return _copula
      }

      this.getCopulaLabel = function () {
        return _copulaLabel
      }
      this.getAttributum = function () {
        if (_attributumSignifier) { return _attributumSignifier }
        if (_attributumLiteral) { return _attributumLiteral }
      }

      _constructAxiom(nomen, copula, attributum, altCopulaLabel, signature)
    }
  }
)()

Axiom.prototype = {
  log: function () {
    let msg = 'Nomen ' + this.getNomen().getPrefLabel() + '\nCopula ' + this.getCopula().getPrefLabel() + '\nAttributum '
    const testAttributum = this.getAttributum()
    if (util.verifyPropertiesOnSignifierType(testAttributum)) {
      msg += testAttributum.getPrefLabel()
    } else {
      msg += testAttributum.toString()
    }
    console.log(msg)
  }
}

export { Axiom }
