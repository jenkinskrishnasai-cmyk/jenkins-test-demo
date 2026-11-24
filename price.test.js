const { addVat } = require('./price');

test('adds 18% VAT', () => {
  expect(addVat(100, 0.18)).toBe(118);
});

test('keeps zero at zero', () => {
  expect(addVat(0, 0.18)).toBe(0);
});

test('rounds to 2 decimals', () => {
  expect(addVat(9.99, 0.18)).toBe(11.79);
});
