import fetch from 'fetch-vcr';

fetch.configure({
  fixturePath: process.cwd() + '/_fixtures',
  mode: 'cache', //   <-- This is optional
});
