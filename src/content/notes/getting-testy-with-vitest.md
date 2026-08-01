---
title: "Getting Testy With Vitest"
tags: ["vitest", "unit-test", "software-testing"]
description: "Vitest is now my defacto test framework since I use Vite on everything it seems like. Learn more about it here."
publishDate: "2026-08-01T06:23:00Z"
category: "Software QA/Testing"
---

## The Need for a Vite Native Test Runner

- Vite's out-of-the-box support for common web patterns, features like glob imports and SSR primitives, and its many plugins and integrations are fostering a vibrant ecosystem. Its dev and build story are key to its success. For docs, there are several SSG-based alternatives powered by Vite. Vite's Unit Testing story hasn't been clear though. Existing options like Jest were created in a different context. There is a lot of duplication between Jest and Vite, forcing users to configure two different pipelines.

- Using Vite dev server to transform your files during testing, enables the creation of a simple runner that doesn't need to deal with the complexity of transforming source files and can solely focus on providing the best DX during testing. A test runner that uses the same configuration of your App (through vite.config.js), sharing a common transformation pipeline during dev, build, and test time. That is extensible with the same plugin API that lets you and the maintainers of your tools provide first-class integration with Vite. A tool that is built with Vite in mind from the start, taking advantage of its improvements in DX, like its instant Hot Module Reload (HMR). This is Vitest, a next generation testing framework powered by Vite.

- Given Jest's massive adoption, Vitest provides a compatible API that allows you to use it as a drop-in replacement in most projects. It also includes the most common features required when setting up your unit tests (mocking, snapshots, coverage). Vitest cares a lot about performance and uses Worker threads to run as much as possible in parallel. Some ports have seen test running an order of magnitude faster. Watch mode is enabled by default, aligning itself with the way Vite pushes for a dev first experience. Even with all these improvements in DX, Vitest stays lightweight by carefully choosing its dependencies (or directly inlining needed pieces).

> "Vitest aims to position itself as the Test Runner of choice for Vite projects, and as a solid alternative even for projects not using Vite."

## Getting Started

1. Install vitest using: `npm install -D vitest`
2. I do this next to make things easier - go to your `package.json` and add this script:

```json
"scripts": {
  "test": "vitest"
}
```  

- When you create your test file, it will take on the shape of `sum.test.js`, which I've actually created for you (along with `sum.js` but I really hope you know how to write that one) below as an example from the Vitest docs.

```javascript
// `sum.js`
export function sum(a, b) {
  return a + b;
}
```

```javascript
// `sum.test.js`
import { expect, test } from 'vitest';
import { sum } from './sum.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

1. Run `npm run test` to get run the test cases and hope you'll see something like:

```sh
✓ sum.test.js (1)
  ✓ adds 1 + 2 to equal 3

Test Files  1 passed (1)
     Tests  1 passed (1)
  Start at  02:15:44
  Duration  311ms
```

## Writing Tests

- A test verifies that a piece of code produces the expected result. The `test` function is used to define a test and `expect` to make assertions.

```javascript
import { expect, test } from 'vitest'

test('Math.sqrt works for perfect squares', () => {
  expect(Math.sqrt(4)).toBe(2)
  expect(Math.sqrt(144)).toBe(12)
  expect(Math.sqrt(0)).toBe(0)
})
```

> Use `test` or `it`?
> You might also see tests written with `it` instead of `test` - they are totally identical in behavior, but some people like the `it` alias beause it reads more naturally
> See example below

```sh
import { expect, it } from 'vitest'

it('should compute square roots', () => {
  expect(Math.sqrt(4)).toBe(2);
});
```

## Grouping Tests with `describe`

- Your test file will grow and you will want to organize related tests together to create a test suite using `describe`

```javascript
import { describe, expect, test } from 'vitest'

describe('Math.sqrt', () => {
  test('returns the square root of perfect squares', () => {
    expect(Math.sqrt(4)).toBe(2)
    expect(Math.sqrt(9)).toBe(3)
  })

  test('returns NaN for negative numbers', () => {
    expect(Math.sqrt(-1)).toBeNaN()
  })

  test('returns 0 for 0', () => {
    expect(Math.sqrt(0)).toBe(0)
  })
})
```

- You can nest `describe` blocks for further organization, but keep nesting shallow. Deeply nested tests are harder to read. A flat list of tests is often enough for simple modules, and `describe` becomes more useful when a file tests multiple functions or methods that each need their own group.

## Test Files

By default, Vitest looks for any file that contains .test. or .spec. in its name, such as utils.test.js, app.spec.js, or math.test.jsx. It searches in all subdirectories, so it doesn't matter where you place them.

The exact patterns are:

**/*.test.{ts,js,mjs,cjs,tsx,jsx}
**/*.spec.{ts,js,mjs,cjs,tsx,jsx}
There's no single "right" way to organize your test files. Some teams prefer placing tests right next to the source code they test, while others keep them in a dedicated directory. Vitest will find them either way:

src/
  utils.js
  utils.test.js       # co-located with the source
  __tests__/
    utils.test.js      # in a test directory
If the default patterns don't work for your project, you can customize which files are included with the include and exclude config options

## Testing Typescript

- Because Vitest runs on top of Vite, TypeScript works out of the box. There's no extra compiler to install, no ts-jest to configure, and no separate build step for your tests. Just name your test file .test.ts instead of .test.js and start writing:

```ts
import { expect, test } from 'vitest';

interfaced User {
  name: string;
  age: number;
}

function createUser(name: string, age: number): User {
  return { name, age }
};

test('creates a user with the correct fields', () => {
  const user = createUser('Alice', 30);

  expect(user).toEqual({ name: 'Alice', age: 30 });
  expect(user.name).toBe('Alice');
})
```

## Reading Tests

When you run vitest and only a single test file matches, the output is expanded into a tree structure showing describe groups and individual tests along with their duration:

```sh
 ✓ src/utils.test.js (3 tests) 5ms
   ✓ Math.sqrt 4ms
     ✓ returns the square root of perfect squares 2ms
     ✓ returns NaN for negative numbers 1ms
     ✓ returns 0 for 0 1ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

When multiple test files run, Vitest collapses each file into a single line to keep the output manageable:

```sh
 ✓ src/utils.test.js (3 tests) 5ms
 ✓ src/math.test.js (2 tests) 3ms
 ✓ src/strings.test.js (4 tests) 7ms

 Test Files  3 passed (3)
      Tests  9 passed (9)
```

When a test fails, Vitest shows you exactly what went wrong. You'll see the expected value, the actual value, a diff highlighting the difference, and a code snippet of the surrounding lines with the failing assertion highlighted. It also includes the file and line number so you can jump straight to the source:

 FAIL src/utils.test.js > Math.sqrt > returns the square root of perfect squares
AssertionError: expected 3 to be 2

- Expected
+ Received

  2
  3

 ❯ src/utils.test.js:5:28
      3|   test('returns the square root of perfect squares', () => {
      4|     expect(Math.sqrt(4)).toBe(2)
      5|     expect(Math.sqrt(9)).toBe(2)
                                  ^
      6|   })
      7|
```

Between the diff and the code snippet, you can usually understand what went wrong without needing to add extra console.log statements or open the file yourself.

While developing, you'll often want to run only a subset of tests. Vitest provides modifiers for this:

.only tells Vitest to run only this test (or suite) and skip everything else in the file. This is useful when you're working on a specific test and don't want to wait for the entire suite to finish:


test.only('focus on this test', () => {
  // only this test runs in the file
})
.skip does the opposite. It skips a test without removing it, which is handy when a test is temporarily broken or you want to ignore it while you work on something else:


test.skip('not ready yet', () => {
  // this test is skipped
})
.todo lets you mark a placeholder for a test you haven't written yet. Vitest will list it in the output so you won't forget about it:


test.todo('implement validation later')
These modifiers are great for quick, local changes while developing. For more permanent ways to filter tests (by filename, line number, or tags), see the Test Filtering guide.

Parameterized Tests
When you have several test cases that only differ in their inputs and expected outputs, writing a separate test for each one gets repetitive. test.for lets you define the cases as data and run the same test logic for all of them:


import { expect, test } from 'vitest'

test.for([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', ([a, b, expected]) => {
  expect(a + b).toBe(expected)
})
The placeholders %i, %s, and %f in the test name are replaced with the corresponding values from each row, so the output shows add(1, 1) -> 2, add(1, 2) -> 3, and so on.

If your cases have more than two or three values, passing objects is more readable. Use $property in the name to interpolate fields:


test.for([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 1, expected: 3 },
])('add($a, $b) -> $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
The second argument to the test function is the Test Context, which gives you access to fixtures, per-test expect, and other utilities. This is especially useful with test.concurrent, where concurrent tests run in parallel and the global expect can't reliably associate a snapshot with the right test. The context-scoped expect solves this:


test.concurrent.for([
  [1, 1],
  [1, 2],
  [2, 1],
])('add(%i, %i)', ([a, b], { expect }) => {
  expect(a + b).toMatchSnapshot()
})
describe.for works the same way but creates a suite for each set of parameters, which is useful when multiple tests share the same parameterized setup.

TIP

Vitest also provides test.each, which you may recognize from Jest. It works similarly but spreads array arguments instead of passing them as a single value, and doesn't provide access to the Test Context. It exists mainly for Jest compatibility. Prefer test.for in new code.

Using Global Imports
By default, you import test, expect, describe, and other functions from vitest at the top of every test file. If you'd rather use them as globals without importing (similar to how Jest works), you can enable the globals option in your config:

vitest.config.js

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
With this enabled, you can write tests without the import line:


test('no import needed', () => {
  expect(1 + 1).toBe(2)
})
TIP

If you use TypeScript, add "types": ["vitest/globals"] to your tsconfig.json compilerOptions for proper type support.

Running Tests
Vitest runs all test files in parallel by default, using child processes. Each test file runs in its own isolated context, so your test files don't share state with each other. This prevents tests in different files from accidentally interfering.

Tests within a single file run sequentially by default, which is usually what you want since tests in the same file often share setup code. If your tests are truly independent, you can opt into running them concurrently with test.concurrent to speed things up. See the Parallelism guide for more details on controlling test execution.

## Part Two: Using Matchers

- [Using Matchers](https://vitest.dev/guide/learn/matchers.html)

## Part Three: [Testing Async Guide](https://vitest.dev/guide/learn/async.html)

## Async/Await

- The most straightforward approach is to make your test function async. Vitest will automatically wait for the returned promise to resolve before considering the test complete. If the promise rejects, the test fails with the rejection reason.

```javascript
import { expect, test } from 'vitest';

function fetchUser(id) {
  return Promise.resolve({ id, name: 'Alice' });
}

test('fetches uer by id', async() => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
})
```

- This is the pattern you'll use the vast majority of the time. It reads just like synchronous code, and errors propagate naturally through await.

## Resolves and Rejects

- Sometimes you'd rather assert on a promise directly instead of await-ing it into a variable first. The .resolves and .rejects helpers let you do this. They unwrap the promise and then apply the matcher to the resolved or rejected value:

```js
test('resolves to Alice', async () => {
  await expect(fetchUser(1)).resolves.toMatchObject({ name: 'Alice' })
})

