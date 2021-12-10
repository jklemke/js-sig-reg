import { Signature } from '../../web/js/prj/signature.mjs'
import { Registration } from '../../web/js/prj/registration.mjs'
// import { Categorization } from '../../web/js/prj/categorization.mjs'
import { AggregationChain } from '../../web/js/prj/aggregation.mjs'
import { test, expect } from '@jest/globals'

test('new AggregationChain()', () => {
  const signature = new Signature()
  const registration = new Registration(signature)
  //  const categorization = new Categorization(registration)
  let aggregationChain

  const individualWrtAggregate = registration.getSignifier('grox:iT4tYHw9xJVf65egdT1hOtNu')
  const aggregateWrtSuperAggregate = registration.getSignifier('grox:LY41ZUMrKdPh9G3w6b2rxFUY')
  const aggregateWrtJurisdiction = registration.getSignifier('grox:QQ46Ef5vecHgr6ctohqU1pTo')

  expect(individualWrtAggregate).not.toBeUndefined()
  expect(aggregateWrtSuperAggregate).not.toBeUndefined()
  expect(aggregateWrtJurisdiction).not.toBeUndefined()

  expect(() => {
    aggregationChain = new AggregationChain(individualWrtAggregate, aggregateWrtSuperAggregate)
  }).not.toThrow()

  //  generalizationChain = new GeneralizationChain(individualWrtAggregate, aggregateWrtSuperAggregate)
  aggregationChain.insertLink(aggregateWrtSuperAggregate, aggregateWrtJurisdiction)
  aggregationChain.log()
})
