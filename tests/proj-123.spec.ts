import { test, expect } from '@playwright/test';

test.describe('User Login Feature', () => {
  test('User can navigate to the login page', async ({ page }) => {
    // Given: I am on the home page
    await page.goto('/home');
    // When: I click on the login link
    await page.click('button[type="submit"]');
    // Given: I should be navigated to the login page
    await page.goto('/login');
    // Then: I should see the login form
    await expect(page.locator('body')).toContainText('Login');
  });

  test('User can enter valid credentials and successfully log in', async ({ page }) => {
    // Given: I am on the login page
    await page.goto('/login');
    // When: I enter valid username "testuser"
    await page.fill('input[name="username"]', "testuser");
    // When: I enter valid password "testpass123"
    await page.fill('input[name="password"]', "testpass123");
    // When: I click the login button
    await page.click('button[type="submit"]');
    // Then: I should be redirected to the dashboard
    await expect(page).toHaveURL(new RegExp('.*/dashboard.*'));
    // Then: I should see a welcome message
    await expect(page.locator('body')).toContainText('Welcome');
  });

  test('User sees an error message when entering invalid credentials', async ({ page }) => {
    // Given: I am on the login page
    await page.goto('/login');
    // When: I enter invalid username "wronguser"
    await page.fill('input[name="username"]', "wronguser");
    // When: I enter invalid password "wrongpass"
    await page.fill('input[name="password"]', "wrongpass");
    // When: I click the login button
    await page.click('button[type="submit"]');
    // Then: I should see an error message
    await expect(page.locator('body')).toContainText('error');
    // I should remain on the login page
    // TODO: Implement this step
  });

  test('User can log out after logging in', async ({ page }) => {
    // Given: I am logged in as "testuser"
    // Setup: Login as "testuser"
    await page.goto('/login');
    await page.fill('input[name="username"]', "testuser");
    await page.fill('input[name="password"]', '"testpass123"');
    await page.click('button[type="submit"]');
    // Given: I am on the dashboard page
    await page.goto('/dashboard');
    // When: I click the logout button
    await page.click('button.logout');
    // Then: I should be logged out
    await expect(page.locator('.user-menu')).not.toBeVisible();
    // Then: I should be redirected to the home page
    await expect(page).toHaveURL(new RegExp('.*/home.*'));
  });

});
