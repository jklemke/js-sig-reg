// _Signifier is an IIFE constructor function which is private to Signature
const Signifier = (
  function () {
    return function (QName, prefLabel) {
      let _QName
      let _prefLabel
      const _StatementsWithThisAsNomen = []
      const _StatementsWithThisAsCopula = []
      const _StatementsWithThisAsAttributum = []

      // the signifier class does not restrict signifiers by QName
      // typically, signature class will perform validations
      // before call new Signifier()
      const _constructSignifier = function (QName, prefLabel) {
        _QName = QName
        _prefLabel = prefLabel
      }

      // TODO: should we have the signifier class keep track of its
      // participation as particulariy or generality?
      this.notifyOfParticipationAsNomen = function (Statement) {
        _StatementsWithThisAsNomen.push(Statement)
        if (Statement.getCopulaLabel() !== undefined) {
          this[Statement.getCopulaLabel()] = Statement.getAttributum()
        }
      }

      this.notifyOfParticipationAsCopula = function (Statement) {
        _StatementsWithThisAsCopula.push(Statement)
      }

      this.notifyOfParticipationAsAttributum = function (Statement) {
        _StatementsWithThisAsAttributum.push(Statement)
      }

      this.getQName = function () {
        return _QName
      }

      this.getPrefLabel = function () {
        return _prefLabel
      }

      // TODO: these get statements are the beginning of a SELECT API
      // there may be multiple theorems for a single Statement/triple
      this.getStatementsWithThisAsNomen = function () {
        return _StatementsWithThisAsNomen
      }

      this.getStatementsWithThisAsCopula = function () {
        return _StatementsWithThisAsCopula
      }

      this.getStatementsWithThisAsAttributum = function () {
        return _StatementsWithThisAsAttributum
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
