const { deterministicPartitionKey } = require("./dpk");
const crypto = require('crypto');

const MAX_PARTITION_KEY_LENGTH = 256;
const CRYPTO_ALGORITHM = "sha3-512";

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it('should use the provided partition key when it exists', () => {
    const event = { partitionKey: 'my-partition-key' };
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe('my-partition-key');
  });

  it('should generate a deterministic partition key from an event', () => {
    const event = { id: 123, name: 'No Name' };
    const expectedPartitionKey = crypto.createHash(CRYPTO_ALGORITHM).update(JSON.stringify(event)).digest('hex');
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe(expectedPartitionKey);
  });

  it('should hash the partition key again if it is too long', () => {
    const event = { id: 123, name: 'No Name' };
    const longPartitionKey = 'z'.repeat(300);
    const expectedPartitionKey = crypto.createHash(CRYPTO_ALGORITHM).update(longPartitionKey).digest('hex');
    const partitionKey = deterministicPartitionKey({ ...event, partitionKey: longPartitionKey });
    expect(partitionKey).toBe(expectedPartitionKey);
  });

  it("should stringify and truncate/hashes non-string partition keys when provided", () => {
    const nonStringPartitionKey = { complexKey: "some-value", otherKey: 42 };
    const event = { partitionKey: nonStringPartitionKey };
    const stringifiedKey = JSON.stringify(nonStringPartitionKey);
    const expectedPartitionKey =
      stringifiedKey.length > MAX_PARTITION_KEY_LENGTH
        ? crypto.createHash(CRYPTO_ALGORITHM).update(stringifiedKey).digest("hex")
        : stringifiedKey;
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe(expectedPartitionKey);
  });
});
