# How to run

```javascript
const compile = require("gherkin-parallel");

compile({
    specs: ["./test/scenarioOutline.feature"],
    outDir: "./temp_folder",
    tagExpression: "@scenarioOutlineTag1",
    lang: "en"
});
```