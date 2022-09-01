import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: 'beerdiary',
  apiKey: process.env.API_KEY || '',
});