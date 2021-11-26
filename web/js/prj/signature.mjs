// Copyright 2021 Joe Klemke http://grox.com
import { util } from './util.mjs'

// Signature holds the basic structure of namespaces, signifiers, axioms
const Signature = (
  // anonymous IIFE function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
  function () {
    // private static attribute (defined once and shared by all Signature objects)

    // the actual constructor function which gets invoked by new Signature()
    return function () {
      // private attributes, unique to each Signature instance
      // Signature is immutable, there are only getter methods for these
      const _namespaces = {}
      const _axioms = []
      const _signifiers = {}
      const _prefLabels = {}
      const _thisSignature = this

      // private methods, unique to each Signature instance, with access to private attributes and methods
      // _Signifier is an IIFE constructor function which is private to Signature
      const _Signifier = (
        function () {
          return function (QName, prefLabel) {
            // private to each _Signifier instance
            // note: Signifier is immutable, there are only getter methods for these
            let _QName = null
            let _prefLabel = null
            const _axiomsWithThisAsNomen = []
            const _axiomsWithThisAsCopula = []
            const _axiomsWithThisAsAttributum = []

            // public _Signifier methods
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
        }
      )()

      // _Axiom is an IIFE constructor function which is private to Signature
      // An Axiom is an in-memory physical structure of an RDF-like triples,
      // but instead of Subject/Predicate/Object we use Nomen/Copula/Attributum.
      // This is because "subject" and "object" are semantically overloaded
      const _Axiom = (
        function () {
          return function (nomen, copula, attributum, altCopulaLabel) {
            // private to each _Axiom instance
            // _Axiom is immutable, there are only getter methods for these
            let _nomen
            let _copula
            let _attributumSignifier
            let _attributumLiteral
            let _copulaLabel = null

            // public _Axiom methods
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

            // _Axiom constructor
            // TODO: should we automaticaly create new signifiers? or should we fail if they don't exist?
            // at present, we create new signifiers
            if (util.verifyPropertiesOnSignifierType(nomen)) {
              _nomen = nomen
            }
            if (_nomen === undefined) {
              const testNomen = _thisSignature.getSignifier(nomen)
              if (testNomen !== undefined) { _nomen = testNomen }
            }
            if (_nomen === undefined) {
              if (typeof nomen === 'string') {
                _nomen = _thisSignature.addSignifier(nomen)
              }
            }
            if (_nomen === undefined) { throw new Error('Invalid Nomen for new Axiom, ' + nomen + '.') }

            if (util.verifyPropertiesOnSignifierType(copula)) {
              _copula = copula
            }
            if (_copula === undefined) {
              const testCopula = _thisSignature.getSignifier(copula)
              if (testCopula !== undefined) { _copula = testCopula }
            }
            if (_copula === undefined) {
              if (typeof copula === 'string') {
                _copula = _thisSignature.addSignifier(copula, altCopulaLabel)
              }
            }
            if (_copula === undefined) { throw new Error('Invalid Copula for new Axiom, ' + copula + '.') }

            if (util.verifyPropertiesOnSignifierType(attributum)) {
              _attributumSignifier = attributum
            }
            if (_attributumSignifier === undefined) {
              const testAttributum = _thisSignature.getSignifier(attributum)
              if (testAttributum) { _attributumSignifier = testAttributum }
            }
            if (_attributumSignifier === undefined) {
              // if Attributum string has one colon, assume the caller wants it to be a new Signifier
              if (
                typeof attributum === 'string' &&
                attributum.includes(':') &&
                attributum.lastIndexOf(':') === attributum.indexOf(':')
              ) {
                _attributumSignifier = _thisSignature.addSignifier(attributum)
              }
            }
            if (_attributumSignifier === undefined) {
              // if Attributum string is any other string, then store it as a string literal
              if (typeof attributum === 'string') { _attributumLiteral = attributum }
            }
            if (_attributumSignifier === undefined && _attributumLiteral === undefined) { throw new Error('Invalid Attributum for new Axiom, ' + attributum + '.') }

            _copulaLabel = _constructCopulaLabel(_copula, altCopulaLabel)
            _nomen.notifyOfParticipationAsNomen(this)
            _copula.notifyOfParticipationAsCopula(this)

            if (util.verifyPropertiesOnSignifierType(_attributumSignifier)) {
              _attributumSignifier.notifyOfParticipationAsAttributum(this)
            }
          }

          function _constructCopulaLabel (copula, altCopulaLabel) {
            let copulaLabel
            if (altCopulaLabel !== undefined && (typeof altCopulaLabel) === 'string') {
              copulaLabel = altCopulaLabel
            } else if (util.verifyPropertiesOnSignifierType(copula)) {
              copulaLabel = copula.getPrefLabel()
            }
            return copulaLabel
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

      _Axiom.prototype = {
        // public, non-privileged methods (one copy for all _Axioms)
        // uses 'this' to call instance-specific methods, but has no access to private attributes or methods
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
          const newAxiom = new _Axiom(nomen, copula, attributum, altCopulaLabel)
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

      // constructor code for Signature (runs once when the Attributum is instantiated with 'new')
      // ------------------------------
    }
  }
)()

Signature.prototype = {
}

export { Signature }
