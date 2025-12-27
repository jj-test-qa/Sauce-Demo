import { Page } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutStepOne } from "../pages/checkoutStepOne.page";
import { CheckoutStepTwo } from "../pages/checkoutStepTwo.page";
//import { CheckoutComplete } from "../pages/checkoutComplete.page";



/*

  1️⃣ CheckoutFlow abstraction (used correctly)
  ❌ What CheckoutFlow should NOT be

  Not a page object

  Not hiding assertions

  Not duplicating page logic

  ✅ What CheckoutFlow IS

  A thin orchestration layer

  Calls page objects in sequence

  Returns control back to the test

  Think of it as a scripted journey, not a UI wrapper.

*/

export class CheckoutFlow {
    constructor(private page: Page) { }

    async addItemsAndCheckout(
        login: {
            username: string,
            password: string
        },
        items: string[],
        user: {
            firstName: string;
            lastName: string;
            zipCode: number;
        }
    ):Promise<void> {
        const signIn = new LoginPage(this.page);
        const inventory = new InventoryPage(this.page);
        const cart = new CartPage(this.page);
        const info = new CheckoutStepOne(this.page);
        const overview = new CheckoutStepTwo(this.page);
        //const checkoutComplete = new CheckoutComplete(this.page);

        await signIn.goto();
        await signIn.login(login.username, login.password);

        for (const item of items) {
            await inventory.addToCart(item);
        }

        await inventory.goToCart();
        await cart.checkOut();

        await info.enterAddress(user);
        await info.continue();
        await overview.finish();
    }
}


/*

test("Complete checkout with flow", async ({ page }) => {
  const flow = new CheckoutFlow(page);

  await flow.addItemsAndCheckout(
    ["Sauce Labs Backpack", "Sauce Labs Bike Light"],
    {
      firstName: "John",
      lastName: "Doe",
      postalCode: "12345",
    }
  );

  await expect(page.locator(".complete-header"))
    .toHaveText("Thank you for your order!");
});


*/