const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;
const CRYPTO_ALGORITHM = "sha3-512";

// Create a hash of the given input string
const createHash = (data) => {
  return crypto.createHash(CRYPTO_ALGORITHM).update(data).digest("hex");
};

// Extract the partition key candidate from the event object
const getCandidateFromEvent = (event) => {
  // If no event is provided, return the trivial partition key
  if (!event) return TRIVIAL_PARTITION_KEY;

  // If the event has a partitionKey property, stringify it if it's not a string
  if (event.partitionKey) {
    return typeof event.partitionKey !== "string" ? JSON.stringify(event.partitionKey) : event.partitionKey;
  }

  // If the event doesn't have a partitionKey, return the hash of the stringified event data
  return createHash(JSON.stringify(event));
};

exports.deterministicPartitionKey = (event) => {
  // Get the partition key candidate from the event
  const candidate = getCandidateFromEvent(event);
  // Ensure the candidate's length is within the allowed limit, and return the final partition key
  return candidate.length > MAX_PARTITION_KEY_LENGTH ? createHash(candidate) : candidate;
};
