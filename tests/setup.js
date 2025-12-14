// Test setup file
// This file runs before all tests

// Mock DOM if needed
if (typeof window === 'undefined') {
  global.window = {};
}

// Setup test utilities
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
