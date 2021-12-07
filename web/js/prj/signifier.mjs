// _Signifier is an IIFE constructor function which is private to Signature
const Signifier = (
  function () {
    return function (QName, prefLabel) {
      let _QName
      let _prefLabel
      const _AtomicStatementsWithThisAsNomen = []
      const _AtomicStatementsWithThisAsCopula = []
      const _AtomicStatementsWithThisAsAttributum = []

      // the signifier class does not restrict signifiers by QName
      // typically, signature class will perform validations
      // before call new Signifier()
      const _constructSignifier = function (QName, prefLabel) {
        _QName = QName
        _prefLabel = prefLabel
      }

      // TODO: should we have the signifier class keep track of its
      // participation as particulariy or generality?
      this.notifyOfParticipationAsNomen = function (AtomicStatement) {
        _AtomicStatementsWithThisAsNomen.push(AtomicStatement)
        if (AtomicStatement.getCopulaLabel() !== undefined) {
          this[AtomicStatement.getCopulaLabel()] = AtomicStatement.getAttributum()
        }
      }

      this.notifyOfParticipationAsCopula = function (AtomicStatement) {
        _AtomicStatementsWithThisAsCopula.push(AtomicStatement)
      }

      this.notifyOfParticipationAsAttributum = function (AtomicStatement) {
        _AtomicStatementsWithThisAsAttributum.push(AtomicStatement)
      }

      this.getQName = function () {
        return _QName
      }

      this.getPrefLabel = function () {
        return _prefLabel
      }

      // TODO: these get statements are the beginning of a SELECT API
      // there may be multiple theorems for a single AtomicStatement/triple
      this.getAtomicStatementsWithThisAsNomen = function () {
        return _AtomicStatementsWithThisAsNomen
      }

      this.getAtomicStatementsWithThisAsCopula = function () {
        return _AtomicStatementsWithThisAsCopula
      }

      this.getAtomicStatementsWithThisAsAttributum = function () {
        return _AtomicStatementsWithThisAsAttributum
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
