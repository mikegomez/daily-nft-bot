const test = require('node:test');
const assert = require('node:assert/strict');
const { createImageSeed } = require('../lib/image_seed');

test('createImageSeed produces unique values for different inputs', () => {
  const first = createImageSeed({ date: '2026-07-01', frameNumber: 0, style: 0, salt: 'a' });
  const second = createImageSeed({ date: '2026-07-01', frameNumber: 0, style: 0, salt: 'b' });
  const third = createImageSeed({ date: '2026-07-02', frameNumber: 0, style: 0, salt: 'a' });

  assert.notEqual(first, second);
  assert.notEqual(first, third);
});

test('createImageSeed can generate a fresh random value for repeated inputs', () => {
  const first = createImageSeed({ date: '2026-07-01', frameNumber: 0, style: 0, salt: 'same', randomize: true });
  const second = createImageSeed({ date: '2026-07-01', frameNumber: 0, style: 0, salt: 'same', randomize: true });

  assert.notEqual(first, second);
});
