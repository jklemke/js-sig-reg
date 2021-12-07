// _DisjointCopulaSet is an IIFE constructor
// it tracks sets of signifiers which are not allowed to be copulas of the same nomen & attributum pair
const DisjointCopulaSet = (

  function () {
    return function (registration, copulaArray) {
      const _disjointCopulas = {}
      const _Statements = []
      let _registration

      const _constructDisjointCopulaSet = function (registration, copulaArray) {
        if (copulaArray === undefined) { throw new Error('copulaArray argument must be an defined') }
        if (!Array.isArray(copulaArray)) { throw new Error('copulaArray argument must be an array') }
        _registration = registration
        const validatedQNameArray = []
        copulaArray.forEach((signifierId) => {
          // assume we are working with unique prefLabels
          const qname = _registration.getUniqueQNameForSignifierId(signifierId)
          if (qname === undefined) { throw new Error('invalid signifier for disjointCopulaSet: ' + signifierId) }
          validatedQNameArray.push(qname)
        })
        if (validatedQNameArray) {
          validatedQNameArray.forEach((qname) => {
            const signifier = _registration.getSignifier(qname)
            _disjointCopulas[qname] = signifier
          })
        }
      }

      this.getCopulaSet = function () {
        return _disjointCopulas
      }

      this.addStatement = function (nomen, copula, attributum) {
        const validatedNomen = _registration.getSignifier(nomen)
        if (!validatedNomen) { throw new Error('invalid nomen for disjointCopulaSet: ' + nomen) }
        const validatedCopula = _registration.getSignifier(copula)
        if (!validatedCopula) { throw new Error('invalid copula for disjointCopulaSet: ' + copula) }
        const validatedAttributum = _registration.getSignifier(attributum)
        if (!validatedAttributum) { throw new Error('invalid attributum for disjointCopulaSet: ' + attributum) }
        const nomenQName = validatedNomen.getQName()
        const copulaQName = validatedCopula.getQName()
        const attributumQName = validatedAttributum.getQName()
        _Statements.push({ nomenQName: nomenQName, copulaQName: copulaQName, attributumQName })
      }

      this.getStatements = function () {
        return _Statements
      }

      _constructDisjointCopulaSet(registration, copulaArray)
    }
  }
)()

// _DisjointAttributum is an IIFE constructor function
// it tracks sets of signifiers which are not allowed to be attributums of the same nomen & copula pair
const DisjointAttributumSet = (

  function () {
    return function (registration, attributumArray) {
      const _disjointAttributums = {}
      const _Statements = []
      let _registration

      const _constructDisjointAttributumSet = function (registration, attributumArray) {
        if (attributumArray === undefined) { throw new Error('attributumArray argument must be defined') }
        if (!Array.isArray(attributumArray)) { throw new Error('attributumArray argument must be an array') }
        _registration = registration
        const validatedQNameArray = []
        attributumArray.forEach((signifierId) => {
          // assume we are working with unique prefLabels
          const qname = _registration.getUniqueQNameForSignifierId(signifierId)
          if (qname === undefined) { throw new Error('invalid signifier for disjointAttributumSet: ' + signifierId) }
          validatedQNameArray.push(qname)
        })
        if (validatedQNameArray) {
          validatedQNameArray.forEach((qname) => {
            const signifier = _registration.getSignifier(qname)
            _disjointAttributums[qname] = signifier
          })
        }
      }

      this.getAttributumSet = function () {
        return _disjointAttributums
      }

      this.addStatement = function (nomen, copula, attributum) {
        const validatedNomen = _registration.getSignifier(nomen)
        if (!validatedNomen) { throw new Error('invalid nomen for disjointAttributumSet: ' + nomen) }
        const validatedCopula = _registration.getSignifier(copula)
        if (!validatedCopula) { throw new Error('invalid copula for disjointAttributumSet: ' + copula) }
        const validatedAttributum = _registration.getSignifier(attributum)
        if (!validatedAttributum) { throw new Error('invalid attributum for disjointAttributumSet: ' + attributum) }
        const nomenQName = validatedNomen.getQName()
        const copulaQName = validatedCopula.getQName()
        const attributumQName = validatedAttributum.getQName()
        _Statements.push({ nomenQName: nomenQName, copulaQName: copulaQName, attributumQName })
      }

      this.getStatements = function () {
        return _Statements
      }

      _constructDisjointAttributumSet(registration, attributumArray)
    }
  }
)()

export { DisjointCopulaSet }
export { DisjointAttributumSet }
