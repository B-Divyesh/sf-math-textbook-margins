import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static deployment response policy', () => {
  it('blocks framing and restricts executable content to this origin', () => {
    const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8'));
    const headers = config.globalHeaders as Record<string, string>;

    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
    expect(headers['Content-Security-Policy']).toContain("script-src 'self'");
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(headers['Content-Security-Policy']).toContain("object-src 'none'");
  });
});
