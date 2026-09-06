import { expect, test } from '@playwright/test';

test('pagination test', async ({ page }) => {
	await page.goto('https://datatables.net/');

	const table = page.getByRole('table').first();
	const tableInfo = page.getByText(/Showing \d+ to \d+ of \d+ staff members/);
	await expect(tableInfo).toBeVisible();
	await expect(tableInfo).not.toHaveText(/Showing 0 to 0 of 0 staff members/);

	const tableHeaders = await table
		.getByRole('rowgroup')
		.nth(2)
		.getByRole('columnheader')
		.allTextContents();
	const dataHeaders = tableHeaders.map((header) => header.trim()).filter(Boolean);
	expect(dataHeaders).toEqual([
		'Name',
		'Position',
		'Office',
		'Extn.',
		'Start date',
		'Salary',
	]);

	const collectedRows: string[][] = [];
	const body = table.getByRole('rowgroup').nth(1);
	const nextPage = page
		.getByRole('navigation', { name: 'pagination' })
		.getByRole('link', { name: 'Next', exact: true });

	while (true) {
		const rows = body.getByRole('row');
		const rowCount = await rows.count();
		expect(rowCount).toBeGreaterThan(0);

		for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
			const row = rows.nth(rowIndex);
			const cells = (await row.getByRole('cell').filter({ hasText: /\S/ }).allTextContents()).map((cell) => cell.trim());

			expect(cells).toHaveLength(dataHeaders.length);
			expect(cells.every((cell) => cell.length > 0)).toBeTruthy();
			collectedRows.push(cells);
		}

		if (await nextPage.isDisabled()) {
			break;
		}

		const currentPageInfo = await tableInfo.textContent();
		await nextPage.click();
		await expect(tableInfo).not.toHaveText(currentPageInfo ?? '');
	}

	const totalRows = Number((await tableInfo.textContent())?.match(/of (\d+) staff members/)?.[1]);

	expect(totalRows).toBeGreaterThan(0);
	expect(collectedRows).toHaveLength(totalRows);
	expect(new Set(collectedRows.map(([name]) => name)).size).toBe(collectedRows.length);

})