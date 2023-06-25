# `@tanstack-query-with-orbitjs/core`

A library for using [TanStack Query](https://tanstack.com/query) with [Orbit.js](https://orbitjs.com/).

This is the UI framework agnostic _core_, which could be seen as corresponding to [`@tanstack/query-core`](https://github.com/TanStack/query/tree/v4.16.1/packages/query-core) in original TanStack Query.

## Usage

Install using your preferred Node.js package manager. For example:

```sh
pnpm add @tanstack-query-with-orbitjs/core
```

`@tanstack-query-with-orbitjs/core` comes with three new classes that enable the integration between TanStack Query and Orbit.js:

-   **`LiveQueryClient`**<br/>
    Replacement for
    [`QueryClient`](https://tanstack.com/query/v4/docs/reference/QueryClient).
    (Extends
    [`QueryClient`](https://tanstack.com/query/v4/docs/reference/QueryClient)
    class.)

-   **`LiveQueryObserver`**<br/>
    Replacement for
    [`QueryObserver`](https://tanstack.com/query/v4/docs/reference/QueryObserver).
    (Extends
    [`QueryObserver`](https://tanstack.com/query/v4/docs/reference/QueryObserver)
    class.)

-   **`LiveInfiniteQueryObserver`**<br/>
    Replacement for
    [`InfiniteQueryObserver`](https://tanstack.com/query/v4/docs/reference/InfiniteQueryObserver).
    (Extends
    [`InfiniteQueryObserver`](https://tanstack.com/query/v4/docs/reference/InfiniteQueryObserver)
    class.)

It also exports the following types:

-   **`LiveQueryClientConfig`**<br/>
    Interface describing the config passed to the `LiveQueryClient` constructor. (Extends
    [`QueryClientConfig`](https://github.com/TanStack/query/blob/v4.16.1/packages/query-core/src/types.ts#L708-L713)
    interface.)

-   **`QueryMeta`**<br/>
    Module augmented, and declaration merged more specific version of
    the
    [`QueryMeta`](https://github.com/TanStack/query/blob/v4.16.1/packages/query-core/src/types.ts#L51-L53)
    interface.

-   **`GetQueryOrExpressions`**<br/>
    Type which describes the first parameter of the [`MemorySource#query`](https://orbitjs.com/docs/api/memory/classes/MemorySource#query) method.
