import '@testing-library/jest-dom';

// Базовые полифиллы
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Простые моки
window.scrollTo = jest.fn();

// Базовая настройка
beforeEach(() => {
  jest.clearAllMocks();
});