test('rejects with an error', async () => {
  await expect(fetchInvalidUser()).rejects.toThrow('User not found')
})
```
Assertion Counting
With async code, there's a subtle risk: an assertion inside a callback or .then() chain might never execute, and the test would still pass because no assertion failed. expect.hasAssertions() guards against this by verifying that at least one assertion ran during the test:


test('callback is invoked', async () => {
  expect.hasAssertions()

  const data = await fetchData()
  data.items.forEach((item) => {
    expect(item.id).toBeDefined()
  })
  // if data.items is empty, the test fails instead of silently passing
})
When you know exactly how many assertions should run, expect.assertions(n) is more precise:


test('both callbacks are called', async () => {
  expect.assertions(2)

  await Promise.all([
    fetchUser(1).then(user => expect(user.name).toBe('Alice')),
    fetchUser(2).then(user => expect(user.name).toBe('Bob')),
  ])
})
In most cases, async/await with direct assertions is clear enough and you don't need assertion counting. It's most useful when assertions are inside callbacks, loops, or conditional branches where you want to guarantee they actually executed.

Callbacks
Some older APIs use callbacks instead of promises. Since Vitest works with promises, the simplest approach is to wrap the callback in a Promise:


function fetchData(callback) {
  setTimeout(() => callback('peanut butter'), 100)
}

test('the data is peanut butter', async () => {
  const data = await new Promise((resolve) => {
    fetchData(resolve)
  })
  expect(data).toBe('peanut butter')
})
This pattern works for any callback-based API. Pass resolve as the success callback, and the test will wait until the callback is invoked.

TIP

Most modern Node.js APIs (such as fs/promises and fetch) support promises natively, so you can use async/await directly. The callback wrapping pattern above is mainly useful for older libraries that haven't adopted promises yet.

Timeouts
By default, each test has a 5-second timeout. If a test takes longer than that (perhaps because a promise never resolves, or a network request hangs), it will fail with a timeout error. This prevents your test suite from getting stuck indefinitely.

You can set a custom timeout as the third argument to test, which is useful for tests that legitimately need more time:


test('long-running operation', async () => {
  await someSlowOperation()
}, 10_000) // 10 seconds
If you find yourself needing longer timeouts across many tests, you can change the default for all tests with the testTimeout config option:

vitest.config.js

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 10_000,
  },
})
Unhandled Rejections
By default, Vitest reports unhandled promise rejections as errors in the test run. If a promise rejects somewhere in your code and nothing catches it, the test run will fail, even if all your assertions passed. This is intentional: unhandled rejections usually indicate real bugs, like a forgotten await or a fire-and-forget promise that silently fails.


test('this causes an unhandled rejection error', () => {
  // This promise rejects but is never awaited or caught
  Promise.reject(new Error('oops'))
})
To fix this, make sure you await all promises or catch expected rejections:


test('handle the rejection', async () => {
  // Either await the promise
  await expect(Promise.reject(new Error('oops'))).rejects.toThrow('oops')

  // Or catch it explicitly if you don't need to assert on it
  Promise.reject(new Error('expected')).catch(() => {})
})
If your code intentionally produces unhandled rejections, you can filter specific errors with onUnhandledError or disable the check entirely with dangerouslyIgnoreUnhandledErrors.

Suggest changes to this page

Setup and Teardown
Often while writing tests, you need to do some work before tests run (initialize data, connect to a database, start a server) and clean up afterwards. Rather than duplicating this code in every test, Vitest provides lifecycle hooks that run automatically at the right time.

Repeating Setup for Each Test
The most common hooks are beforeEach and afterEach. As the names suggest, beforeEach runs before every test in the file, and afterEach runs after every test, even if the test fails. This makes them perfect for ensuring each test starts with a known state.


import { afterEach, beforeEach, expect, test } from 'vitest'

let items

beforeEach(() => {
  items = ['apple', 'banana', 'cherry']
})

afterEach(() => {
  items = []
})

test('items starts with 3 fruits', () => {
  expect(items).toHaveLength(3)
})

test('can add an item', () => {
  items.push('date')
  expect(items).toHaveLength(4)
  // afterEach will reset items for the next test,
  // so this mutation won't leak into other tests
})
Without these hooks, the second test's push would affect any test that runs after it, which is a classic source of flaky tests. The hooks guarantee clean state for every test.

One-Time Setup
Some setup is too expensive to repeat for every test. If you need to connect to a database, start a server, or load a large file, doing that before every test would slow your suite down dramatically. That's what beforeAll and afterAll are for. They run once for the entire file:


import { afterAll, beforeAll, expect, test } from 'vitest'

let db

beforeAll(async () => {
  db = await connectToDatabase()
})

afterAll(async () => {
  await db.close()
})

test('can query users', async () => {
  const users = await db.query('SELECT * FROM users')
  expect(users.length).toBeGreaterThan(0)
})

test('can query products', async () => {
  const products = await db.query('SELECT * FROM products')
  expect(products.length).toBeGreaterThan(0)
})
The database connection is created once, shared across all tests, and then closed when the file finishes running.

Scoping with describe
Hooks defined inside a describe block only apply to the tests within that block. Top-level hooks apply to every test in the file. This lets you set up different state for different groups of tests:


import { beforeEach, describe, expect, test } from 'vitest'

describe('math operations', () => {
  let value

  beforeEach(() => {
    value = 0
  })

  test('can add', () => {
    value += 5
    expect(value).toBe(5)
  })

  test('can subtract', () => {
    value -= 3
    expect(value).toBe(-3) // value was reset to 0 by beforeEach
  })
})

describe('string operations', () => {
  let text

  beforeEach(() => {
    text = 'hello'
  })

  test('can uppercase', () => {
    expect(text.toUpperCase()).toBe('HELLO')
  })
})
Each describe block has its own beforeEach that only affects the tests inside it. The string tests don't know or care about the value variable, and vice versa.

Execution Order
When you have hooks at multiple levels, it's helpful to understand the order they run in. Top-level hooks wrap around inner hooks, forming a nesting structure:


import { afterAll, afterEach, beforeAll, beforeEach, describe, test } from 'vitest'

beforeAll(() => console.log('1 - beforeAll'))
afterAll(() => console.log('8 - afterAll'))
beforeEach(() => console.log('2 - beforeEach'))
afterEach(() => console.log('5 - afterEach'))

describe('suite', () => {
  beforeEach(() => console.log('3 - inner beforeEach'))
  afterEach(() => console.log('4 - inner afterEach'))

  test('first test', () => {
    console.log('  first test')
  })

  test('second test', () => {
    console.log('  second test')
  })
})
This produces the following output:


1 - beforeAll
2 - beforeEach
3 - inner beforeEach
  first test
4 - inner afterEach
5 - afterEach
2 - beforeEach
3 - inner beforeEach
  second test
4 - inner afterEach
5 - afterEach
8 - afterAll
Notice the pattern: beforeAll and afterAll run once for the entire suite, while beforeEach and afterEach repeat for every test. Within each test, outer beforeEach runs first (setting up the broadest context), then inner beforeEach runs (narrowing the context). After the test, the order reverses: inner afterEach cleans up the narrow context first, then outer afterEach handles the broader cleanup.

Cleanup with onTestFinished
Sometimes you create a resource inside a test that needs to be cleaned up afterwards. You could use afterEach, but that means the cleanup is separated from the setup, which can make the test harder to follow. onTestFinished lets you register a cleanup function right where you create the resource:


import { expect, onTestFinished, test } from 'vitest'

test('creates a temporary file', () => {
  const file = createTempFile()
  onTestFinished(() => {
    deleteTempFile(file)
  })

  expect(file.exists()).toBe(true)
})
A similar pattern works with beforeEach. You can return a cleanup function and Vitest will call it after each test. This is especially nice when the setup and teardown are closely related:


import { beforeEach } from 'vitest'

beforeEach(() => {
  const server = startServer()
  return () => {
    server.close()
  }
})
Fixtures with test.extend
The examples above use let variables and beforeEach to set up shared state. This works, but it has some downsides: the variable declarations are separated from the initialization, the types require explicit annotation, and it's easy to forget to clean up.

Vitest offers a better pattern for this with test.extend. You define reusable fixtures that are automatically created for each test and cleaned up afterwards:

my-test.js

import { test as baseTest } from 'vitest'

export const test = baseTest
  .extend('db', async ({}, { onCleanup }) => {
    const db = await createDatabase()
    onCleanup(() => db.close())
    return db
  })
  .extend('user', async ({ db }) => {
    return await db.createUser({ name: 'Alice' })
  })
my-test.test.js

import { expect } from 'vitest'
import { test } from './my-test.js'

test('user is created', ({ db, user }) => {
  expect(user.name).toBe('Alice')
})
Fixtures are only initialized when a test actually uses them (by destructuring them from the context), and they can depend on each other. This makes them a great alternative to beforeEach/afterEach for most setup and teardown patterns.

See the Test Context guide for the full details on fixtures, scoping, and overrides.

Setup Files
If you have setup code that should run before every test file in your project (things like polyfills, global configuration, or custom matchers), you can put it in a setup file and point to it with the setupFiles config option:

vitest.config.js

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./test/setup.js'],
  },
})
test/setup.js

// This runs before every test file
import { expect } from 'vitest'
import { customMatchers } from './custom-matchers.js'

expect.extend(customMatchers)
Unlike beforeAll, which runs once per file, setup files run in a separate phase before the test file even starts being collected. This makes them the right place for things like extending the expect API or configuring global polyfills.

TIP

For advanced cases where your test needs to run inside a wrapping context (like a database transaction or a tracing span), see the aroundEach and aroundAll hooks. For the complete lifecycle picture, see Test Run Lifecycle.

Mock Functions
When writing tests, you often need to replace a real function or module with a controlled version. This is called mocking. There are several reasons you might want to do this: maybe the real function makes network requests that would slow down your tests, or maybe you need to simulate an error that's hard to trigger with real code. Mock functions let you control what a dependency returns, observe how it was called, and isolate the code under test from side effects.

Vitest provides mocking utilities through the vi object.

Creating Mock Functions
The simplest way to create a mock is with vi.fn(). This gives you a function that does nothing by default (returns undefined), but tracks every call made to it:


import { expect, test, vi } from 'vitest'

test('mock function basics', () => {
  const getApples = vi.fn()

  // Call it
  getApples()

  // Check it was called
  expect(getApples).toHaveBeenCalled()
  expect(getApples).toHaveBeenCalledTimes(1)

  // By default, a mock returns undefined
  expect(getApples()).toBeUndefined()
})
Mock Return Values
A mock that always returns undefined isn't very useful on its own. You'll usually want to control what it returns so you can test how your code reacts to different values:


import { expect, test, vi } from 'vitest'

test('mock return values', () => {
  const getApples = vi.fn()

  // Always return this value
  getApples.mockReturnValue(10)
  expect(getApples()).toBe(10)

  // Return this value only once, then fall back to the default
  getApples.mockReturnValueOnce(20)
  expect(getApples()).toBe(20) // 20 (one-time)
  expect(getApples()).toBe(10) // back to default
})
If the function you're mocking is async, use mockResolvedValue and mockRejectedValue to control the promise outcome:


test('mock async return values', async () => {
  const fetchUser = vi.fn()

  fetchUser.mockResolvedValue({ name: 'Alice' })
  const user = await fetchUser()
  expect(user.name).toBe('Alice')

  fetchUser.mockRejectedValue(new Error('Not found'))
  await expect(fetchUser()).rejects.toThrow('Not found')
})
Mock Implementation
Sometimes you need more than a fixed return value. You want the mock to actually do something with its arguments. mockImplementation lets you provide a full replacement function:


import { expect, test, vi } from 'vitest'

test('mock with custom implementation', () => {
  const add = vi.fn()
  add.mockImplementation((a, b) => a + b)

  expect(add(1, 2)).toBe(3)
  expect(add(10, 20)).toBe(30)
})
As a shorthand, you can pass the implementation directly to vi.fn():


const add = vi.fn((a, b) => a + b)
Inspecting Calls
One of the most powerful things about mock functions is that they remember every call made to them. You can assert on how many times a function was called, what arguments it received, and what it returned:


import { expect, test, vi } from 'vitest'

test('inspecting mock calls', () => {
  const greet = vi.fn()

  greet('Alice')
  greet('Bob', 'Charlie')

  // Number of calls
  expect(greet).toHaveBeenCalledTimes(2)

  // Check specific arguments
  expect(greet).toHaveBeenCalledWith('Alice')
  expect(greet).toHaveBeenCalledWith('Bob', 'Charlie')

  // Check the arguments of a specific call by position
  expect(greet).toHaveBeenNthCalledWith(1, 'Alice')
  expect(greet).toHaveBeenLastCalledWith('Bob', 'Charlie')

  // Access the raw call data
  expect(greet.mock.calls).toEqual([
    ['Alice'],
    ['Bob', 'Charlie'],
  ])
})
The .mock property gives you full access to the call history. In addition to .mock.calls, you can also inspect .mock.results to see what the mock returned (or threw) on each call:


const double = vi.fn(x => x * 2)

double(5)
double(10)

expect(double.mock.results).toEqual([
  { type: 'return', value: 10 },
  { type: 'return', value: 20 },
])
WARNING

.mock.calls stores references to the arguments, not copies. If you pass an object to a mock and then mutate it afterwards, the recorded call will reflect the mutated state, not the state at the time of the call:


const fn = vi.fn()
const obj = { count: 1 }

fn(obj)
obj.count = 2

// ❌ This fails! mock.calls[0][0].count is now 2, not 1
expect(fn).toHaveBeenCalledWith({ count: 1 })
If you need to assert on the original values, you can use mockImplementation to capture a clone at call time:


const calls = []
const fn = vi.fn((obj) => {
  calls.push(structuredClone(obj))
})

const obj = { count: 1 }
fn(obj)
obj.count = 2

expect(calls[0]).toEqual({ count: 1 }) // ✅ passes
Alternatively, you can make your assertion before the mutation happens.

Spying on Methods
vi.spyOn is different from vi.fn() in an important way. Instead of creating a brand new function, it wraps an existing method on an object. The original implementation still works by default, but you can observe every call and optionally override the behavior:


import { expect, test, vi } from 'vitest'

const calculator = {
  add(a, b) {
    return a + b
  },
}

test('spy on a method', () => {
  const spy = vi.spyOn(calculator, 'add')

  // The original implementation still works
  expect(calculator.add(1, 2)).toBe(3)

  // But we can observe calls
  expect(spy).toHaveBeenCalledWith(1, 2)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('spy can override implementation', () => {
  const spy = vi.spyOn(calculator, 'add')
  spy.mockReturnValue(42)

  expect(calculator.add(1, 2)).toBe(42)
})
This is particularly useful when you want to verify that your code calls a method correctly without replacing the method's behavior entirely.

Resetting Mocks
Mock functions accumulate state as tests run. They remember every call, every return value, and any custom implementation you've set. If you don't reset them between tests, this state can leak and cause confusing failures. Vitest provides three levels of cleanup:

mockClear() clears the recorded call history and return values, but keeps any custom implementation you've set
mockReset() does everything mockClear does, and also removes any custom implementation, returning the mock to its default state
mockRestore() is specifically for spies created with vi.spyOn. It restores the original object method, effectively undoing the spy. On vi.fn() mocks, it behaves the same as mockReset
In practice, the easiest approach is to restore all mocks automatically after each test:


import { afterEach, expect, test, vi } from 'vitest'

const calculator = {
  add: (a, b) => a + b,
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('spy is restored after the test', () => {
  const spy = vi.spyOn(calculator, 'add').mockReturnValue(42)
  expect(calculator.add(1, 2)).toBe(42)
  // afterEach will restore calculator.add to the original implementation
})
Even better, you can configure this globally with the restoreMocks option so you don't need the afterEach at all:

vitest.config.js

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    restoreMocks: true,
  },
})
Mocking Modules
Sometimes you need to replace an entire module rather than a single function. For example, a database client or a logger that you don't want running during tests. vi.mock lets you replace a module's exports with mock implementations:


import { expect, test, vi } from 'vitest'
import { getUser } from './db.js'

vi.mock(import('./db.js'), () => ({
  getUser: vi.fn(),
}))

test('mock a module', () => {
  vi.mocked(getUser).mockReturnValue({ name: 'Alice' })

  const user = getUser(1)
  expect(user.name).toBe('Alice')
  expect(getUser).toHaveBeenCalledWith(1)
})
WARNING

vi.mock calls are hoisted to the top of the file. They run before any imports. This means the mocked version is in place by the time your test code runs.

WARNING

Always pass import('./db.js') rather than a plain string './db.js'. When you use import(), TypeScript can infer the module's types, so the factory function's return value is type-checked and importOriginal returns the correctly typed module. As a bonus, if you rename or move the file in your IDE, the import path will be updated automatically. If you use a string, you lose both the type safety and the automatic refactoring.

Vitest has comprehensive guides for specific mocking scenarios:

Mocking Functions
Mocking Modules
Mocking Timers
Mocking Dates
Mocking Globals
Mocking Requests
Mocking the File System
Mocking Classes

Snapshot Testing
Snapshot tests capture the output of a piece of code and save it to a file. On subsequent runs, the output is compared against the saved snapshot. If the output changes, the test fails. Either the change is a bug, or the snapshot needs to be updated.

This approach is particularly useful when you're testing something that produces structured output: a function that returns a complex object, a component that renders HTML, or an error formatter that produces multi-line messages. Writing manual assertions for every field or line would be tedious and fragile. Instead, you capture the entire output once, and let Vitest tell you if it ever changes.

Your First Snapshot
To create a snapshot test, pass a value to toMatchSnapshot():


import { expect, test } from 'vitest'

function generateGreeting(name) {
  return {
    message: `Hello, ${name}!`,
    timestamp: null,
    version: 2,
  }
}

test('generates a greeting', () => {
  expect(generateGreeting('Alice')).toMatchSnapshot()
})
The first time you run this test, there's no existing snapshot to compare against, so Vitest creates one. It stores the snapshot in a __snapshots__ directory next to your test file:


__snapshots__/
  example.test.js.snap
If you open that file, you'll see a serialized representation of the value:


exports['generates a greeting 1'] = `
{
  "message": "Hello, Alice!",
  "timestamp": null,
  "version": 2,
}
`
From now on, every time you run this test, Vitest serializes the output of generateGreeting('Alice') and compares it character-by-character against this stored snapshot. If the output changes (say, someone modifies the message format or bumps the version number), the test fails and shows a clear diff of what changed.

TIP

Commit your snapshot files to version control. They serve as a record of the expected output and should be reviewed in code review just like any other test assertion.

Inline Snapshots
External snapshot files work well, but they mean you have to jump to a different file to see what the expected output actually looks like. For smaller values, it's often more convenient to keep the snapshot right in your test file with toMatchInlineSnapshot().

Start by writing the assertion without any argument:


test('generates a greeting', () => {
  expect(generateGreeting('Alice')).toMatchInlineSnapshot()
})
When you run the test, Vitest will automatically fill in the snapshot as a string argument:


test('generates a greeting', () => {
  expect(generateGreeting('Alice')).toMatchInlineSnapshot(`
    {
      "message": "Hello, Alice!",
      "timestamp": null,
      "version": 2,
    }
  `)
})
Now the expected output lives right next to the code that produces it. You can read the test and immediately understand what generateGreeting is expected to return. When the output changes, Vitest updates the string in place, so you don't need to manage separate snapshot files.

Inline snapshots are great for small, focused values. For large outputs (like a full HTML page), external snapshots or file snapshots are a better fit.

TIP

Unlike external snapshots, inline snapshots don't create separate .snap files. The expected value is stored directly in your test file as the argument to toMatchInlineSnapshot(), so there's nothing extra to commit.

Updating Snapshots
When you intentionally change the output of your code, existing snapshots will be outdated and the tests will fail. This is by design; it's the whole point of snapshot testing. But once you've verified that the new output is correct, you need to update the snapshots.

There are several ways to do this:

In watch mode: press u in the terminal to update all failed snapshots
From the CLI: run vitest -u or vitest --update to update snapshots and exit
In VS Code: use the "Update Snapshots" command on the test gutter icon from the Vitest extension

vitest -u
For inline snapshots, Vitest modifies your test file directly with the new values. For external snapshots, it rewrites the .snap file.

WARNING

Be careful when updating snapshots. Always review the diff to confirm the changes are intentional and not a bug. It's easy to accidentally accept a broken output by blindly pressing u.

File Snapshots
Sometimes the output you're testing is large enough that even an external .snap file feels awkward, or you want to view the snapshot with proper syntax highlighting in your editor. toMatchFileSnapshot() lets you save the snapshot to a file with any extension you want:


test('renders the component', async () => {
  const html = renderComponent()
  await expect(html).toMatchFileSnapshot('./fixtures/component.html')
})
The snapshot is stored as a plain .html file that you can open in a browser, view with syntax highlighting, or diff with standard tools. This works well for HTML, SVG, CSS, generated code, or any output where the file format matters for readability.

When to Use Snapshots
Snapshots shine when you're working with structured, serializable output that would be painful to assert on manually. Some common use cases:

A function that returns a complex configuration object with many nested fields
HTML or markup generated by a rendering function or template engine
Error messages that include formatted stack traces or context information
CLI output or log messages with specific formatting
JSON API responses where you want to catch any unexpected field changes
On the other hand, snapshots are not always the best tool. If the output changes frequently (for instance, it includes timestamps or random IDs), you'll spend more time updating snapshots than they save you. And if you only care about one or two specific fields, a targeted assertion like toMatchObject or toHaveProperty expresses your intent more clearly than a snapshot that captures everything.

The general rule: use snapshots when you want to protect against any change in the output, and use targeted assertions when you only care about specific properties.

Handling Dynamic Values
If your output includes values that change every run (like timestamps or IDs), you can use property matchers to pin the structure while ignoring volatile fields. Pass an object with asymmetric matchers as the first argument to toMatchSnapshot() or toMatchInlineSnapshot():


test('user snapshot with dynamic fields', () => {
  const user = createUser('Alice')

  expect(user).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date),
  })
})
The id and createdAt fields are checked against the matchers (any number, any date) instead of being compared to a stored value. All other fields are snapshotted as usual.

Error Snapshots
A common use of inline snapshots is capturing error messages. toThrowErrorMatchingInlineSnapshot combines toThrow with toMatchInlineSnapshot so you can snapshot the error message without a separate .snap file:


test('throws on invalid input', () => {
  expect(() => parse('')).toThrowErrorMatchingInlineSnapshot(
    `[Error: Unexpected end of input at position 0]`
  )
})
This is especially handy for verifying that error messages are clear and don't accidentally change. Like other inline snapshots, Vitest fills in the string on the first run and updates it when you press u.

TIP

For custom snapshot serializers, snapshot matchers, and advanced configuration, see the Snapshot guide.

ebugging Failing Tests
This page covers how to investigate test failures in Vitest: reading error output, isolating problems, identifying common causes, and using the available debugging tools.

Reading the Error
When a test fails, Vitest gives you several pieces of information. Let's look at a real failure and break it down:


 FAIL src/user.test.js > createUser > sets the default role
AssertionError: expected { name: 'Alice', role: 'viewer' } to deeply equal { name: 'Alice', role: 'member' }

- Expected
+ Received

  {
    "name": "Alice",
-   "role": "member",
+   "role": "viewer",
  }

 ❯ src/user.test.js:8:22
      6|   test('sets the default role', () => {
      7|     const user = createUser('Alice')
      8|     expect(user).toEqual({ name: 'Alice', role: 'member' })
                          ^
      9|   })
     10| })
There's a lot here, but each part tells you something:

The header (FAIL src/user.test.js > createUser > sets the default role) tells you which file, describe block, and test failed. This is the full path in the test tree.

The assertion message (expected { ... } to deeply equal { ... }) tells you what kind of check failed and shows the two values being compared.

The diff shows exactly what's different. Lines starting with + are what you actually got, and lines starting with - are what you expected. In this case, the role was "viewer" but the test expected "member".

The code snippet shows the exact line and a few surrounding lines, with a caret (^) pointing to the failing assertion. You can click the file path in most terminals and IDEs to jump directly there.

At this point, the question is: did the code change (maybe the default role was intentionally updated to "viewer"), or is the test wrong? Check the source code for createUser to find out. If the default was intentionally changed, update the test. If not, you've found a bug.

Isolating the Problem
When a test fails and the cause isn't immediately clear, the first step is to isolate it. Run just that one test, without the rest of your suite:


# Run only the failing test file
vitest src/user.test.js

# Run only tests matching a name pattern
vitest -t "sets the default role"

# Combine both for maximum precision
vitest src/user.test.js -t "sets the default role"
You can also add .only to the test itself:


test.only('sets the default role', () => {
  // only this test runs in the file
})
If you have many failures and want to focus on the first one, use --bail to stop after a set number of failures:


vitest --bail 1
If the test passes when run alone but fails when run with others, you have a test isolation problem (more on that below). If it fails even when run alone, the issue is in the test itself or the code it's testing.

Common Causes of Failures
Shared State Between Tests
This is one of the most common and frustrating issues. A test passes when you run it alone, but fails when the full suite runs. The usual cause is that some other test modifies shared state (a global variable, a module-level cache, a database) and doesn't clean up after itself.


// This is a problem: `users` is shared between tests
const users = []

test('adds a user', () => {
  users.push('Alice')
  expect(users).toEqual(['Alice'])
})

test('starts empty', () => {
  // This fails because 'Alice' is still in the array!
  expect(users).toEqual([])
})
The fix is to reset the state before each test with beforeEach, or better yet, use test.extend to create fresh state for each test automatically:


const test = baseTest.extend('users', () => [])

test('adds a user', ({ users }) => {
  users.push('Alice')
  expect(users).toEqual(['Alice'])
})

test('starts empty', ({ users }) => {
  // Passes: each test gets its own array
  expect(users).toEqual([])
})
Async Issues
Tests that involve promises can fail intermittently or in confusing ways if the async flow isn't handled correctly. The most common mistake is forgetting an await:


// This test always passes, even if fetchUser rejects!
test('fetches user', () => {
  // Missing await: the test finishes before the promise settles
  expect(fetchUser(1)).resolves.toMatchObject({ name: 'Alice' })
})
Vitest will usually warn you about unawaited assertions at the end of the test. If you see that warning, add the missing await:


test('fetches user', async () => {
  await expect(fetchUser(1)).resolves.toMatchObject({ name: 'Alice' })
})
If a test hangs and eventually times out, it usually means a promise never resolves. Check for missing callbacks, unresolved conditions, or deadlocks in the code you're testing.

Stale Snapshots
If you're using snapshot tests and you intentionally changed the output of your code, the existing snapshots will be outdated. The test fails and shows a diff between the old snapshot and the new output.

This is expected. Review the diff to confirm the changes are correct, then update the snapshots by pressing u in watch mode or running vitest -u.

Wrong Test Environment
If your code accesses browser APIs like document or window and you see errors like "document is not defined", your test is running in the Node environment (the default). You can switch to a browser-like environment with the environment config option, or better yet, use Browser Mode which runs tests in a real browser.

Mocks Not Cleaned Up
If a mock from one test leaks into another, you'll get unexpected behavior. For example, a vi.spyOn that overrides a method's return value will persist into the next test unless it's restored.

The easiest fix is to enable automatic mock restoration in your config:

vitest.config.js

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    restoreMocks: true,
  },
})
This calls mockRestore() on every mock after each test. See the Mock Functions tutorial for more details.

Debugging Tools
Console Logging
There's nothing wrong with adding console.log to your tests. It's the fastest way to inspect values and understand what's happening:


test('transforms data correctly', () => {
  const input = getData()
  console.log('input:', input)

  const result = transform(input)
  console.log('result:', result)

  expect(result).toMatchObject({ status: 'ok' })
})
Vitest displays console output inline with the test results, so you can see which test produced which log.

Vitest UI
For a visual overview of your test suite, run Vitest with the --ui flag:


vitest --ui
This opens a browser-based dashboard where you can see all your tests, their status, and their output. It also includes a module graph that shows how your files are connected, which can help you understand why a change in one file causes failures in another. See the Vitest UI guide for more details.

VS Code Extension
The Vitest VS Code extension lets you run and debug individual tests directly from your editor. You can click a "play" button next to any test, set breakpoints, and step through code in the VS Code debugger. This is often faster than switching between the terminal and your editor.

Verbose Output
If the default output isn't showing enough detail, use the verbose reporter:


vitest --reporter=verbose
This shows every test individually (not just the files), which can help spot patterns in which tests pass and which fail.

Attaching a Debugger
For more complex issues where you need to step through code line by line, you can run Vitest with the --inspect-brk flag and attach a debugger. The --no-file-parallelism flag ensures tests run in the main thread so breakpoints work reliably:


vitest --inspect-brk --no-file-parallelism
Then attach from VS Code, IntelliJ, or Chrome DevTools (chrome://inspect). See the Debugging guide for detailed setup instructions for each editor.

Getting Help
If you're stuck, these resources can help:

The Common Errors page covers specific error messages and their solutions
GitHub Issues for searching known bugs and workarounds
The Discord community for real-time help from other Vitest users and maintainers

ebugging Failing Tests
This page covers how to investigate test failures in Vitest: reading error output, isolating problems, identifying common causes, and using the available debugging tools.

Reading the Error
When a test fails, Vitest gives you several pieces of information. Let's look at a real failure and break it down:


 FAIL src/user.test.js > createUser > sets the default role
AssertionError: expected { name: 'Alice', role: 'viewer' } to deeply equal { name: 'Alice', role: 'member' }

- Expected
+ Received

  {
    "name": "Alice",
-   "role": "member",
+   "role": "viewer",
  }

 ❯ src/user.test.js:8:22
      6|   test('sets the default role', () => {
      7|     const user = createUser('Alice')
      8|     expect(user).toEqual({ name: 'Alice', role: 'member' })
                          ^
      9|   })
     10| })
There's a lot here, but each part tells you something:

The header (FAIL src/user.test.js > createUser > sets the default role) tells you which file, describe block, and test failed. This is the full path in the test tree.

The assertion message (expected { ... } to deeply equal { ... }) tells you what kind of check failed and shows the two values being compared.

The diff shows exactly what's different. Lines starting with + are what you actually got, and lines starting with - are what you expected. In this case, the role was "viewer" but the test expected "member".

The code snippet shows the exact line and a few surrounding lines, with a caret (^) pointing to the failing assertion. You can click the file path in most terminals and IDEs to jump directly there.

At this point, the question is: did the code change (maybe the default role was intentionally updated to "viewer"), or is the test wrong? Check the source code for createUser to find out. If the default was intentionally changed, update the test. If not, you've found a bug.

Isolating the Problem
When a test fails and the cause isn't immediately clear, the first step is to isolate it. Run just that one test, without the rest of your suite:


# Run only the failing test file
vitest src/user.test.js

# Run only tests matching a name pattern
vitest -t "sets the default role"

# Combine both for maximum precision
vitest src/user.test.js -t "sets the default role"
You can also add .only to the test itself:


test.only('sets the default role', () => {
  // only this test runs in the file
})
If you have many failures and want to focus on the first one, use --bail to stop after a set number of failures:


vitest --bail 1
If the test passes when run alone but fails when run with others, you have a test isolation problem (more on that below). If it fails even when run alone, the issue is in the test itself or the code it's testing.

Common Causes of Failures
Shared State Between Tests
This is one of the most common and frustrating issues. A test passes when you run it alone, but fails when the full suite runs. The usual cause is that some other test modifies shared state (a global variable, a module-level cache, a database) and doesn't clean up after itself.


// This is a problem: `users` is shared between tests
const users = []

test('adds a user', () => {
  users.push('Alice')
  expect(users).toEqual(['Alice'])
})

test('starts empty', () => {
  // This fails because 'Alice' is still in the array!
  expect(users).toEqual([])
})
The fix is to reset the state before each test with beforeEach, or better yet, use test.extend to create fresh state for each test automatically:


const test = baseTest.extend('users', () => [])

test('adds a user', ({ users }) => {
  users.push('Alice')
  expect(users).toEqual(['Alice'])
})

test('starts empty', ({ users }) => {
  // Passes: each test gets its own array
  expect(users).toEqual([])
})
Async Issues
Tests that involve promises can fail intermittently or in confusing ways if the async flow isn't handled correctly. The most common mistake is forgetting an await:


// This test always passes, even if fetchUser rejects!
test('fetches user', () => {
  // Missing await: the test finishes before the promise settles
  expect(fetchUser(1)).resolves.toMatchObject({ name: 'Alice' })
})
Vitest will usually warn you about unawaited assertions at the end of the test. If you see that warning, add the missing await:


test('fetches user', async () => {
  await expect(fetchUser(1)).resolves.toMatchObject({ name: 'Alice' })
})
If a test hangs and eventually times out, it usually means a promise never resolves. Check for missing callbacks, unresolved conditions, or deadlocks in the code you're testing.

Stale Snapshots
If you're using snapshot tests and you intentionally changed the output of your code, the existing snapshots will be outdated. The test fails and shows a diff between the old snapshot and the new output.

This is expected. Review the diff to confirm the changes are correct, then update the snapshots by pressing u in watch mode or running vitest -u.

Wrong Test Environment
If your code accesses browser APIs like document or window and you see errors like "document is not defined", your test is running in the Node environment (the default). You can switch to a browser-like environment with the environment config option, or better yet, use Browser Mode which runs tests in a real browser.

Mocks Not Cleaned Up
If a mock from one test leaks into another, you'll get unexpected behavior. For example, a vi.spyOn that overrides a method's return value will persist into the next test unless it's restored.

The easiest fix is to enable automatic mock restoration in your config:

vitest.config.js

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    restoreMocks: true,
  },
})
This calls mockRestore() on every mock after each test. See the Mock Functions tutorial for more details.

Debugging Tools
Console Logging
There's nothing wrong with adding console.log to your tests. It's the fastest way to inspect values and understand what's happening:


test('transforms data correctly', () => {
  const input = getData()
  console.log('input:', input)

  const result = transform(input)
  console.log('result:', result)

  expect(result).toMatchObject({ status: 'ok' })
})
Vitest displays console output inline with the test results, so you can see which test produced which log.

Vitest UI
For a visual overview of your test suite, run Vitest with the --ui flag:


vitest --ui
This opens a browser-based dashboard where you can see all your tests, their status, and their output. It also includes a module graph that shows how your files are connected, which can help you understand why a change in one file causes failures in another. See the Vitest UI guide for more details.

VS Code Extension
The Vitest VS Code extension lets you run and debug individual tests directly from your editor. You can click a "play" button next to any test, set breakpoints, and step through code in the VS Code debugger. This is often faster than switching between the terminal and your editor.

Verbose Output
If the default output isn't showing enough detail, use the verbose reporter:


vitest --reporter=verbose
This shows every test individually (not just the files), which can help spot patterns in which tests pass and which fail.

Attaching a Debugger
For more complex issues where you need to step through code line by line, you can run Vitest with the --inspect-brk flag and attach a debugger. The --no-file-parallelism flag ensures tests run in the main thread so breakpoints work reliably:


vitest --inspect-brk --no-file-parallelism
Then attach from VS Code, IntelliJ, or Chrome DevTools (chrome://inspect). See the Debugging guide for detailed setup instructions for each editor.

Getting Help
If you're stuck, these resources can help:

The Common Errors page covers specific error messages and their solutions
GitHub Issues for searching known bugs and workarounds
The Discord community for real-time help from other Vitest users and maintainers

Multiple Setups
You can specify several different browser setups using the browser.instances option.

The main advantage of using the browser.instances over the test projects is improved caching. Every project will use the same Vite server meaning the file transform and dependency pre-bundling has to happen only once.

Several Browsers
You can use the browser.instances field to specify options for different browsers. For example, if you want to run the same tests in different browsers, the minimal configuration will look like this:

vitest.config.ts

import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
  },
})
Different Setups
You can also specify different config options independently from the browser (although, the instances can also have browser fields):


vitest.config.ts

example.test.ts

import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        {
          browser: 'chromium',
          name: 'chromium-1',
          setupFiles: ['./ratio-setup.ts'],
          provide: {
            ratio: 1,
          },
        },
        {
          browser: 'chromium',
          name: 'chromium-2',
          provide: {
            ratio: 2,
          },
        },
      ],
    },
  },
})
In this example Vitest will run all tests in chromium browser, but execute a './ratio-setup.ts' file only in the first configuration and inject a different ratio value depending on the provide field.

WARNING

Note that you need to define the custom name value if you are using the same browser name because Vitest will assign the browser as the project name otherwise.

Filtering
You can filter what projects to run with the --project flag. Vitest will automatically assign the browser name as a project name if it is not assigned manually. If the root config already has a name, Vitest will merge them: custom -> custom (browser).


vitest --project=chromium

default

custom

export default defineConfig({
  test: {
    browser: {
      instances: [
        // name: chromium
        { browser: 'chromium' },
        // name: custom
        { browser: 'firefox', name: 'custom' },
      ]
    }
  }
})

Component Testing
Component testing is a testing strategy that focuses on testing individual UI components in isolation. Unlike end-to-end tests that test entire user flows, component tests verify that each component works correctly on its own, making them faster to run and easier to debug.

Vitest provides comprehensive support for component testing across multiple frameworks including Vue, React, Svelte, Lit, Preact, Qwik, Solid, Marko, and more. This guide covers the specific patterns, tools, and best practices for testing components effectively with Vitest.

Why Component Testing?
Component testing sits between unit tests and end-to-end tests, offering several advantages:

Faster feedback - Test individual components without loading entire applications
Isolated testing - Focus on component behavior without external dependencies
Better debugging - Easier to pinpoint issues in specific components
Comprehensive coverage - Test edge cases and error states more easily
Browser Mode for Component Testing
Component testing in Vitest uses Browser Mode to run tests in real browser environments using Playwright, WebdriverIO, or preview mode. This provides the most accurate testing environment as your components run in real browsers with actual DOM implementations, CSS rendering, and browser APIs.

Why Browser Mode?
Browser Mode is the recommended approach for component testing because it provides the most accurate testing environment. Unlike DOM simulation libraries, Browser Mode catches real-world issues that can affect your users.

TIP

Browser Mode catches issues that DOM simulation libraries might miss, including:

CSS layout and styling problems
Real browser API behavior
Accurate event handling and propagation
Proper focus management and accessibility features
Purpose of This Guide
This guide focuses specifically on component testing patterns and best practices using Vitest's capabilities. While many examples use Browser Mode (as it's the recommended approach), the focus here is on component-specific testing strategies rather than browser configuration details.

For detailed browser setup, configuration options, and advanced browser features, refer to the Browser Mode documentation.

What Makes a Good Component Test
Good component tests focus on behavior and user experience rather than implementation details:

Test the contract - How components receive inputs (props) and produce outputs (events, renders)
Test user interactions - Clicks, form submissions, keyboard navigation
Test edge cases - Error states, loading states, empty states
Avoid testing internals - State variables, private methods, CSS classes
Component Testing Hierarchy

1. Critical User Paths → Always test these
2. Error Handling      → Test failure scenarios
3. Edge Cases          → Empty data, extreme values
4. Accessibility       → Screen readers, keyboard nav
5. Performance         → Large datasets, animations
Component Testing Strategies
Isolation Strategy
Test components in isolation by mocking dependencies:


// For API requests, we recommend MSW (Mock Service Worker)
// See: https://vitest.dev/guide/mocking/requests
//
// vi.mock(import('../api/userService'), () => ({
//   fetchUser: vi.fn().mockResolvedValue({ name: 'John' })
// }))

// Mock child components to focus on parent logic
vi.mock(import('../components/UserCard'), () => ({
  default: vi.fn(({ user }) => `<div>User: ${user.name}</div>`)
}))

test('UserProfile handles loading and data states', async () => {
  const { getByText } = render(<UserProfile userId="123" />)

  // Test loading state
  await expect.element(getByText('Loading...')).toBeInTheDocument()

  // Test for data to load (expect.element auto-retries)
  await expect.element(getByText('User: John')).toBeInTheDocument()
})
Integration Strategy
Test component collaboration and data flow:


test('ProductList filters and displays products correctly', async () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
    { id: 2, name: 'Book', category: 'Education', price: 29 }
  ]

  const { getByLabelText, getByText } = render(
    <ProductList products={mockProducts} />
  )

  // Initially shows all products
  await expect.element(getByText('Laptop')).toBeInTheDocument()
  await expect.element(getByText('Book')).toBeInTheDocument()

  // Filter by category
  await userEvent.selectOptions(
    getByLabelText(/category/i),
    'Electronics'
  )

  // Only electronics should remain
  await expect.element(getByText('Laptop')).toBeInTheDocument()
  await expect.element(queryByText('Book')).not.toBeInTheDocument()
})
Testing Library Integration
While Vitest provides official packages for popular frameworks (vitest-browser-vue, vitest-browser-react, vitest-browser-svelte), you can integrate with Testing Library for frameworks not yet officially supported.

When to Use Testing Library
Your framework doesn't have an official Vitest browser package yet
You're migrating existing tests that use Testing Library
You prefer Testing Library's API for specific testing scenarios
Integration Pattern
The key is using page.elementLocator() to bridge Testing Library's DOM output with Vitest's browser mode APIs:


// For Solid.js components
import { render } from '@testing-library/solid'
import { page } from 'vitest/browser'

test('Solid component handles user interaction', async () => {
  // Use Testing Library to render the component
  const { baseElement, getByRole } = render(() =>
    <Counter initialValue={0} />
  )

  // Bridge to Vitest's browser mode for interactions and assertions
  const screen = page.elementLocator(baseElement)

  // Use Vitest's page queries for finding elements
  const incrementButton = screen.getByRole('button', { name: /increment/i })

  // Use Vitest's assertions and interactions
  await expect.element(screen.getByText('Count: 0')).toBeInTheDocument()

  // Trigger user interaction using Vitest's page API
  await incrementButton.click()

  await expect.element(screen.getByText('Count: 1')).toBeInTheDocument()
})
Available Testing Library Packages
Popular Testing Library packages that work well with Vitest:

@testing-library/solid - For Solid.js
@marko/testing-library- For Marko
@testing-library/svelte - Alternative to vitest-browser-svelte
@testing-library/vue- Alternative tovitest-browser-vue
Migration Path

If your framework gets official Vitest support later, you can gradually migrate by replacing Testing Library's render function while keeping most of your test logic intact.

Best Practices
1. Use Browser Mode for CI/CD
Ensure tests run in real browser environments for the most accurate testing. Browser Mode provides accurate CSS rendering, real browser APIs, and proper event handling.

2. Test User Interactions
Simulate real user behavior using Vitest's Interactivity API. Use page.getByRole() and userEvent methods as shown in our Advanced Testing Patterns:


// Good: Test actual user interactions
await page.getByRole('button', { name: /submit/i }).click()
await page.getByLabelText(/email/i).fill('user@example.com')

// Avoid: Testing implementation details
// component.setState({ email: 'user@example.com' })
3. Test Accessibility
Ensure components work for all users by testing keyboard navigation, focus management, and ARIA attributes. See our Testing Accessibility example for practical patterns:


// Test keyboard navigation
await userEvent.keyboard('{Tab}')
await expect.element(document.activeElement).toHaveFocus()

// Test ARIA attributes
await expect.element(modal).toHaveAttribute('aria-modal', 'true')
4. Mock External Dependencies
Focus tests on component logic by mocking APIs and external services. This makes tests faster and more reliable. See our Isolation Strategy for examples:


// For API requests, we recommend using MSW (Mock Service Worker)
// See: https://vitest.dev/guide/mocking/requests
// This provides more realistic request/response mocking

// For module mocking, use the import() syntax
vi.mock(import('../components/UserCard'), () => ({
  default: vi.fn(() => <div>Mocked UserCard</div>)
}))
5. Use Meaningful Test Descriptions
Write test descriptions that explain the expected behavior, not implementation details:


// Good: Describes user-facing behavior
test('shows error message when email format is invalid')
test('disables submit button while form is submitting')

// Avoid: Implementation-focused descriptions
test('calls validateEmail function')
test('sets isSubmitting state to true')
Advanced Testing Patterns
Testing Component State Management

// Testing stateful components and state transitions
test('ShoppingCart manages items correctly', async () => {
  const { getByText, getByTestId } = render(<ShoppingCart />)

  // Initially empty
  await expect.element(getByText('Your cart is empty')).toBeInTheDocument()

  // Add item
  await page.getByRole('button', { name: /add laptop/i }).click()

  // Verify state change
  await expect.element(getByText('1 item')).toBeInTheDocument()
  await expect.element(getByText('Laptop - $999')).toBeInTheDocument()

  // Test quantity updates
  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect.element(getByText('2 items')).toBeInTheDocument()
})
Testing Async Components with Data Fetching

// Option 1: Recommended - Use MSW (Mock Service Worker) for API mocking
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

// Set up MSW worker with API handlers
const worker = setupWorker(
  http.get('/api/users/:id', ({ params }) => {
    // Describe the happy path
    return HttpResponse.json({ id: params.id, name: 'John Doe', email: 'john@example.com' })
  })
)

// Start the worker before all tests
beforeAll(() => worker.start())
afterEach(() => worker.resetHandlers())
afterAll(() => worker.stop())

test('UserProfile handles loading, success, and error states', async () => {
  // Test success state
  const { getByText } = render(<UserProfile userId="123" />)
  // expect.element auto-retries until elements are found
  await expect.element(getByText('John Doe')).toBeInTheDocument()
  await expect.element(getByText('john@example.com')).toBeInTheDocument()

  // Test error state by overriding the handler for this test
  worker.use(
    http.get('/api/users/:id', () => {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 })
    })
  )

  const { getByText: getErrorText } = render(<UserProfile userId="999" />)
  await expect.element(getErrorText('Error: User not found')).toBeInTheDocument()
})
TIP

See more details on using MSW in the browser.

Testing Component Communication

// Test parent-child component interaction
test('parent and child components communicate correctly', async () => {
  const mockOnSelectionChange = vi.fn()

  const { getByText } = render(
    <ProductCatalog onSelectionChange={mockOnSelectionChange}>
      <ProductFilter />
      <ProductGrid />
    </ProductCatalog>
  )

  // Interact with child component
  await page.getByRole('checkbox', { name: /electronics/i }).click()

  // Verify parent receives the communication
  expect(mockOnSelectionChange).toHaveBeenCalledWith({
    category: 'electronics',
    filters: ['electronics']
  })

  // Verify other child component updates (expect.element auto-retries)
  await expect.element(getByText('Showing Electronics products')).toBeInTheDocument()
})
Testing Complex Forms with Validation

test('ContactForm handles complex validation scenarios', async () => {
  const mockSubmit = vi.fn()
  const { getByLabelText, getByText } = render(
    <ContactForm onSubmit={mockSubmit} />
  )

  const nameInput = page.getByLabelText(/full name/i)
  const emailInput = page.getByLabelText(/email/i)
  const messageInput = page.getByLabelText(/message/i)
  const submitButton = page.getByRole('button', { name: /send message/i })

  // Test validation triggers
  await submitButton.click()

  await expect.element(getByText('Name is required')).toBeInTheDocument()
  await expect.element(getByText('Email is required')).toBeInTheDocument()
  await expect.element(getByText('Message is required')).toBeInTheDocument()

  // Test partial validation
  await nameInput.fill('John Doe')
  await submitButton.click()

  await expect.element(getByText('Name is required')).not.toBeInTheDocument()
  await expect.element(getByText('Email is required')).toBeInTheDocument()

  // Test email format validation
  await emailInput.fill('invalid-email')
  await submitButton.click()

  await expect.element(getByText('Please enter a valid email')).toBeInTheDocument()

  // Test successful submission
  await emailInput.fill('john@example.com')
  await messageInput.fill('Hello, this is a test message.')
  await submitButton.click()

  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a test message.'
  })
})
Testing Error Boundaries

// Test how components handle and recover from errors
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Component error!')
  }
  return <div>Component working fine</div>
}

test('ErrorBoundary catches and displays errors gracefully', async () => {
  const { getByText, rerender } = render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThrowError shouldThrow={false} />
    </ErrorBoundary>
  )

  // Initially working
  await expect.element(getByText('Component working fine')).toBeInTheDocument()

  // Trigger error
  rerender(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )

  // Error boundary should catch it
  await expect.element(getByText('Something went wrong')).toBeInTheDocument()
})
Testing Accessibility

test('Modal component is accessible', async () => {
  const { getByRole, getByLabelText } = render(
    <Modal isOpen={true} title="Settings">
      <SettingsForm />
    </Modal>
  )

  // Test focus management - modal should receive focus when opened
  // This is crucial for screen reader users to know a modal opened
  const modal = getByRole('dialog')
  await expect.element(modal).toHaveFocus()

  // Test ARIA attributes - these provide semantic information to screen readers
  await expect.element(modal).toHaveAttribute('aria-labelledby') // Links to title element
  await expect.element(modal).toHaveAttribute('aria-modal', 'true') // Indicates modal behavior

  // Test keyboard navigation - Escape key should close modal
  // This is required by ARIA authoring practices
  await userEvent.keyboard('{Escape}')
  // expect.element auto-retries until modal is removed
  await expect.element(modal).not.toBeInTheDocument()

  // Test focus trap - tab navigation should cycle within modal
  // This prevents users from tabbing to content behind the modal
  const firstInput = getByLabelText(/username/i)
  const lastButton = getByRole('button', { name: /save/i })

  // Use click to focus on the first input, then test tab navigation
  await firstInput.click()
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}') // Shift+Tab goes backwards
  await expect.element(lastButton).toHaveFocus() // Should wrap to last element
})
Debugging Component Tests
1. Use Browser Dev Tools
Browser Mode runs tests in real browsers, giving you access to full developer tools. When tests fail, you can:

Open browser dev tools during test execution (F12 or right-click → Inspect)
Set breakpoints in your test code or component code
Inspect the DOM to see the actual rendered output
Check console errors for JavaScript errors or warnings
Monitor network requests to debug API calls
For headful mode debugging, add headless: false to your browser config temporarily.

2. Add Debug Statements
Use strategic logging to understand test failures:


test('debug form validation', async () => {
  render(<ContactForm />)

  const submitButton = page.getByRole('button', { name: /submit/i })
  await submitButton.click()

  // Debug: Check if element exists with different query
  const errorElement = page.getByText('Email is required')
  console.log('Error element found:', errorElement.length)

  await expect.element(errorElement).toBeInTheDocument()
})
3. Inspect Rendered Output
When components don't render as expected, investigate systematically:

Use Vitest's browser UI:

Run tests with browser mode enabled
Open the browser URL shown in the terminal to see tests running
Visual inspection helps identify CSS issues, layout problems, or missing elements
Test element queries:


// Debug why elements can't be found
const button = page.getByRole('button', { name: /submit/i })
console.log('Button count:', button.length) // Should be 1

// Try alternative queries if the first one fails
if (button.length === 0) {
  console.log('All buttons:', page.getByRole('button').length)
  console.log('By test ID:', page.getByTestId('submit-btn').length)
}
4. Verify Selectors
Selector issues are common causes of test failures. Debug them systematically:

Check accessible names:


// If getByRole fails, check what roles/names are available
const buttons = page.getByRole('button').all()
for (const button of buttons) {
  // Use element() to get the DOM element and access native properties
  const element = button.element()
  const accessibleName = element.getAttribute('aria-label') || element.textContent
  console.log(`Button: "${accessibleName}"`)
}
Test different query strategies:


// Multiple ways to find the same element using .or for auto-retrying
const submitButton = page.getByRole('button', { name: /submit/i }) // By accessible name
  .or(page.getByTestId('submit-button')) // By test ID
  .or(page.getByText('Submit')) // By exact text
// Note: Vitest doesn't have page.locator(), use specific getBy* methods instead
Common selector debugging patterns:


test('debug element queries', async () => {
  render(<LoginForm />)

  // Check if element is visible and enabled
  const emailInput = page.getByLabelText(/email/i)
  await expect.element(emailInput).toBeVisible() // Will show if element is visible and print DOM if not
})
5. Debugging Async Issues
Component tests often involve timing issues:


test('debug async component behavior', async () => {
  render(<AsyncUserProfile userId="123" />)

  // expect.element will automatically retry and show helpful error messages
  await expect.element(page.getByText('John Doe')).toBeInTheDocument()
})
Migration from Other Testing Frameworks
From Jest + Testing Library
Most Jest + Testing Library tests work with minimal changes:


// Before (Jest)
import { render, screen } from '@testing-library/react'

// After (Vitest)
import { render } from 'vitest-browser-react'
Key Differences
Use await expect.element() instead of expect() for DOM assertions
Use vitest/browser for user interactions instead of @testing-library/user-event
Browser Mode provides real browser environment for accurate testing
Learn More
Browser Mode Documentation
Assertion API
Interactivity API
Example Repository
Suggest changes to this page

# Visual Regression Testing
Vitest can run visual regression tests out of the box. It captures screenshots of your UI components and pages, then compares them against reference images to detect unintended visual changes.

Unlike functional tests that verify behavior, visual tests catch styling issues, layout shifts, and rendering problems that might otherwise go unnoticed without thorough manual testing.

Why Visual Regression Testing?
Visual bugs don’t throw errors, they just look wrong. That’s where visual testing comes in.

That button still submits the form... but why is it hot pink now?
The text fits perfectly... until someone views it on mobile
Everything works great... except those two containers are out of viewport
That careful CSS refactor works... but broke the layout on a page no one tests
Visual regression testing acts as a safety net for your UI, automatically catching these visual changes before they reach production.

Getting Started
Browser Rendering Differences

Visual regression tests are inherently unstable across different environments. Screenshots will look different on different machines because of:

Font rendering (the big one. Windows, macOS, Linux, they all render text differently)
GPU drivers and hardware acceleration
Whether you're running headless or not
Browser settings and versions
...and honestly, sometimes just the phase of the moon
That's why Vitest includes the browser and platform in screenshot names (like button-chromium-darwin.png).

For stable tests, use the same environment everywhere. We strongly recommend cloud services like Azure App Testing or Docker containers.

Visual regression testing in Vitest can be done through the toMatchScreenshot assertion:


import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

test('hero section looks correct', async () => {
  // ...the rest of the test

  // capture and compare screenshot
  await expect(page.getByTestId('hero')).toMatchScreenshot('hero-section')
})
Creating References
When you run a visual test for the first time, Vitest creates a reference (also called baseline) screenshot and fails the test with the following error message:


expect(element).toMatchScreenshot()

No existing reference screenshot found; a new one was created. Review it before running tests again.

Reference screenshot:
  tests/__screenshots__/hero.test.ts/hero-section-chromium-darwin.png
This is normal. Check that the screenshot looks right, then run the test again. Vitest will now compare future runs against this baseline.

TIP

Reference screenshots live in __screenshots__ folders next to your tests. Don't forget to commit them!

Screenshot Organization
By default, screenshots are organized as:


.
├── __screenshots__
│   └── test-file.test.ts
│       ├── test-name-chromium-darwin.png
│       ├── test-name-firefox-linux.png
│       └── test-name-webkit-win32.png
└── test-file.test.ts
The naming convention includes:

Test name: either the first argument of the toMatchScreenshot() call, or automatically generated from the test's name.
Browser name: chrome, chromium, firefox or webkit.
Platform: aix, darwin, freebsd, linux, openbsd, sunos, or win32.
This ensures screenshots from different environments don't overwrite each other.

Updating References
When you intentionally change your UI, you'll need to update the reference screenshots:


vitest --update
Review updated screenshots before committing to make sure changes are intentional.

How Visual Tests Work
Visual regression tests need stable screenshots to compare against. But pages aren't instantly stable as images load, animations finish, fonts render, and layouts settle.

Vitest handles this automatically through "Stable Screenshot Detection":

Vitest takes a first screenshot (or uses the reference screenshot if available) as baseline
It takes another screenshot and compares it with the baseline
If the screenshots match, the page is stable and testing continues
If they differ, Vitest uses the newest screenshot as the baseline and repeats
This continues until stability is achieved or the timeout is reached
This ensures that transient visual changes (like loading spinners or animations) don't cause false failures. If something never stops animating though, you'll hit the timeout, so consider disabling animations during testing.

If a stable screenshot is captured after retries (one or more) and a reference screenshot exists, Vitest performs a final comparison with the reference using createDiff: true. This will generate a diff image if they don't match.

During stability detection, Vitest calls comparators with createDiff: false since it only needs to know if screenshots match. This keeps the detection process fast.

Configuring Visual Tests
Global Configuration
Configure visual regression testing defaults in your Vitest config:

vitest.config.ts

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          comparatorOptions: {
            // 0-1, how different can colors be?
            threshold: 0.2,
            // 1% of pixels can differ
            allowedMismatchedPixelRatio: 0.01,
          },
        },
      },
    },
  },
})
Per-Test Configuration
Override global settings for specific tests:


await expect(element).toMatchScreenshot('button-hover', {
  comparatorName: 'pixelmatch',
  comparatorOptions: {
    // more lax comparison for text-heavy elements
    allowedMismatchedPixelRatio: 0.1,
  },
})
Best Practices
Test Specific Elements
Unless you explicitly want to test the whole page, prefer capturing specific components to reduce false positives:


// ❌ Captures entire page; prone to unrelated changes
await expect(page).toMatchScreenshot()

// ✅ Captures only the component under test
await expect(page.getByTestId('product-card')).toMatchScreenshot()
Handle Dynamic Content
Dynamic content like timestamps, user data, or random values will cause tests to fail. You can either mock the sources of dynamic content or mask them when using the Playwright provider by using the mask option in screenshotOptions.


await expect(page.getByTestId('profile')).toMatchScreenshot({
  screenshotOptions: {
    mask: [page.getByTestId('last-seen')],
  },
})
Disable Animations
Animations can cause flaky tests. Disable them during testing by injecting a custom CSS snippet:


*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
TIP

When using the Playwright provider, animations are automatically disabled when using the assertion: the animations option's value in screenshotOptions is set to "disabled" by default.

Set Appropriate Thresholds
Tuning thresholds is tricky. It depends on the content, test environment, what's acceptable for your app, and might also change based on the test.

Vitest does not set a default for the mismatching pixels, that's up for the user to decide based on their needs. The recommendation is to use allowedMismatchedPixelRatio, so that the threshold is computed on the size of the screenshot and not a fixed number.

When setting both allowedMismatchedPixelRatio and allowedMismatchedPixels, Vitest uses whichever limit is stricter.

Set consistent viewport sizes
As the browser instance might have a different default size, it's best to set a specific viewport size, either on the test or the instance configuration:


await page.viewport(1280, 720)
vitest.config.ts

import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        {
          browser: 'chromium',
          viewport: { width: 1280, height: 720 },
        },
      ],
    },
  },
})
Use Git LFS
Store reference screenshots in Git LFS if you plan to have a large test suite.

Debugging Failed Tests
When a visual test fails, Vitest provides three images to help debug:

Reference screenshot: the expected baseline image
Actual screenshot: what was captured during the test
Diff image: highlights the differences, but this might not get generated
You'll see something like:


expect(element).toMatchScreenshot()

Screenshot does not match the stored reference.
245 pixels (ratio 0.03) differ.

Reference screenshot:
  tests/__screenshots__/button.test.ts/button-chromium-darwin.png

Actual screenshot:
  tests/.vitest-attachments/button.test.ts/button-chromium-darwin-actual.png

Diff image:
  tests/.vitest-attachments/button.test.ts/button-chromium-darwin-diff.png
Understanding the diff image
Red pixels are areas that differ between reference and actual
Yellow pixels are anti-aliasing differences (when anti-alias is not ignored)
Transparent/original are unchanged areas
TIP

If the diff is mostly red, something's really wrong. If it's speckled with a few red pixels around text, you probably just need to bump your threshold.

Common Issues and Solutions
False Positives from Font Rendering
Font availability and rendering varies significantly between systems. Some possible solutions might be to:

Use web fonts and wait for them to load:


// wait for fonts to load
await document.fonts.ready

// continue with your tests
Increase comparison threshold for text-heavy areas:


await expect(page.getByTestId('article-summary')).toMatchScreenshot({
  comparatorName: 'pixelmatch',
  comparatorOptions: {
    // 10% of the pixels are allowed to change
    allowedMismatchedPixelRatio: 0.1,
  },
})
Use a cloud service or containerized environment for consistent font rendering.

Flaky Tests or Different Screenshot Sizes
If tests pass and fail randomly, or if screenshots have different dimensions between runs:

Wait for everything to load, including loading indicators
Set explicit viewport sizes: await page.viewport(1920, 1080)
Check for responsive behavior at viewport boundaries
Check for unintended animations or transitions
Increase test timeout for large screenshots
Use a cloud service or containerized environment
Visual Regression Testing for Teams
Remember when we mentioned visual tests need a stable environment? Well, here's the thing: your local machine isn't it.

For teams, you've basically got three options:

Self-hosted runners, complex to set up, painful to maintain
GitHub Actions, free (for open source), works with any provider
Cloud services, like Azure App Testing, built for this exact problem
We'll focus on options 2 and 3 since they're the quickest to get running.

To be upfront, the main trade-offs for each are:

GitHub Actions: visual tests only run in CI (developers can't run them locally)
Microsoft's service: works everywhere but costs money and only works with Playwright
GitHub ActionsAzure App Testing
The trick here is keeping visual tests separate from your regular tests, otherwise, you'll waste hours checking failing logs of screenshot mismatches.

Organizing Your Tests
First, isolate your visual tests. Stick them in a visual folder (or whatever makes sense for your project):

package.json

{
  "scripts": {
    "test:unit": "vitest --exclude tests/visual/*.test.ts",
    "test:visual": "vitest tests/visual/*.test.ts"
  }
}
Now developers can run npm run test:unit locally without visual tests getting in the way. Visual tests stay in CI where the environment is consistent.

Alternative

Not a fan of glob patterns? You could also use separate Test Projects instead and run them using:

vitest --project unit
vitest --project visual
CI Setup
Your CI needs browsers installed. How you do this depends on your provider:

PlaywrightWebdriverIO
Playwright makes this easy. Just pin your version and add this before running tests:

.github/workflows/ci.yml

# ...the rest of the workflow
- name: Install Playwright Browsers
  run: npx --no playwright install --with-deps --only-shell
Then run your visual tests:

.github/workflows/ci.yml

# ...the rest of the workflow
# ...browser setup
- name: Visual Regression Testing
  run: npm run test:visual
The Update Workflow
Here's where it gets interesting. You don't want to update screenshots on every PR automatically (chaos!). Instead, create a manually-triggered workflow that developers can run when they intentionally change the UI.

The workflow below:

Only runs on feature branches (never on main)
Credits the person who triggered it as co-author
Prevents concurrent runs on the same branch
Shows a nice summary:
When screenshots changed, it lists what changed

Action summary after updates
When nothing changed, well, it tells you that too

Action summary after no updates
TIP

This is just one approach. Some teams prefer PR comments (/update-screenshots), others use labels. Adjust it to fit your workflow!

The important part is having a controlled way to update baselines.

.github/workflows/update-screenshots.yml

name: Update Visual Regression Screenshots

on:
  workflow_dispatch: # manual trigger only

env:
  AUTHOR_NAME: 'github-actions[bot]'
  AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com'
  COMMIT_MESSAGE: |
    test: update visual regression screenshots

    Co-authored-by: ${{ github.actor }} <${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com>

jobs:
  update-screenshots:
    runs-on: ubuntu-24.04

    # safety first: don't run on main
    if: github.ref_name != github.event.repository.default_branch

    # one at a time per branch
    concurrency:
      group: visual-regression-screenshots@${{ github.ref_name }}
      cancel-in-progress: true

    permissions:
      contents: write # needs to push changes

    steps:
      - name: Checkout selected branch
        uses: actions/checkout@v4
        with:
          ref: ${{ github.ref_name }}
          # use PAT if triggering other workflows
          # token: ${{ secrets.GITHUB_TOKEN }}

      - name: Configure Git
        run: |
          git config --global user.name "${{ env.AUTHOR_NAME }}"
          git config --global user.email "${{ env.AUTHOR_EMAIL }}"

      # your setup steps here (node, pnpm, whatever)
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx --no playwright install --with-deps --only-shell

      # the magic happens below 🪄
      - name: Update Visual Regression Screenshots
        run: npm run test:visual --update

      # check what changed
      - name: Check for changes
        id: check_changes
        run: |
          CHANGED_FILES=$(git status --porcelain | awk '{print $2}')
          if [ "${CHANGED_FILES:+x}" ]; then
            echo "changes=true" >> $GITHUB_OUTPUT
            echo "Changes detected"

            # save the list for the summary
            echo "changed_files<<EOF" >> $GITHUB_OUTPUT
            echo "$CHANGED_FILES" >> $GITHUB_OUTPUT
            echo "EOF" >> $GITHUB_OUTPUT
            echo "changed_count=$(echo "$CHANGED_FILES" | wc -l)" >> $GITHUB_OUTPUT
          else
            echo "changes=false" >> $GITHUB_OUTPUT
            echo "No changes detected"
          fi

      # commit if there are changes
      - name: Commit changes
        if: steps.check_changes.outputs.changes == 'true'
        run: |
          git add -A
          git commit -m "${{ env.COMMIT_MESSAGE }}"

      - name: Push changes
        if: steps.check_changes.outputs.changes == 'true'
        run: git push origin ${{ github.ref_name }}

      # pretty summary for humans
      - name: Summary
        run: |
          if [[ "${{ steps.check_changes.outputs.changes }}" == "true" ]]; then
            echo "### 📸 Visual Regression Screenshots Updated" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "Successfully updated **${{ steps.check_changes.outputs.changed_count }}** screenshot(s) on \`${{ github.ref_name }}\`" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "#### Changed Files:" >> $GITHUB_STEP_SUMMARY
            echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
            echo "${{ steps.check_changes.outputs.changed_files }}" >> $GITHUB_STEP_SUMMARY
            echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "✅ The updated screenshots have been committed and pushed. Your visual regression baseline is now up to date!" >> $GITHUB_STEP_SUMMARY
          else
            echo "### ℹ️ No Screenshot Updates Required" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "The visual regression test command ran successfully but no screenshots needed updating." >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "All screenshots are already up to date! 🎉" >> $GITHUB_STEP_SUMMARY
          fi
So Which One?
Both approaches work. The real question is what pain points matter most to your team.

If you're already deep in the GitHub ecosystem, GitHub Actions is hard to beat. Free for open source, works with any browser provider, and you control everything.

The downside? That "works on my machine" conversation when someone generates screenshots locally and they don't match CI expectations anymore.

A cloud service makes sense if developers need to run visual tests locally.

Some teams have designers checking their work or developers who prefer catching issues before pushing. It allows skipping the push-wait-check-fix-push cycle.

Still on the fence? Start with GitHub Actions. You can always add a cloud service later if local testing becomes a pain point.

ARIA Snapshotsexperimental 4.1.4+
ARIA snapshots let you test the accessibility structure of your pages. Instead of asserting against raw HTML or visual output, you assert against the accessibility tree — the same structure that screen readers and other assistive technologies use.

Given this HTML:


<nav aria-label="Main">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
You can assert its accessibility tree:


await expect.element(page.getByRole('navigation')).toMatchAriaInlineSnapshot(`
  - navigation "Main":
    - link "Home":
      - /url: /
    - link "About":
      - /url: /about
