import { test, expect, Locator } from "@playwright/test"
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";
import { carts } from "../data/carts.data";
import { address } from "../data/address.data";
import { CheckoutStepOne } from "../pages/checkoutStepOne.page";


test.describe("Checkout Step One", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/inventory.html");
        await expect(page).toHaveURL("/inventory.html");
    });


    test("@smoke Validate going back to Cart Page", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addToCart("Sauce Labs Backpack");
        await inventoryPage.goToCart();
        await expect(page).toHaveURL("/cart.html");

        const cartPage = new CartPage(page);
        await cartPage.checkOut();
        await expect(page).toHaveURL("/checkout-step-one.html");

        const checkoutStepOnePage = new CheckoutStepOne(page);
        await checkoutStepOnePage.cancel();
        await expect(page).toHaveURL("/cart.html");
    })

    test("@smoke Validate going to the second checkout page without entering your information", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addToCart("Sauce Labs Backpack");
        await inventoryPage.goToCart();
        await expect(page).toHaveURL("/cart.html");

        const cartPage = new CartPage(page);
        await cartPage.checkOut();
        await expect(page).toHaveURL("/checkout-step-one.html");

        const checkoutStepOnePage = new CheckoutStepOne(page);
        await checkoutStepOnePage.continue();
        expect(await checkoutStepOnePage.getErrorMessage().textContent()).toContain("Error: First Name is required")
        await expect(page).toHaveURL("/checkout-step-one.html");
    })

    for (const cart of carts) {
        test(`@smoke Checkout-Step-One Page: Validate Carts [${cart.map(el => el.name).join(", ")}]`, async ({ page }) => {
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
        })
    }
})