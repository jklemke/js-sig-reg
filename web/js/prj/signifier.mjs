// _Signifier is an IIFE constructor function which is private to Signature
const Signifier = (
  function () {
    return function (QName, prefLabel) {
      let _QName
      let _prefLabel
      const _axiomsWithThisAsNomen = []
      const _axiomsWithThisAsCopula = []
      const _axiomsWithThisAsAttributum = []

      const _constructSignifier = function (QName, prefLabel) {
        if (QName === undefined) { throw new Error('Invalid QName for new signifier, ' + QName + '.') }
        if (typeof QName !== 'string') { throw new Error('When adding a signifier, QName must be a string.') }
        if (QName.indexOf(':') < 0) { throw new Error('When adding a signifier, QName must have a registered namespace prefix or use ":" in first position to indicate default namespace.') }
        if (QName.indexOf(':') !== QName.lastIndexOf(':')) { throw new Error('When adding a signifier, only one colon is allowed in QName string.') }
        if (QName.indexOf(':') === QName.length - 1) { throw new Error('When adding a signifier, at least one additional character must follow the colon in QName string.') }
        _QName = QName

        if (prefLabel === undefined) {
          if (QName.indexOf(':') === 0) {
            _prefLabel = QName.substring(1)
          } else {
            _prefLabel = QName.split(':')[1]
          }
        } else {
          _prefLabel = prefLabel
        }
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

      _constructSignifier(QName, prefLabel)
    }
  }
)()

Signifier.prototype = {
  log: function () {
    let msg = 'Signifier: '
    msg = msg + 'QName = ' + this.getQName()
    msg = msg + ', prefLabel = ' + this.getPrefLabel()
    console.log(msg)
  }
}

export { Signifier }