`)
This catches accessibility regressions: missing labels, broken roles, incorrect heading levels, and more — things that DOM snapshots would miss. Even if the underlying HTML structure changes, the assertion would not fail as long as content matches semantically.

Snapshot Workflow
ARIA snapshots use the same Vitest snapshot workflow as other snapshot assertions. File snapshots, inline snapshots, --update / -u, watch mode updates, and CI snapshot behavior all work the same way.

See the main Snapshot guide for the general snapshot workflow, update behavior, and review guidelines.

Basic Usage
Given a page with this HTML:


<form aria-label="Log In">
  <input aria-label="Email" />
  <input aria-label="Password" type="password" />
  <button>Submit</button>
</form>
File Snapshots
Use toMatchAriaSnapshot() to store the snapshot in a .snap file alongside your test:

basic.test.ts

import { expect, test } from 'vitest'

test('login form', async () => {
  await expect.element(page.getByRole('form')).toMatchAriaSnapshot()
})
On first run, Vitest generates a snapshot file entry:

__snapshots__/basic.test.ts.snap

// Vitest Snapshot ...

exports[`login form 1`] = `
- form "Log In":
  - textbox "Email"
  - textbox "Password"
  - button "Submit"
`
Inline Snapshots
Use toMatchAriaInlineSnapshot() to store the snapshot directly in the test file:


import { expect, test } from 'vitest'

test('login form', async () => {
  await expect.element(page.getByRole('form')).toMatchAriaInlineSnapshot(`
    - form "Log In":
      - textbox "Email"
      - textbox "Password"
      - button "Submit"
  `)
})
Browser Mode Retry Behavior
In Browser Mode, expect.element() polls the DOM and waits for the accessibility tree to stabilize before evaluating the result. On each poll, the matcher re-queries the element and re-captures the accessibility tree. The snapshot is considered stable when two consecutive polls produce the same output.


await expect.element(page.getByRole('form')).toMatchAriaInlineSnapshot(`
  - form "Log In":
    - textbox "Email"
    - textbox "Password"
    - button "Submit"
