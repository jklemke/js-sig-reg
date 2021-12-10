// _SymmetricCopulaSet is an IIFE constructor
// it tracks sets of signifiers which MUST be symmetric with respect to the same nomen & attributum pair
const SymmetricCopulaPair = (

  function () {
    return function (registration, copulaArray) {
      const _symmetricCopulaPairs = {}
      const _Statements = []
      let _registration

      const _constructSymmetricCopulaPair = function (registration, copulaArray) {
        _registration = registration
        if (copulaArray === undefined) { throw new Error('copulaArray argument must be an defined') }
        if (!Array.isArray(copulaArray)) { throw new Error('copulaArray argument must be an array') }
        if (copulaArray.length !== 2) { throw new Error('copulaArray argument must be an array of length 2') }
        const validatedQNameArray = []
        copulaArray.forEach((signifierId) => {
          // assume we are working with unique prefLabels
          const qname = _registration.getUniqueQNameForSignifierId(signifierId)
          if (qname === undefined) { throw new Error('invalid signifier for symmetricCopulaPair: ' + signifierId) }
          validatedQNameArray.push(qname)
        })
        if (validatedQNameArray) {
          validatedQNameArray.forEach((qname) => {
            const signifier = _registration.getSignifier(qname)
            _symmetricCopulaPairs[qname] = signifier
          })
        }
      }

      this.getCopulaPair = function () {
        return _symmetricCopulaPairs
      }

      this.addStatement = function (nomen, copula, attributum) {
        const validatedNomen = _registration.getSignifier(nomen)
        if (!validatedNomen) { throw new Error('invalid nomen for symmetricCopulaPair: ' + nomen) }
        const validatedCopula = _registration.getSignifier(copula)
        if (!validatedCopula) { throw new Error('invalid copula for symmetricCopulaPair: ' + copula) }
        const validatedAttributum = _registration.getSignifier(attributum)
        if (!validatedAttributum) { throw new Error('invalid attributum for symmetricCopulaPair: ' + attributum) }
        const nomenQName = validatedNomen.getQName()
        const copulaQName = validatedCopula.getQName()
        const attributumQName = validatedAttributum.getQName()
        _Statements.push({ nomenQName: nomenQName, copulaQName: copulaQName, attributumQName })
      }

      this.getStatements = function () {
        return _Statements
      }

      _constructSymmetricCopulaPair(registration, copulaArray)
    }
  }
)()

// _SymmetricCopulaSet is an IIFE constructor
// it tracks sets of signifiers which MUST be symmetric with respect to the same nomen & attributum pair
const AsymmetricCopulaPair = (

  function () {
    return function (registration, copulaArray) {
      const _asymmetricCopulaPairs = {}
      const _Statements = []
      let _registration

      const _constructAsymmetricCopulaPair = function (registration, copulaArray) {
        _registration = registration
        if (copulaArray === undefined) { throw new Error('copulaArray argument must be an defined') }
        if (!Array.isArray(copulaArray)) { throw new Error('copulaArray argument must be an array') }
        if (copulaArray.length !== 2) { throw new Error('copulaArray argument must be an array of length 2') }
        const validatedQNameArray = []
        copulaArray.forEach((signifierId) => {
          // assume we are working with unique prefLabels
          const qname = _registration.getUniqueQNameForSignifierId(signifierId)
          if (qname === undefined) { throw new Error('invalid signifier for symmetricCopulaPair: ' + signifierId) }
          validatedQNameArray.push(qname)
        })
        if (validatedQNameArray) {
          validatedQNameArray.forEach((qname) => {
            const signifier = _registration.getSignifier(qname)
            _asymmetricCopulaPairs[qname] = signifier
          })
        }
      }

      this.getCopulaPairs = function () {
        return _asymmetricCopulaPairs
      }

      this.addStatement = function (nomen, copula, attributum) {
        const validatedNomen = _registration.getSignifier(nomen)
        if (!validatedNomen) { throw new Error('invalid nomen for symmetricCopulaPair: ' + nomen) }
        const validatedCopula = _registration.getSignifier(copula)
        if (!validatedCopula) { throw new Error('invalid copula for symmetricCopulaPair: ' + copula) }
        const validatedAttributum = _registration.getSignifier(attributum)
        if (!validatedAttributum) { throw new Error('invalid attributum for symmetricCopulaPair: ' + attributum) }
        const nomenQName = validatedNomen.getQName()
        const copulaQName = validatedCopula.getQName()
        const attributumQName = validatedAttributum.getQName()
        _Statements.push({ nomenQName: nomenQName, copulaQName: copulaQName, attributumQName })
      }

      this.getStatements = function () {
        return _Statements
      }

      _constructAsymmetricCopulaPair(registration, copulaArray)
    }
  }
)()

export { SymmetricCopulaPair }
export { AsymmetricCopulaPair }
