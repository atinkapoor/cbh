# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
In this refactored version, the code is broken down into smaller, self-explanatory functions that improve readability, also tried to reduce the cognitive complexity:

createHash: A function that takes a string input and returns its sha3-512 hash.

getCandidateFromEvent: The getCandidateFromEvent function is responsible for extracting a partition key candidate from a given event object.
if no event is given it returns the trivial partitioning key.
if event object has a partitioning key 'partitionKey' if this is already a string then its returned otherwise we use JSON.stringify and return.
if the event does not have a 'partitionKey' we return a hash created using sha3-512 of the event after JSON.stringify it.

deterministicPartitionKey: Function now calls 'getCandidateFromEvent' function and checks if the candidate's length exceeds the maximum allowed length. If it does, it returns the hash of the candidate, otherwise, it returns the candidate unchanged.