`)
On first run or with --update, the stable result is written as the new snapshot.

When an existing snapshot is present, the matcher also checks whether the stable result matches. If it does not, polling resets and continues — giving the DOM time to reach the expected state. This handles cases like animations, async rendering, or delayed state updates where the tree may briefly stabilize in an intermediate state before settling into its final form.

Preserving Hand-Edited Patterns
When you hand-edit a snapshot to use regex patterns, those patterns survive --update. Only the literal parts that changed are overwritten. This lets you write flexible assertions that don't break when content changes.

Example
Step 1. Your shopping cart page renders this HTML:


<h1>Your Cart</h1>
<ul aria-label="Cart Items">
  <li>Wireless Headphones — $79.99</li>
</ul>
<button>Checkout</button>
You run your test for the first time with --update. Vitest generates the snapshot:


- heading "Your Cart" [level=1]
- list "Cart Items":
    - listitem: Wireless Headphones — $79.99
- button "Checkout"
Step 2. The item names and prices are seeded test data that may change. You hand-edit those lines to regex patterns, but keep the stable structure as literals:


- heading "Your Cart" [level=1]
- list "Cart Items":
    - listitem: /.+ — \$\d+\.\d+/
- button "Checkout"
Step 3. Later, a developer renames the button from "Checkout" to "Place Order". Running --update updates that literal but preserves your regex patterns:


- heading "Your Cart" [level=1]
- list "Cart Items":
    - listitem: /.+ — \$\d+\.\d+/
- button "Place Order"   👈 New snapshot updated with new string
The regex patterns you wrote in step 2 are preserved because they still match the actual content. Only the mismatched literal "Checkout" was updated to "Place Order".

Snapshot Format
ARIA snapshots use a YAML-like syntax. Each line represents a node in the accessibility tree.

INFO

ARIA snapshot templates use a subset of YAML syntax. Only the features needed for accessibility trees are supported: scalar values, nested mappings via indentation, and sequences (- item). Advanced YAML features like anchors, tags, flow collections, and multi-line scalars are not supported.

Captured text is also whitespace-normalized before it is rendered into the snapshot. Newlines, <br> line breaks, tabs, and repeated whitespace collapse to single spaces, so multi-line DOM text is emitted as a single-line snapshot value.

Each accessible element in the tree is represented as a YAML node:


- role "name" [attribute=value]
role: The ARIA role of the element, such as heading, list, listitem, or button
"name": The accessible name, when present. Quoted strings match exact values, and /patterns/ match regular expressions
[attribute=value]: Accessibility states and properties such as checked, disabled, expanded, level, pressed, or selected
These values come from ARIA attributes and the browser's accessibility tree, including semantics inferred from native HTML elements.

Because ARIA snapshots reflect the browser's accessibility tree, content excluded from that tree, such as aria-hidden="true" or display: none, does not appear in the snapshot.

Roles and Accessible Names
For example:


<button>Submit</button>
<h1>Welcome</h1>
<a href="/">Home</a>
<input aria-label="Email" />

- button "Submit"
- heading "Welcome" [level=1]
- link "Home"
- textbox "Email"
The role usually comes from the element's native semantics, though it can also be defined with ARIA. The accessible name is computed from text content, associated labels, aria-label, aria-labelledby, and related naming rules.

For a closer look at how names are computed, see Accessible Name and Description Computation.

Some content appears in the snapshot as a text node instead of a role-based element:


<span>Hello world</span>

- text: Hello world
Text values are always serialized on a single line after whitespace normalization. For example:


<p>
Line 1
Line 2<br />Line 3
Line 4
</p>

- paragraph: Line 1 Line 2 Line 3 Line 4
Children
Child elements appear nested under their parent:


<ul>
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>

- list:
    - listitem: First
    - listitem: Second
    - listitem: Third
If the parent has an accessible name, the snapshot includes it before the nested children:


<nav aria-label="Main">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

- navigation "Main":
    - link "Home"
    - link "About"
If an element only contains a single text child and has no other properties, the text is rendered inline:


<p>Hello world</p>

- paragraph: Hello world
Attributes
ARIA states and properties appear in brackets:

HTML	Snapshot
<input type="checkbox" checked aria-label="Agree">	- checkbox "Agree" [checked]
<input type="checkbox" aria-checked="mixed" aria-label="Select all">	- checkbox "Select all" [checked=mixed]
<button aria-disabled="true">Submit</button>	- button "Submit" [disabled]
<button aria-expanded="true">Menu</button>	- button "Menu" [expanded]
<h2>Title</h2>	- heading "Title" [level=2]
<button aria-pressed="true">Bold</button>	- button "Bold" [pressed]
<button aria-pressed="mixed">Bold</button>	- button "Bold" [pressed=mixed]
<option selected>English</option>	- option "English" [selected]
Attributes only appear when they are active. A button that is not disabled simply has no [disabled] attribute — there is no [disabled=false].

Pseudo-Attributes
Some DOM properties that aren't part of ARIA but are useful for testing are exposed with a / prefix:

/url:
Links include their URL:


<a href="/">Home</a>

- link "Home":
    - /url: /
/placeholder:
Textboxes can include their placeholder text:


<input aria-label="Email" placeholder="user@example.com" />

- textbox "Email":
    - /placeholder: user@example.com
When does /placeholder: appear?

The /placeholder: pseudo-attribute only appears when the placeholder text is different from the accessible name. When an input has a placeholder but no aria-label or associated <label>, the browser uses the placeholder as the accessible name. In that case, the placeholder information is already in the name and is not duplicated.

When placeholder is the accessible name:

<input placeholder="Search" />

- textbox "Search"
When placeholder differs from the accessible name:

<input placeholder="Search" aria-label="Search products" />

- textbox "Search products":
    - /placeholder: Search
Matching
Regular Expressions
Use regex patterns to match names flexibly:


<h1>Welcome, Alice</h1>
<a href="https://example.com/profile/123">Profile</a>

- heading /Welcome, .*/
- link "Profile":
    - /url: /https:\/\/example\.com\/.*/
Regex also works in pseudo-attribute values:


<input aria-label="Search" placeholder="Type to search..." />

- textbox "Search":
    - /placeholder: /Type .*/
Escaping backslashes in regex patterns

Snapshots are stored as JavaScript strings — in backtick-delimited template literals for inline snapshots and in .snap files. Because of this, backslashes need to be doubled when you hand-edit a snapshot to add a regex pattern.

For example, to match one or more digits with \d+:


// ✅ Correct — double backslash
await expect.element(button).toMatchAriaInlineSnapshot(`
  - button: /item \\d+/
