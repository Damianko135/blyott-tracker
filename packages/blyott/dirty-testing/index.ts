// THIS IS NOT PRODUCTION READY CODE. THIS IS A PROOF OF CONCEPT TO TEST THE IDEA OF A "DIRTY TESTING" APPROACH TO TESTING. THIS CODE IS NOT MEANT TO BE USED IN PRODUCTION AND SHOULD NOT BE USED AS A BASIS FOR ANY PRODUCTION CODE. THIS CODE IS MEANT TO BE USED AS A PROOF OF CONCEPT TO TEST THE IDEA OF A "DIRTY TESTING" APPROACH TO TESTING. THIS CODE IS NOT MEANT TO BE USED IN PRODUCTION AND SHOULD NOT BE USED AS A BASIS FOR ANY PRODUCTION CODE.

// This is a dirty testing module for Blyott Tracker
// This module is meant to be used for testing purposes only and should NEVER be used in production.


import { Auth } from '../src/auth'; // Import the Auth class from the src directory
import { env } from 'node:process';

const ENV_FILE_PATH = '../../../.env'; // Path to the .env file

// Load environment variables from the .env file
import { config } from 'dotenv';
config({ path: ENV_FILE_PATH });

// Create an instance of the Auth class for testing
const auth = new Auth();

const USERNAME = env.TEST_USERNAME!
const PASSWORD = env.TEST_PASSWORD!

console.log('Starting dirty testing for Auth module...');
console.log('Using test credentials from .env file: Username:', USERNAME, 'Password:', '********');

// Login with test credentials (these should be replaced with valid test credentials)
auth.login(USERNAME, PASSWORD)
    .then(() => {
        console.log('Login successful');
        // Get the token after successful login
        const token = auth.getToken();
        console.log('Retrieved token:', token);
    }
    ).catch((error) => {
        console.error('Login failed:', error.message);
    }
    );