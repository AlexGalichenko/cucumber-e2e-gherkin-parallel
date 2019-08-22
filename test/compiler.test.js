const fs = require("fs-extra");
const path = require("path");
const compile = require('../lib/compile');

const TEMP_FOLDER = path.resolve("./test/temp/");

beforeEach(async () => {
    await fs.emptyDir(TEMP_FOLDER);
});

test("compile scenario", async () => {
    await compile({
        specs: ["./test/scenario.feature"],
        outDir: TEMP_FOLDER
    });

    const fileContent = await Promise.all((await fs.readdir(TEMP_FOLDER)).map(file => fs.readFile(path.resolve(TEMP_FOLDER + "/" + file), "utf-8")));
    expect(fileContent.length).toBe(2);
    expect(fileContent[0]).toBe("@featureTag\nFeature: Scenario\nBackground: \nGiven Prerequisites\n@scenarioTag1\n@featureTag\nScenario: Simple scenario 1\nThen Test\n");
    expect(fileContent[1]).toBe("@featureTag\nFeature: Scenario\nBackground: \nGiven Prerequisites\n@scenarioTag2\n@featureTag\nScenario: Simple scenario 2\nThen Test\n");
});

test("compile scenario outline", async () => {
    await compile({
        specs: ["./test/scenarioOutline.feature"],
        outDir: TEMP_FOLDER
    });

    const fileContent = await Promise.all((await fs.readdir(TEMP_FOLDER)).map(file => fs.readFile(path.resolve(TEMP_FOLDER + "/" + file), "utf-8")));
    expect(fileContent.length).toBe(4);
    expect(fileContent[0]).toBe("@featureTag\nFeature: ScenarioOutline\nBackground: \nGiven Prerequisites\n@scenarioOutlineTag1\n@featureTag\nScenario Outline: Outline Scenario 1\nThen Test \"<example>\"\nExamples:\n|example|\n|example1|\n");
    expect(fileContent[1]).toBe("@featureTag\nFeature: ScenarioOutline\nBackground: \nGiven Prerequisites\n@scenarioOutlineTag1\n@featureTag\nScenario Outline: Outline Scenario 1\nThen Test \"<example>\"\nExamples:\n|example|\n|example2|\n");
    expect(fileContent[2]).toBe("@featureTag\nFeature: ScenarioOutline\nBackground: \nGiven Prerequisites\n@scenarioOutlineTag2\n@featureTag\nScenario Outline: Outline Scenario 2\nThen Test \"<example>\"\nExamples:\n|example|\n|example1|\n");
    expect(fileContent[3]).toBe("@featureTag\nFeature: ScenarioOutline\nBackground: \nGiven Prerequisites\n@scenarioOutlineTag2\n@featureTag\nScenario Outline: Outline Scenario 2\nThen Test \"<example>\"\nExamples:\n|example|\n|example2|\n");
});

test("compile scenario with tag expression", async () => {
    await compile({
        specs: ["./test/scenario.feature"],
        outDir: TEMP_FOLDER,
        tagExpression: "@scenarioTag1"
    });

    const fileContent = await Promise.all((await fs.readdir(TEMP_FOLDER)).map(file => fs.readFile(path.resolve(TEMP_FOLDER + "/" + file), "utf-8")));
    expect(fileContent.length).toBe(1);
    expect(fileContent[0]).toBe("@featureTag\nFeature: Scenario\nBackground: \nGiven Prerequisites\n@scenarioTag1\n@featureTag\nScenario: Simple scenario 1\nThen Test\n");
});

test("compile scenario outline with tag expression", async () => {
    await compile({
        specs: ["./test/scenarioOutline.feature"],
        outDir: TEMP_FOLDER,
        tagExpression: "@scenarioOutlineTag1"
    });

    const fileContent = await Promise.all((await fs.readdir(TEMP_FOLDER)).map(file => fs.readFile(path.resolve(TEMP_FOLDER + "/" + file), "utf-8")));
    expect(fileContent.length).toBe(2);
    expect(fileContent[0]).toBe("@featureTag\nFeature: ScenarioOutline\nBackground: \nGiven Prerequisites\n@scenarioOutlineTag1\n@featureTag\nScenario Outline: Outline Scenario 1\nThen Test \"<example>\"\nExamples:\n|example|\n|example1|\n");
    expect(fileContent[1]).toBe("@featureTag\nFeature: ScenarioOutline\nBackground: \nGiven Prerequisites\n@scenarioOutlineTag1\n@featureTag\nScenario Outline: Outline Scenario 1\nThen Test \"<example>\"\nExamples:\n|example|\n|example2|\n");
});

