/**
 * Capitalizes the first letter of a string (e.g., for book titles).
 * @param {string} str - The input string.
 * @returns {string} - The capitalized string.
 */
function capitalize(str) {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Checks if a string is a valid email address.
 * @param {string} email - The email string to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates an ISBN-10 or ISBN-13 (basic check for bookstore use).
 * @param {string} isbn - The ISBN string.
 * @returns {boolean} - True if valid format, false otherwise.
 */
function isValidISBN(isbn) {
  const isbn10Regex = /^\d{9}[\dX]$/;
  const isbn13Regex = /^\d{13}$/;
  return isbn10Regex.test(isbn) || isbn13Regex.test(isbn);
}

/**
 * Calculates discounted price for a book.
 * @param {number} originalPrice - Original price.
 * @param {number} discountPercent - Discount percentage (e.g., 20 for 20%).
 * @returns {number} - Discounted price (rounded to 2 decimals).
 */
function calculateDiscountedPrice(originalPrice, discountPercent) {
  if (typeof originalPrice !== 'number' || typeof discountPercent !== 'number') return 0;
  const discount = (originalPrice * discountPercent) / 100;
  return Math.round((originalPrice - discount) * 100) / 100;
}

/**
 * Formats a book title (capitalizes and trims).
 * @param {string} title - The book title.
 * @returns {string} - Formatted title.
 */
function formatBookTitle(title) {
  return capitalize(title.trim());
}

/**
 * Generates a random integer between min and max (e.g., for order IDs).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - A random integer.
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formats a date to a readable string (e.g., for order dates).
 * @param {Date|string} date - The date to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Removes duplicates from an array (e.g., for unique book genres).
 * @param {Array} arr - The input array.
 * @returns {Array} - The array with duplicates removed.
 */
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

/**
 * Deep clones an object (useful for copying book objects or user data).
 * @param {*} obj - The object to clone.
 * @returns {*} - The cloned object.
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(deepClone);
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

module.exports = {
  capitalize,
  isValidEmail,
  isValidISBN,
  calculateDiscountedPrice,
  formatBookTitle,
  randomInt,
  formatDate,
  removeDuplicates,
  deepClone,
};