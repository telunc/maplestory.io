var APICalls = []

export default class API {
  static registerCall (callUrl, description, parameters, example, exampleUrl) {

    if(!exampleUrl){
      exampleUrl = callUrl
      while(exampleUrl.indexOf(':') != -1){
        var parameterStart = exampleUrl.indexOf(':')
        var parameterEnd = exampleUrl.indexOf('/', parameterStart)
        exampleUrl = exampleUrl.substr(0, parameterStart) + '1' + (parameterEnd == -1 ? '' : exampleUrl.substr(parameterEnd))
      }
    }

    APICalls.push({
      url: callUrl,
      exampleUrl: exampleUrl,
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
