@featureTag
Feature: ScenarioOutline

  Background:
    Given Prerequisites

  @scenarioOutlineTag1
  Scenario Outline: Outline Scenario 1
    Then Test "<example>"

    Examples:
      | example  |
      | example1 |
      | example2 |

  @scenarioOutlineTag2
  Scenario Outline: Outline Scenario 2
    Then Test "<example>"

    Examples:
      | example  |
      | example1 |
      | example2 |