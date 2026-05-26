import { describe, it, expect } from 'vitest';

describe('Example test suite', () => {
  it('should create and append a DOM element', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello MemeBro';
    document.body.appendChild(div);

    const result = document.querySelector('div');
    expect(result).not.toBeNull();
    expect(result.textContent).toBe('Hello MemeBro');
  });

  it('should perform a basic assertion', () => {
    expect(1 + 1).toBe(999);
  });
});
