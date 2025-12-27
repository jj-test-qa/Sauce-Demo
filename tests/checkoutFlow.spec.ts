import {test, expect} from '@playwright/test'
import { CheckoutFlow } from '../flows/checkout.flow';

test("Complete checkout with flow", async ({ page }) => {
  const flow = new CheckoutFlow(page);

  await flow.addItemsAndCheckout(
    {
        username: "standard_user",
        password: "secret_sauce"
    },
    ["Sauce Labs Backpack", "Sauce Labs Bike Light"],
    {
      firstName: "John",
      lastName: "Doe",
      zipCode: 12345,
    }
  );

  await expect(page.locator(".complete-header"))
    .toHaveText("Thank you for your order!");
});