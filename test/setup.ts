// Mock Buffer for Jest
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

// Mock TextEncoder/TextDecoder for Jest
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Load environment variables from .env
require('dotenv').config();

// SAFETY CHECK: Do not use the main database for E2E tests because they TRUNCATE tables!
const dbUrl = process.env.DATABASE_URL || '';
const testDbUrl = process.env.TEST_DATABASE_URL || '';

const isLiveDb = dbUrl.includes('supabase.com') || testDbUrl.includes('supabase.com');

if (isLiveDb) {
  console.error('❌ FATAL: E2E tests are attempting to run against a live Supabase database!');
  console.error('URL detected:', dbUrl || testDbUrl);
  console.error('For safety, E2E tests are blocked.');
  process.exit(1);
}

const hasTestDb = (testDbUrl && testDbUrl !== 'PLEASE_SET_A_DEDICATED_TEST_DB_URL_HERE') ||
  (dbUrl && dbUrl.includes('localhost:5433'));

if (!hasTestDb) {
  console.error('❌ FATAL: TEST_DATABASE_URL is not configured correctly.');
  console.error('Please ensure your .env.test points to the local Docker database (port 5433).');
  process.exit(1);
}

process.env.DATABASE_URL = testDbUrl || dbUrl;

// Set up mock environment variables for e2e tests (only if not found in .env)
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock.supabase.co';
process.env.SUPABASE_KEY = process.env.SUPABASE_KEY || 'mock-key';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'mock-jwt-secret';

// Increase Jest timeout for E2E since external DB calls can be slow
jest.setTimeout(60000); // 60s for remote DBs