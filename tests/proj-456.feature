Feature: Shopping Cart Feature

  Scenario 1: User can navigate to the product listing page
    Given I am on the home page
    When I click on the products link
    Then I should be navigated to the product listing page
    Then I should see a list of products

  Scenario 2: User can add a product to the shopping cart
    Given I am on the product page for "Test Product"
    When I click the "Add to Cart" button
    Then I should see a success message "Product added to cart"
    Then The cart count should increase by 1

  Scenario 3: User sees an error message when adding an out-of-stock item
    Given I am on the product page for "Out of Stock Product"
    When I click the "Add to Cart" button
    Then I should see an error message "This item is out of stock"
    Then The item should not be added to my cart

  Scenario 4: User can view items in the shopping cart
    Given I have items in my shopping cart
    When I navigate to the cart page
    Then I should see all items in my cart
    Then I should see the total price

  Scenario 5: User can remove items from the shopping cart
    Given I am on the cart page
    Given I have "Test Product" in my cart
    When I click the remove button for "Test Product"
    Then The item should be removed from the cart
    Then The cart count should decrease by 1