test("compile scenario with data table", async () => {
    await compile({
        specs: ["./test/scenarioDataTables.feature"],
        outDir: TEMP_FOLDER,
        tagExpression: "@scenarioDataTableTag1 or @scenarioDataTableTag2"
    });

    const fileContent = await Promise.all((await fs.readdir(TEMP_FOLDER)).map(file => fs.readFile(path.resolve(TEMP_FOLDER + "/" + file), "utf-8")));
    expect(fileContent.length).toBe(2);
    expect(fileContent[0]).toBe("@featureTag\nFeature: Scenario Datatables\nBackground: \nGiven Prerequisites\n@scenarioDataTableTag1\n@featureTag\nScenario: Scenario data table 1\nThen TestDataTable\n|data1|data2|\n");
    expect(fileContent[1]).toBe("@featureTag\nFeature: Scenario Datatables\nBackground: \nGiven Prerequisites\n@scenarioDataTableTag2\n@featureTag\nScenario: Scenario data table 2\nThen TestDataTable\n|data1|data2|\n");
});

test("compile scenario with multiline text", async () => {
    await compile({
        specs: ["./test/scenarioMultilineText.feature"],
        outDir: TEMP_FOLDER,
        tagExpression: "@scenarioMultilineTag1 or @scenarioMultilineTag2"
    });

    const fileContent = await Promise.all((await fs.readdir(TEMP_FOLDER)).map(file => fs.readFile(path.resolve(TEMP_FOLDER + "/" + file), "utf-8")));
    expect(fileContent.length).toBe(2);
    expect(fileContent[0]).toBe("@featureTag\nFeature: Scenario Multiline\nBackground: \nGiven Prerequisites\n@scenarioMultilineTag1\n@featureTag\nScenario: Scenario multiline 1\nThen TestMultiline\n\"\"\"\nMultiline\nText\n\"\"\"\n");
    expect(fileContent[1]).toBe("@featureTag\nFeature: Scenario Multiline\nBackground: \nGiven Prerequisites\n@scenarioMultilineTag2\n@featureTag\nScenario: Scenario multiline 2\nThen TestMultiline\n\"\"\"\nMultiline\nText\n\"\"\"\n");
});

test("compile scenario on other supported language", async () => {
    await compile({
        specs: ["./test/otherLangScenario.feature"],
        outDir: TEMP_FOLDER,
        lang: "uk"
    });

    const fileContent = await Promise.all((await fs.readdir(TEMP_FOLDER)).map(file => fs.readFile(path.resolve(TEMP_FOLDER + "/" + file), "utf-8")));
    expect(fileContent.length).toBe(1);
    expect(fileContent[0]).toBe("@featureTag\nFeature: Функція Користувача\nПередумова: \nНехай Prerequisites\n@scenarioTag\n@featureTag\nСценарій: Simple scenario\nТоді Test\n");
});

test("compile scenario outline with splitScenarioOutlines = false", async () => {
    await compile({
        specs: ["./test/scenarioOutline.feature"],
        outDir: TEMP_FOLDER,
        splitScenarioOutlines: false
    });

    const fileContent = await Promise.all((await fs.readdir(TEMP_FOLDER)).map(file => fs.readFile(path.resolve(TEMP_FOLDER + "/" + file), "utf-8")));
    expect(fileContent.length).toBe(2);
    expect(fileContent[0]).toBe("@featureTag\nFeature: ScenarioOutline\nBackground: \nGiven Prerequisites\n@scenarioOutlineTag1\n@featureTag\nScenario Outline: Outline Scenario 1\nThen Test \"<example>\"\nExamples:\n|example|\n|example1|\n|example2|\n");
    expect(fileContent[1]).toBe("@featureTag\nFeature: ScenarioOutline\nBackground: \nGiven Prerequisites\n@scenarioOutlineTag2\n@featureTag\nScenario Outline: Outline Scenario 2\nThen Test \"<example>\"\nExamples:\n|example|\n|example1|\n|example2|\n");
});

test("escape special chars in names", async () => {
    await compile({
        specs: ["./test/scenarioSpecialChars.feature"],
        outDir: TEMP_FOLDER
    });

    const fileNames = await fs.readdir(TEMP_FOLDER);
    expect(fileNames[0]).toMatch(/^Scenario_with_special_______________________chars_123\.\d+\.feature$/)
});
