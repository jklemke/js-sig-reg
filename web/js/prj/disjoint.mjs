// _DisjointAttributum is an IIFE constructor function which is private to Registration
// it tracks sets of signifiers which are not allowed to be attributums of the same nomen & copula pair
const DisjointCopulaSet = (

  function () {
    return function (registration, copulaArray) {
      const _disjointCopulas = {}
      const _nomenAttributumPairs = [{
        nomen: {},
        attributum: {}
      }]
      let _registration

      const _constructDisjointCopulaSet = function (registration, copulaArray) {
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

      this.addNomenAttributumPair = function (nomen, attributum) {
        const validatedNomen = _registration.getSignifier(nomen)
        if (!validatedNomen) { throw new Error('invalid nomen for disjointCopulaSet: ' + nomen) }
        const validatedAttributum = _registration.getSignifier(attributum)
        if (!validatedAttributum) { throw new Error('invalid attributum for disjointCopulaSet: ' + attributum) }
        _nomenAttributumPairs.push({ nomen: validatedNomen, attributum: validatedAttributum })
      }

      this.getNomenAttributumPairs = function () {
        return _nomenAttributumPairs
      }

      _constructDisjointCopulaSet(registration, copulaArray)
    }
  }
)()

const DisjointAttributumSet = (

  function () {
    return function (registration, attributumArray) {
      const _disjointAttributums = {}
      const _nomenCopulaPairs = [{
        nomen: {},
        copula: {}
      }]
      let _registration

      const _constructDisjointAttributumSet = function (registration, attributumArray) {
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

      this.addNomenCopulaPair = function (nomen, copula) {
        const validatedNomen = _registration.getSignifier(nomen)
        if (!validatedNomen) { throw new Error('invalid nomen for disjointAttributumSet: ' + nomen) }
        const validatedCopula = _registration.getSignifier(copula)
        if (!validatedCopula) { throw new Error('invalid copula for disjointAttributumSet: ' + copula) }
        _nomenCopulaPairs.push({ nomen: validatedNomen, copula: validatedCopula })
      }

      this.getNomenCopulaPairs = function () {
        return _nomenCopulaPairs
      }

      _constructDisjointAttributumSet(registration, attributumArray)
    }
  }
)()

export { DisjointCopulaSet }
export { DisjointAttributumSet }
