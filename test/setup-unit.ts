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

// Unit tests use mocked providers and should never talk to a real database.
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.DATABASE_URL = 'postgresql://unit:unit@127.0.0.1:59999/pawpromise_unit_tests';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'unit-test-jwt-secret';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock.supabase.co';
process.env.SUPABASE_KEY = process.env.SUPABASE_KEY || 'mock-key';

jest.setTimeout(30000);
