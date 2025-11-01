Feature: User Login Feature

  Scenario 1: User can navigate to the login page
    Given I am on the home page
    When I click on the login link
    Then I should be navigated to the login page
    Then I should see the login form

  Scenario 2: User can enter valid credentials and successfully log in
    Given I am on the login page
    When I enter valid username "testuser"
    When I enter valid password "testpass123"
    When I click the login button
    Then I should be redirected to the dashboard
    Then I should see a welcome message

  Scenario 3: User sees an error message when entering invalid credentials
    Given I am on the login page
    When I enter invalid username "wronguser"
    When I enter invalid password "wrongpass"
    When I click the login button
    Then I should see an error message
    Then I should remain on the login page

  Scenario 4: User can log out after logging in
    Given I am logged in as "testuser"
    Given I am on the dashboard page
    When I click the logout button
    Then I should be logged out
    Then I should be redirected to the home page

