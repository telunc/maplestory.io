var APICalls = []

export default class API {
  static registerCall (callUrl, description, parameters, example) {
    APICalls.push({
      url: callUrl,
      desc: description,
      params: (parameters instanceof Array ? parameters : [parameters]),
      example: example
    })
  }

  static get availableCalls () {
    return APICalls
  }

  static createParameter (parameterName, parameterType, parameterDescription) {
    return {
      name: parameterName,
      type: parameterType,
      desc: parameterDescription
    }
  }
}
