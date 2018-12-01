# Gherkin Parallel
The module is intended to separate feature files for their further parallelization by protractor or webdriverIO. Existing scenarion and scenario outlines will be splitted into separate feature files in temporarary folder.
### Function params
|name|type|mandatority|default|description|
|-|-|-|-|-|
|specs|Array\<string>|M||glob patterns of specs to split|
|outDir|string|M||path to temp folder|
|tagExpression|string|O||tag expression to filter splitted features|
|lang|string|O|en|language of source features|

return Promise\<void\>

Splitted features will be placed in temp folder with <featureName>.<timestamp>.feature (e.g Login.1543659379787.feature)        
```javascript
const compile = require("gherkin-parallel");

await compile({
    specs: ["./test/scenarioOutline.feature"],
    outDir: "./temp_folder",
    tagExpression: "@scenarioOutlineTag1",
    lang: "en"
});
```
