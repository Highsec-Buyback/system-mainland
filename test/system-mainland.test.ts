
import { test } from "vitest";

import { isMainland } from '../src/lib/red-frog';

test('isMainland should return false for GE-8JV', async ({ expect }) => {
    const result = await isMainland('GE-8JV');
    expect(result).toBe(false);
});

test('isMainland should return true for Amarr', async ({ expect }) => {
    const result = await isMainland('Amarr');
    expect(result).toBe(true);
});

test('isMainland should return false for Yvelet', async ({ expect }) => {
    const result = await isMainland('Yvelet');
    expect(result).toBe(false);
});
