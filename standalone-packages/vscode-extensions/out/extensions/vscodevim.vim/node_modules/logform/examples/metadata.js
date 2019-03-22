const { format } = require('../');
const { combine, json, metadata, timestamp } = format;

// Default Functionality (no options passed)
const defaultFormatter = combine(
  timestamp(),
  metadata(),
  json()
);

const defaultMessage = defaultFormatter.transform({
  level: 'info',
  message: 'This should be a message.',
  application: 'Microsoft Office',
  store: 'Big Box Store',
  purchaseAmount: '9.99'
});

console.dir(defaultMessage);


// Fill all keys into metadata except those provided
const formattedLogger = combine(
  timestamp(),
  metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  json()
);

const fillExceptMessage = formattedLogger.transform({
  level: 'info',
  message: 'This should have attached metadata',
  category: 'movies',
  subCategory: 'action'
});

console.dir(fillExceptMessage);


// Fill only the keys provided into the object, and also give it a different key
const customMetadataLogger = combine(
  timestamp(),
  metadata({ fillWith: ['publisher', 'author', 'book'], key: 'bookInfo' }),
  json()
);

const fillWithMessage = customMetadataLogger.transform({
  level: 'debug',
  message: 'This message should be outside of the bookInfo object',
  publisher: 'Lorem Press',
  author: 'Albert Einstein',
  book: '4D Chess for Dummies',
  label: 'myCustomLabel'
});

console.dir(fillWithMessage);

// Demonstrates Metadata 'chaining' to combine multiple datapoints.
const chainedMetadata = combine(
  timestamp(),
  metadata({ fillWith: ['publisher', 'author', 'book'], key: 'bookInfo' }),
  metadata({ fillWith: ['purchasePrice', 'purchaseDate', 'transactionId'], key: 'transactionInfo' }),
  metadata({ fillExcept: ['level', 'message', 'label', 'timestamp'] }),
  json()
);

const chainedMessage = chainedMetadata.transform({
  level: 'debug',
  message: 'This message should be outside of the bookInfo object',
  publisher: 'Lorem Press',
  author: 'Albert Einstein',
  book: '4D Chess for Dummies',
  label: 'myCustomLabel',
  purchasePrice: '9.99',
  purchaseDate: '2.10.2018',
  transactionId: '123ABC'
});

console.dir(chainedMessage);
