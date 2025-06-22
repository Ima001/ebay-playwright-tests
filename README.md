# eBay Related Products Playwright Test Suite

This project is an automated UI test suite using [Playwright](https://playwright.dev/) to validate the "Related Best Sellers" feature on an eBay product page.

---

 Overview

The test suite covers functional, UI, and edge case validations for related product suggestions shown below a selected eBay product.

 Tested Product:
[Mens RFID Blocking Leather Wallet Credit Card ID Holder](https://www.ebay.com/itm/364748865269)

---

 Test Cases

| TC ID  | Description                                               | Type       |
|--------|-----------------------------------------------------------|------------|
| TC01   | Verify related section is visible                         | Positive   |
| TC02   | Validate maximum of 6 related products                    | Boundary   |
| TC03   | Ensure all related products belong to same category       | Functional |
| TC04   | Validate related product prices are within$5 to $10       | Functional |
| TC05   | Related products show image, title, and price             | UI         |
| TC06   | Less than 6 related items appear                          | Edge       |
| TC07   | No related section for unsupported products               | Negative   |
| TC08   | Refresh preserves related product order                   | Functional |
| TC09   | Responsive layout on mobile                               | UI         |
| TC10   | Invalid product shows fallback/error                      | Negative   |


---
