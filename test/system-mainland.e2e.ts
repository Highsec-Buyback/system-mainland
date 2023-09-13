
import { test } from "vitest";
import axios from "axios";

const {URL} = process.env;

if (!URL) {
    throw Error(`Environment variable URL is missing.`);
}

const client = axios.create({
    baseURL: URL,
})

async function isMainland(systemName: string): Promise<boolean> {
    const {isMainland} = (await client.get(`/mainland?systemName=${systemName}`)).data;
    return isMainland;
}

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
