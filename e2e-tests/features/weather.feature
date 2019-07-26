@weather
Feature: RoboDomo Weather page
    As a User
    I want to see Weather page
    So that I can see all Weather widgets

    @S1 @automated
    Scenario Outline: Nest tabs
        Given User navigates to Weather page
        Then User is redirected to Weather page
        Then Weather menu shall be selected
        When User clicks on <tabName> tab on Weather page
        Then Weather <tabName> tab is loaded
        @smoke
        Examples:
            | tabName       |
            | San Diego, CA |
        Examples:
            | tabName       |
            | New York, NY  |
