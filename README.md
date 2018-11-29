# How to run

```javascript
const compile = require("gherkin-parallel");

await compile({
    specs: ["./test/scenarioOutline.feature"],
    outDir: "./temp_folder",
    tagExpression: "@scenarioOutlineTag1",
    lang: "en"
});
```