const translator = require('@parvineyvazov/json-translator');

async function TranslateJson(body) {
let translatedBody = await translator.translateObject(
  body,
  translator.languages.English,
  translator.languages.Hindi
);
console.log(translatedBody);
return translatedBody;
}

module.exports= TranslateJson;