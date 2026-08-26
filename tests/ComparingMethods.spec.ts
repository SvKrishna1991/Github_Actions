import { expect, test } from '@playwright/test';

test('captures featured product titles', async ({ page }) => {
	await page.goto('https://demowebshop.tricentis.com/');

	const featuredProducts = page.locator('.product-grid .product-item');
	await expect(featuredProducts).toHaveCount(6);

	const productTitles = (await featuredProducts
		.locator('.product-title')
		.allTextContents())
		.map((title) => title.trim());
	const expectedTitles = [
		'$25 Virtual Gift Card',
		'14.1-inch Laptop',
		'Build your own cheap computer',
		'Build your own computer',
		'Build your own expensive computer',
		'Simple Computer',
	];

	console.log('Featured product titles:', productTitles);
	await expect(productTitles).toEqual(expectedTitles);
});