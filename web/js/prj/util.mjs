// top level namespace
// var grox = grox || {}

// utility functions in the grox namespace
const util = {}

util.checkForMissingPropertyOnObject = function (testValue, testProperty) {
  let returnString
  if (testValue[testProperty] === undefined) {
    returnString = 'missing property: ' + testProperty
  }
  return returnString
}

util.verifyPropertiesOnObject = function (testObject, objectName, propertyArray, failOnError) {
  let isSuccess = true
  let errorMsg = 'Not a ' + objectName

  if (testObject === undefined) {
    isSuccess = false
    errorMsg += '\nundefined'
  }

  if (typeof testObject === 'object') {
    errorMsg += '\ntestObject properties:'
    for (const key in testObject) {
      errorMsg += '\n\t' + key
    }
  } else {
    isSuccess = false
    errorMsg += '\nnot an object'
  }

  if (isSuccess) {
    for (let i = 0; i < propertyArray.length; i++) {
      const testResult = this.checkForMissingPropertyOnObject(testObject, propertyArray[i])
      if (testResult) {
        isSuccess = false
        errorMsg += '\n' + testResult
      }
    }
  }

  if (failOnError === 'fail') {
    if (!isSuccess) {
      throw new Error(errorMsg)
    }
  }

  return isSuccess
}

// type checking functions in grox namespace
util.verifyPropertiesOnSignatureType = function (testObject, failOnError) {
  const propertyArray = [
    'addNamespace',
    'addSignifier',
    'getSignifier',
    'addAxiom',
    'getAxiomsWithLiteralAsAttributum',
    'getSignifierParticipationEnum',
    'getSignifiersForPrefLabel'
  ]
  return util.verifyPropertiesOnObject(testObject, 'Signature', propertyArray, failOnError)
}

util.verifyPropertiesOnSignifierType = function (testObject, failOnError) {
  const propertyArray = [
    'notifyOfParticipationAsNomen',
    'notifyOfParticipationAsCopula',
    'notifyOfParticipationAsAttributum'
  ]
  return util.verifyPropertiesOnObject(testObject, 'Signifier', propertyArray, failOnError)
}

util.verifyPropertiesOnAxiomType = function (testObject, failOnError) {
  const propertyArray = [
    'getNomen',
    'getCopula',
    'getCopulaLabel',
    'getAttributum'
  ]
  return util.verifyPropertiesOnObject(testObject, 'Axiom', propertyArray, failOnError)
}

util.verifyPropertiesOnGrammarType = function (testObject, failOnError) {
  const propertyArray = [
    'addNamespace',
    'addSignifier',
    'getSignifier',
    'addAxiom',
    'getAxiomsWithLiteralAsAttributum',
    'getSignifierParticipationEnum',
    'getUniqueQNameForSignifierId'
  ]
  return util.verifyPropertiesOnObject(testObject, 'Grammar', propertyArray, failOnError)
}

util.utilSpud = function () {
  console.log('util spud -----')
}

export { util }

// export default grox
