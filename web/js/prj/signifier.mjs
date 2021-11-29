// _Signifier is an IIFE constructor function which is private to Signature
const Signifier = (
  function () {
    return function (QName, prefLabel) {
      let _QName
      let _prefLabel
      const _axiomsWithThisAsNomen = []
      const _axiomsWithThisAsCopula = []
      const _axiomsWithThisAsAttributum = []

      // the signifier class does not restrict signifiers by QName
      // typically, signature class will perform validations
      // before call new Signifier()
      const _constructSignifier = function (QName, prefLabel) {
        _QName = QName
        _prefLabel = prefLabel
      }

      // TODO: should we have the signifier class keep track of its
      // participation as particulariy or generality?
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
