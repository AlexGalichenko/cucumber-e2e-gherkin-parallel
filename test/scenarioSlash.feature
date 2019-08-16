@featureTag
Feature: Scenario Slash

  Background:
    Given Prerequisites

  @scenarioTag1
  Scenario: Simple \nest scenario 1
    Then Test

  @scenarioTag2
  Scenario: Simple scenario 2
    Then Tes\n

  @scenarioOutlineTag1
  Scenario Outline: Outline Scenario 3
    Then Test "<example>"

    Examples:
      | example       |
      | example \nest |
