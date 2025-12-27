import { test, expect, Locator } from "@playwright/test"
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";
import { carts } from "../data/carts.data";
import { address } from "../data/address.data";
import { CheckoutStepOne } from "../pages/checkoutStepOne.page";
import { CheckoutStepTwo } from "../pages/checkoutStepTwo.page";
import { CheckoutComplete } from "../pages/checkoutComplete.page";


test.describe("Checkout Complete", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/inventory.html");
        await expect(page).toHaveURL("/inventory.html");
    });


    test("@smoke Validate going back to Inventory Page from Checkout Complete page", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addToCart("Sauce Labs Backpack");
        await inventoryPage.goToCart();
        await expect(page).toHaveURL("/cart.html");

        const cartPage = new CartPage(page);
        await cartPage.checkOut();
        await expect(page).toHaveURL("/checkout-step-one.html");

        const { firstName, lastName, zipCode } = address[0];

        const checkoutStepOnePage = new CheckoutStepOne(page);
        await checkoutStepOnePage.enterAddress(firstName, lastName, zipCode);
        await checkoutStepOnePage.continue();
        await expect(page).toHaveURL("/checkout-step-two.html");

        const checkoutStepTwoPage = new CheckoutStepTwo(page);
        await checkoutStepTwoPage.finish();
        await expect(page).toHaveURL("/checkout-complete.html");

        const checkoutCompletePage = new CheckoutComplete(page);
        await checkoutCompletePage.goBackHome();
        await expect(page).toHaveURL("/inventory.html");
    })

    for (const cart of carts) {
        test(`@regression E2E: Complete Checkout [${cart.map(el => el.name).join(", ")}]`, async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            for (const item of cart)
                await inventoryPage.addToCart(item);
            await inventoryPage.goToCart();

            const items: {}[] = inventoryPage.getItems();
            const itemCount: number = inventoryPage.getCartCount();
            const cartTotal: number = inventoryPage.getCartTotal();

            const cartPage = new CartPage(page);
            await cartPage.checkOut();

            const { firstName, lastName, zipCode } = address[0];

            const checkoutStepOne = new CheckoutStepOne(page);
            await checkoutStepOne.enterAddress(firstName, lastName, zipCode);
            await checkoutStepOne.continue();

            const checkoutStepTwo = new CheckoutStepTwo(page, items, itemCount, cartTotal);

            const cartItems = await checkoutStepTwo.getInventoryItems();

            for (const expectedItem of items) {
                expect(cartItems).toContainEqual(expectedItem)
            }

            await expect(checkoutStepTwo.getShippingMethod()).toHaveText("Free Pony Express Delivery!")

            expect(cartTotal).toEqual(await checkoutStepTwo.sumCartItems())
            await checkoutStepTwo.scrollToTax();
            expect(cartTotal * 0.0800428801).toBeCloseTo(Number((await checkoutStepTwo.getTax().textContent())?.replace("Tax: $", "")) || 0, 2);

            await checkoutStepTwo.finish();

            const checkoutComplete = new CheckoutComplete(page);
            await expect(checkoutComplete.getImage()).toHaveAttribute('alt', 'Pony Express');
            await expect(checkoutComplete.getHeader()).toHaveText('Thank you for your order!');
            await expect(checkoutComplete.getCompleteText()).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
        })
    }
})