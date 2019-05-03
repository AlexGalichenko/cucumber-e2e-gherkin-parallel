@featureTag
Feature: Scenario Datatables

  Background:
    Given Prerequisites

  @scenarioDataTableTag1
  Scenario: Scenario data table 1
    Then TestDataTable
      |data1|data2|

  @scenarioDataTableTag2
  Scenario: Scenario data table 2
    Then TestDataTable
      |data1|data2|
