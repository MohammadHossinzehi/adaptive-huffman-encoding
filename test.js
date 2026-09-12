const { AdaptiveHuffman } = require('./src/adaptive-huffman');

function assert(condition, message) {
  if (!condition) {
    throw new Error('Assertion failed: ' + message);
  }
}

console.log('Testing Adaptive Huffman Encoding...
');

// Test 1: Single character
console.log('Test 1: Single character encoding');
const ahSingle = new AdaptiveHuffman();
const result1 = ahSingle.encode('a');
console.log('  Encoded "a":', result1.binary);
console.log('  Compression ratio:', result1.ratio.toFixed(2));
assert(result1.binary.length > 0, 'Single char should produce output');
console.log('  PASSED
');

// Test 2: Repeated character
console.log('Test 2: Repeated character (compression benefit)');
const ahRepeat = new AdaptiveHuffman();
const result2 = ahRepeat.encode('aaaa');
console.log('  Encoded "aaaa":', result2.binary);
console.log('  Original bits:', result2.originalBits);
console.log('  Compressed bits:', result2.compressedBits);
assert(result2.compressedBits < result2.originalBits, 'Repeated chars should compress');
console.log('  PASSED
');

// Test 3: Mixed text
console.log('Test 3: Mixed text');
const ahMix = new AdaptiveHuffman();
const text3 = 'hello world';
const result3 = ahMix.encode(text3);
console.log('  Input:', text3);
console.log('  Compression ratio:', result3.ratio.toFixed(3));
console.log('  Savings:', result3.savings, 'bits');
assert(result3.binary.length > 0, 'Mixed text should produce output');
console.log('  PASSED
');

// Test 4: Round-trip (encode and decode)
console.log('Test 4: Encode/Decode round-trip');
const ahRoundtrip = new AdaptiveHuffman();
const original = 'adaptive huffman coding';
const encoded = ahRoundtrip.encode(original);
const ahDecode = new AdaptiveHuffman();
const decoded = ahDecode.decode(encoded.binary);
console.log('  Original:', original);
console.log('  Decoded:', decoded);
assert(decoded === original, 'Decoded should match original');
console.log('  PASSED
');

// Test 5: Empty and single byte
console.log('Test 5: Edge cases');
const ahEdge = new AdaptiveHuffman();
const result5a = ahEdge.encode('x');
assert(result5a.binary.length === 8, 'Single new symbol should be 8 bits');
console.log('  Single symbol test: PASSED');

const ahEdge2 = new AdaptiveHuffman();
const result5b = ahEdge2.encode('xx');
assert(result5b.binary.length > 8, 'Repeated symbol uses tree');
console.log('  Repeated symbol test: PASSED
');

// Test 6: Larger text
console.log('Test 6: Larger text compression');
const ahLarge = new AdaptiveHuffman();
const largeText = 'the quick brown fox jumps over the lazy dog ' +
                  'the quick brown fox jumps over the lazy dog';
const result6 = ahLarge.encode(largeText);
console.log('  Input length:', largeText.length, 'chars');
console.log('  Compression ratio:', (result6.ratio * 100).toFixed(1) + '%');
console.log('  Bits saved:', result6.savings);
assert(result6.ratio < 1.0, 'Large text should compress');
console.log('  PASSED
');

// Test 7: Verify compression improves with repetition
console.log('Test 7: Compression improves with symbol frequency');
const text7a = 'aaabbbcccdddeeefff';
const ahFreq1 = new AdaptiveHuffman();
const result7a = ahFreq1.encode(text7a);

const text7b = 'aabbccddee';
const ahFreq2 = new AdaptiveHuffman();
const result7b = ahFreq2.encode(text7b);

console.log('  High frequency text ratio:', result7a.ratio.toFixed(3));
console.log('  Low frequency text ratio:', result7b.ratio.toFixed(3));
assert(result7a.ratio < result7b.ratio, 'Higher freq should compress better');
console.log('  PASSED
');

console.log('All tests passed! Adaptive Huffman encoding is working correctly.');
