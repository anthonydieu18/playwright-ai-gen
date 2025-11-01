import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Feature', () => {
  test('User can navigate to the product listing page', async ({ page }) => {
    // Given: I am on the home page
    await page.goto('/home');
    // When: I click on the products link
    await page.click('a[href*="products"]');
    // Given: I should be navigated to the product listing page
    await page.goto('/products');
    // Then: I should see a list of products
    await expect(page.locator('.product-list, .cart-items')).toBeVisible();
  });

  test('User can add a product to the shopping cart', async ({ page }) => {
    // Given: I am on the product page for "Test Product"
    await page.goto('/products');
    // When: I click the "Add to Cart" button
    await page.click('button:has-text("Add to Cart")');
    // Then: I should see a success message "Product added to cart"
    await expect(page.locator('.message')).toContainText("Product added to cart");
    // Then: The cart count should increase by 1
    const cartCount = await page.locator('.cart-count').textContent();
    await expect(parseInt(cartCount || '0')).toBeGreaterThan(0);
  });

  test('User sees an error message when adding an out-of-stock item', async ({ page }) => {
    // Given: I am on the product page for "Out of Stock Product"
    await page.goto('/products');
    // When: I click the "Add to Cart" button
    await page.click('button:has-text("Add to Cart")');
    // Then: I should see an error message "This item is out of stock"
    await expect(page.locator('.message')).toContainText("This item is out of stock");
    // Then: The item should not be added to my cart
    await expect(page.locator('.cart-count')).not.toContainText(/[1-9]/);
  });

  test('User can view items in the shopping cart', async ({ page }) => {
    // Given: I have items in my shopping cart
    // Setup: Add items to cart
    await page.goto('/products');
    await page.click('button.add-to-cart:first-of-type');
    // Given: I navigate to the cart page
    await page.goto('/cart');
    // Then: I should see all items in my cart
    await expect(page.locator('.product-list, .cart-items')).toBeVisible();
    // Then: I should see the total price
    await expect(page.locator('.total-price')).toBeVisible();
  });

  test('User can remove items from the shopping cart', async ({ page }) => {
    // Given: I am on the cart page
    await page.goto('/cart');
    // Given: I have "Test Product" in my cart
    // Setup: Add item to cart
    await page.goto('/products');
    await page.click(`button[data-product=${"Test Product"}]`);
    // When: I click the remove button for "Test Product"
    await page.click('button:has-text("Test Product")');
    // Then: The item should be removed from the cart
    await expect(page.locator('.cart-item')).not.toBeVisible();
    // Then: The cart count should decrease by 1
    await expect(page.locator('.cart-count')).toBeVisible();
  });

});
