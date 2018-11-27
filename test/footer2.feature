@featureTag
Feature: Footer

  Background:
    Given Prerequisites

  @scenarioTag
  Scenario: Simple scenario
    Then Element "Element" should be clickable

  @scenarioOutlineTag
  Scenario Outline: Outline Scenario
    Then Element "<element>" should be clickable

    Examples:
      | element  |
      | Element1 |
      | Element2 |
      | Element3 |