`)

// ❌ Wrong — single backslash is consumed by JS, regex sees "d+" instead of "\d+"
await expect.element(button).toMatchAriaInlineSnapshot(`
  - button: /item \d+/
`)
This applies to both inline snapshots and .snap files. When Vitest auto-generates or updates a snapshot, escaping is handled automatically — you only need to worry about this when hand-editing regex patterns.

Child Matching
The /children directive controls how a node's children are compared against the template. There are three modes:

Partial Matching (default)
By default (no /children directive), templates use contain semantics — extra children in the actual tree are allowed as long as all template children appear as an ordered subsequence. This is the same as /children: contain.


<main>
  <h1>Welcome</h1>
  <p>Some intro text</p>
  <button>Get Started</button>
</main>

// This passes — the template children are a subset of the actual children
await expect.element(page.getByRole('main')).toMatchAriaInlineSnapshot(`
  - main:
    - heading "Welcome" [level=1]
`)
This is useful for focused, resilient tests that don't break when unrelated content is added.

Exact Matching (/children: equal)
Requires that the node's immediate children match the template exactly — same count, same order. No extra children are allowed at this level.


<ul aria-label="Features">
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>

// This FAILS — the list has 3 items but the template only lists 2
await expect.element(page.getByRole('list')).toMatchAriaInlineSnapshot(`
  - list "Features":
    - /children: equal
    - listitem: Feature A
    - listitem: Feature B
`)

// This PASSES — all 3 items are listed
await expect.element(page.getByRole('list')).toMatchAriaInlineSnapshot(`
  - list "Features":
    - /children: equal
    - listitem: Feature A
    - listitem: Feature B
    - listitem: Feature C
`)
The strict matching only applies at the level where /children is placed. Descendants of each listitem still use the default contain semantics.

Deep Exact Matching (/children: deep-equal)
Like equal, but the strict matching propagates to all descendants. Every level of nesting must match exactly — same count, same order, no extra nodes at any depth.


await expect.element(page.getByRole('navigation')).toMatchAriaInlineSnapshot(`
  - navigation "Main":
    - /children: deep-equal
    - link "Home":
      - /url: /
    - link "About":
      - /url: /about
`)
With deep-equal, every child of each link must also match exactly. If a link had an extra child node not listed in the template, the assertion would fail.

Comparison
Mode	Directive	Behavior
Partial	(default) or /children: contain	Template children are an ordered subsequence — extra actual children are ignored
Exact	/children: equal	Immediate children must match exactly; descendants still use partial matching
Deep exact	/children: deep-equal	All children at every depth must match exactly
S