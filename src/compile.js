const Gherkin = require("gherkin");
const fs = require("fs");
const glob = require("glob");
const parser = new (require("cucumber-tag-expressions").TagExpressionParser)();
const path = require("path");
const util = require("util");
const _ = require("lodash");

/**
 * Compile and create splitted files
 * @param {Array<string>} specs - glob expression for specs
 * @param {string} tagExpression - tag expression to parse
 * @param {string} tempFolder - path to temp folder
 *
 * @return {Promise.<void>}
 */
async function compile(specs, tempFolder, tagExpression = "") {
    const filePaths = await _getFilesPathsFromGlob(specs);
    const featureTexts = _readFiles(filePaths);
    const asts = _parseGherkinFiles(featureTexts);
    asts.forEach(ast => {
        const featureTemplate = _getFeatureTemplate(ast);
        const features = _splitFeature(ast.feature.children, featureTemplate);
        const filteredFeatures = _filterFeaturesByTag(features, tagExpression);
        filteredFeatures.forEach((splitFeature, index) => {
            const escapedFileName = splitFeature.feature.name.replace(/[/\s]/g,"_");
            fs.writeFileSync(`${tempFolder}/${escapedFileName}.${new Date().getTime()}.feature`, _writeFeature(splitFeature.feature), "utf8");
        })
    });
}

/**
 * Read file paths by glob pattern
 * @param {Array<string>} specs - glob expression for specs
 * @private
 * @return {Promise}
 */
async function _getFilesPathsFromGlob(specs) {
    const notNormalizedFilePaths = await Promise.all(specs.map(spec => util.promisify(glob)(spec)));
    return _.uniq(_.flatten(notNormalizedFilePaths))
}

/**
 * Read file content by provided paths
 * @private
 * @param filePaths
 * @return {Array}
 */
function _readFiles(filePaths) {
    return filePaths.map(filePath => fs.readFileSync(filePath, "utf8"))
}

/**
 * Parse gherkin files to ASTs
 * @private
 * @param features
 * @return {Array}
 */
function _parseGherkinFiles(features) {
    const parser = new Gherkin.Parser(new Gherkin.AstBuilder());
    const matcher = new Gherkin.TokenMatcher();

    return features.map(feature => {
        const scanner = new Gherkin.TokenScanner(feature);
        return parser.parse(scanner, matcher)
    });
}

/**
 * Get feature template for splitting
 * @private
 * @param feature
 * @return {*}
 */
function _getFeatureTemplate(feature) {
    const featureTemplate = _.cloneDeep(feature);
    featureTemplate.feature.children = featureTemplate.feature.children.filter(scenario => scenario.type === "Background");
    return featureTemplate
}

/**
 * Split feature
 * @param {Array} scenarios - list of scenarios
 * @param {Object} featureTemplate - template of feature
 * @return {Array} - list of features
 * @private
 */
function _splitFeature(scenarios, featureTemplate) {
    const scenarioOutline = scenarios
        .filter(scenario => scenario.type !== "Background")
        .map(scenario => {
            if (scenario.type === "ScenarioOutline") {
                const scenarioTemplate = _.cloneDeep(scenario);
                return scenario.examples[0].tableBody.map(row => {
                    const modifiedScenario = _.cloneDeep(scenarioTemplate);
                    modifiedScenario.examples[0].tableBody = [row];
                    return modifiedScenario;
                })
            } else return scenario
        });

    return _.flatten(scenarioOutline)
        .map(scenario => {
            const feature = _.cloneDeep(featureTemplate);
            const updatedScenario = _.cloneDeep(scenario);
            updatedScenario.tags = [...scenario.tags].concat(featureTemplate.feature.tags);
            feature.feature.children.push(updatedScenario);
            return feature
        })
}

/**
 * Write features to files
 * @param feature
 * @return {string}
 * @private
 */
function _writeFeature(feature) {
    const LINE_DELIMITER = "\n";

    let featureString = "";

    if (feature.tags) {
        feature.tags.forEach(tag => {
            featureString += `${tag.name}${LINE_DELIMITER}`
        });
    }

    featureString += `${feature.type}: ${feature.name}${LINE_DELIMITER}`;

    feature.children.forEach(scenario => {
        if (scenario.tags) {
            scenario.tags.forEach(tag => {
                featureString += `${tag.name}${LINE_DELIMITER}`
            });
        }
        featureString += `${scenario.keyword}: ${scenario.name}${LINE_DELIMITER}`;

        scenario.steps.forEach(step => {
            featureString += `${step.keyword}${step.text}${LINE_DELIMITER}`;
        });

        if (scenario.examples) {
            const example = scenario.examples[0];
            featureString += `Examples:${LINE_DELIMITER}`;
            featureString += `|${example.tableHeader.cells.map(cell => `${cell.value}|`).join("")}${LINE_DELIMITER}`;
            example.tableBody.forEach(tableRow => {
                featureString += `|${tableRow.cells.map(cell => `${cell.value}|`).join("")}${LINE_DELIMITER}`;
            })
        }
    });

    return featureString;
}

/**
 * Filter features by tag expression
 * @param features
 * @param tagExpression
 * @return {Array}
 * @private
 */
function _filterFeaturesByTag(features, tagExpression) {
    const expressionNode = parser.parse(tagExpression);
    return features.filter(feature => {
        return feature.feature.children.some(scenario => {
            if (scenario.tags) {
                return expressionNode.evaluate(scenario.tags.map(tag => tag.name))
            }
        })
    });
}

module.exports = compile;