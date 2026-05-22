/**
 * Mock the fetch response and returns an Array of the mock meme data
 * 
 * Use node --test /js/api/test_imgflip-api.js to test
 */

import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { getMemes } from './imgflip-api.js';

describe('getMemes API Module', () => {
  
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('should parse an ImgFlip response and return an array of meme templates', async () => {
    
    const mockApiResponse = {
      success: true,
      data: {
        memes: [
          { id: "61579", name: "One Does Not Simply", url: "https://i.imgflip.com/1bij.jpg", box_count: 2 }
        ]
      }
    };

    globalThis.fetch = async () => {
      let responseObj = {
        ok: true,
        json: async () => {
          return mockApiResponse;
        }
      };
      return responseObj;
    };

    
    const result = await getMemes('image');


    assert.strictEqual(Array.isArray(result), true); //checks if all memes are in the array
    assert.strictEqual(result.length, 1); // should only be the 1 mock meme
    assert.strictEqual(result[0].name, 'One Does Not Simply'); //correct meme name
  });

  test('error if the network response status code is bad', async () => {
   
    globalThis.fetch = async () => {
      let responseObj = {
        ok: false,
        status: 500
      };
      return responseObj;
    };

    
    await assert.rejects(
      async () => {
        await getMemes('image');
      },
      (error) => {
        assert.strictEqual(error.message, 'HTTP error! Status: 500');
        return true;
      }
    );
  });
});