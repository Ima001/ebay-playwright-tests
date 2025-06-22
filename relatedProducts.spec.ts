import { test, expect, devices } from '@playwright/test';

const productUrl = 'https://www.ebay.com/itm/364748865269';
const invalidProductUrl = 'https://www.ebay.com/itm/invalid123';
const relatedSectionXPath = '//h2[contains(text(), "Similar items")]/following-sibling::ul[1]';
const relatedItemXPath = `${relatedSectionXPath}/li[contains(@class, "s-item")]`;

// TC01: Verify related section is visible
test('TC01: Verify related section is visible', async ({ page }) => {
  await page.goto(productUrl);
  const section = page.locator(`xpath=${relatedSectionXPath}`);
  await expect(section).toBeVisible();
});

// TC02: Validate max 6 products displayed
test('TC02: Validate max 6 products displayed', async ({ page }) => {
  await page.goto(productUrl);
  const items = page.locator(`xpath=${relatedItemXPath}`);
  const count = await items.count();
  expect(count).toBeLessThanOrEqual(6);
});

// TC03: Validate products are from same category
test('TC03: Validate products are from same category', async ({ page }) => {
  await page.goto(productUrl);
  const categories = await page.locator('xpath=//span[contains(@class, "SECONDARY_INFO")]').allTextContents();
  categories.forEach(cat => expect(cat.toLowerCase()).toContain('men'));
});

// TC04: Validate price range of related products ($5 - $10)
test('TC04: Validate price range of related products ($5 - $10)', async ({ page }) => {
  await page.goto(productUrl);
  const items = page.locator(`xpath=${relatedItemXPath}`);
  const count = await items.count();

  for (let i = 0; i < count; i++) {
    const priceText = await items
      .nth(i)
      .locator('span.ux-textspans:not(.ux-textspans--BOLD)')
      .first()
      .textContent();
    const price = parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0');
    expect(price).toBeGreaterThanOrEqual(5);
    expect(price).toBeLessThanOrEqual(10);
  }
});

// TC05: Validate each related product shows image, title, price
test('TC05: Validate each related product shows image, title, price', async ({ page }) => {
  await page.goto(productUrl);
  const items = page.locator(`xpath=${relatedItemXPath}`);
  const count = await items.count();

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    await expect(item.locator('img')).toBeVisible();
    await expect(item.locator('span.ux-textspans.ux-textspans--BOLD')).toBeVisible(); // title
    await expect(item.locator('span.ux-textspans:not(.ux-textspans--BOLD)')).toBeVisible(); // price
  }
});

// TC06: Fewer than 6 best sellers
test('TC06: Fewer than 6 best sellers', async ({ page }) => {
  await page.goto('https://www.ebay.com/itm/175673743222'); // update with valid product
  const items = page.locator(`xpath=${relatedItemXPath}`);
  const count = await items.count();
  expect(count).toBeLessThan(6);
  expect(count).toBeGreaterThan(0);
});

// TC07: No best sellers available
test('TC07: No best sellers available', async ({ page }) => {
  await page.goto('https://www.ebay.com/itm/166785430280'); // product with no related section
  const section = page.locator(`xpath=${relatedSectionXPath}`);
  expect(await section.count()).toBe(0);
});

// TC08: Refresh page shows same related products
test('TC08: Refresh page shows same related products', async ({ page }) => {
  await page.goto(productUrl);
  const firstItem = await page.locator(`xpath=${relatedItemXPath}[1]`).textContent();
  await page.reload();
  const refreshedItem = await page.locator(`xpath=${relatedItemXPath}[1]`).textContent();
  expect(refreshedItem?.trim()).toBe(firstItem?.trim());
});

// TC09: Responsive layout on mobile view
test.use({ ...devices['iPhone 13'] });
test('TC09: Responsive layout on mobile view', async ({ page }) => {
  await page.goto(productUrl);
  const section = page.locator(`xpath=${relatedSectionXPath}`);
  await expect(section).toBeVisible();
  await expect(page.locator('ul')).toHaveCSS('overflow-x', /auto|scroll/);
});

// TC10: Invalid product ID shows fallback
test('TC10: Invalid product ID shows fallback', async ({ page }) => {
  await page.goto(invalidProductUrl);
  const errorText = page.locator('text=This listing was ended').or(page.locator('text=not found'));
  expect(await errorText.isVisible()).toBeTruthy();
});
