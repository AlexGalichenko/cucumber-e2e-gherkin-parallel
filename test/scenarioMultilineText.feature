@featureTag
Feature: Scenario Multiline

  Background:
    Given Prerequisites

  @scenarioMultilineTag1
  Scenario: Scenario multiline 1
    Then TestMultiline
      """
      Multiline
      Text
      """

  @scenarioMultilineTag2
  Scenario: Scenario multiline 2
    Then TestMultiline
      """
      Multiline
      Text
      """
