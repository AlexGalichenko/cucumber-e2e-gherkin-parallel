const fs = require("fs-extra");
const util = require("util");
const path = require("path");
const compile = require('../src/compile');

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