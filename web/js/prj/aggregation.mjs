const AggregationChain = (

  function () {
    return function (narrowerSignifier, broaderSignifier) {
      let _bottomLink
      let _topLink

      // TODO: we need to verify the logic of categorization, and classification
      // or do we do that in categorization.mjs???
      const _constructAggregationChain = function (narrowerSignifier, broaderSignifier) {
        if (narrowerSignifier === undefined && broaderSignifier === undefined) {
          throw new Error('undefined arguments to new GeneralizationChain()')
        }
        _bottomLink = new AggregationLink(undefined, narrowerSignifier, undefined)
        _bottomLink.setBroaderLink(new AggregationLink(_bottomLink, broaderSignifier, undefined))
        _topLink = undefined
      }

      this.insertLink = function (newNarrowerSignifier, newBroaderSignifier) {
        // TODO:
        // verify args are valid signifiers???
        // walk the chain from _bottom up until reaching narrower
        let index = _bottomLink
        do {
          if (index.getLinkSignifier() === newNarrowerSignifier) {
            if (index.getBroaderLink() === newBroaderSignifier) {
              break
            } else {
              const newLink = new AggregationLink(index.getNarrowerLink(), newBroaderSignifier, index.getBroaderLink())
              index.setBroaderLink(newLink)
              break
            }
          }
          index = index.getBroaderLink()
        } while (index !== undefined)
      }

      // once TopLink is assigned, it is immutable
      this.addTopLink = function (topSignifier) {
        // if exists and is signifier and uses core attributums
        _topLink = topSignifier
      }

      this.log = function () {
        let index = _bottomLink
        do {
          index.getLinkSignifier().log()
          index = index.getBroaderLink()
        } while (index !== undefined)
      }

      this.apply = function (funcName) {
        let index = _bottomLink
        do {
          (index.getLinkSignifier())[funcName]()
          index = index.getBroaderLink()
        } while (index !== undefined)
      }
      _constructAggregationChain(narrowerSignifier, broaderSignifier)
    }
  }
)()

const AggregationLink = (
  function () {
    return function (narrowerLink, linkSignifier, broaderLink) {
      let _narrowerLink
      let _linkSignifier
      let _broaderLink

      const _constructAggregationLink = function (narrowerLink, linkSignifier, broaderLink) {
        // at least one of narrower and broader should exist
        /* if (narrowerSignifier === undefined && broaderSignifier === undefined) {
          throw new Error('msg')
        } */
        if (linkSignifier === undefined) {
          throw new Error('msg')
        }
        _narrowerLink = narrowerLink
        _linkSignifier = linkSignifier
        _broaderLink = broaderLink
      }

      this.getNarrowerLink = function () {
        return _narrowerLink
      }

      this.getLinkSignifier = function () {
        return _linkSignifier
      }

      this.getBroaderLink = function () {
        return _broaderLink
      }

      this.setBroaderLink = function (broaderLink) {
        _broaderLink = broaderLink
      }

      _constructAggregationLink(narrowerLink, linkSignifier, broaderLink)
    }
  }
)()

export { AggregationChain }
