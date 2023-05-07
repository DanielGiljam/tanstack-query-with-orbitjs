# Related work

## Overview

### CushionDB

[CushionDB](https://cushiondb.github.io/) is a small open-source project
created by three software developers: [Avshar
Kirksall](https://github.com/avshrk), [Daniel
Rote](https://github.com/drote) and [Jaron
Truman](https://github.com/jtruman88). It describes itself as an
"open-source database for progressive web applications". It especially
focuses on offline-first data management and synchronization.

### Dexie.js

[Dexie.js](https://dexie.org/) is one of the most popular open-source
libraries for interacting with
[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API),
the web browser's built-in database for storing and retrieving large
amounts of structured data. The author of [Dexie.js](https://dexie.org/)
is [David Fahlander](https://github.com/dfahlander). It describes itself
as a "Minimalistic Wrapper for IndexedDB". Arguably, it isn't that
minimalistic. But it has a lot of neat features such as [live
queries](<https://dexie.org/docs/liveQuery()>) and [browser tab
sync](https://dexie.org/docs/Dexie/Dexie.on.storagemutated), to name a
few.

### Orbit.js

[Orbit.js](https://orbitjs.com/) is an open-source project from
[Cerebris Corporation](https://www.cerebris.com/), a "small company with
a BIG open source presence"[^6]. It describes itself as

-   "The Universal Data Layer" ([website](https://orbitjs.com/)
    tagline),

-   "Composable data framework for ambitious web applications"
    (description on [GitHub](https://github.com/orbitjs/orbit)),

-   and "Orbit is a composable data framework for managing the complex
    needs of today's web applications" (first sentence in the
    [README.md](https://github.com/orbitjs/orbit)).

The author and core maintainer of [Orbit.js](https://orbitjs.com/) is
[Dan Gebhardt](https://github.com/dgeb)[^6], Principal Software Engineer at
and Co-Founder of [Cerebris Corporation](https://www.cerebris.com/)[^7].
He's also a core maintainer of [Ember.js](https://emberjs.com/) and
[Glimmer.js](https://glimmerjs.com/) and the
[JSON:API](https://jsonapi.org/) specification.

### SQLite as a WebAssembly module

[`wa-sqlite`](https://github.com/rhashimoto/wa-sqlite) by [Ryo
Hashimoto](https://github.com/rhashimoto) is a
[WebAssembly](https://webassembly.org/) build of
[SQLite](https://sqlite.org/index.html) which effectively brings a
fully-fledged relational database to the web platform.

## Comparison

<p style={{marginBottom: 0}}><i><small>Table 1. Related work: Comparison: Modularity</small></i></p>

|                                              | **Query** | **Firestore** | **CushionDB** | **Dexie.js** | **Orbit.js** | **SQLite** |
| -------------------------------------------- | --------- | ------------- | ------------- | ------------ | ------------ | ---------- |
| [Full stack](methods#full-stack)             |           | ✓             | ✓             |              |              | ✓          |
| [Backend-agnostic](methods#backend-agnostic) | ✓         |               |               | ✓            | ✓            | ✓          |
| [Modular](methods#modular)                   |           |               |               |              | ✓            |            |

<p style={{marginBottom: 0}}><i><small>Table 2. Related work: Comparison: Developer experience</small></i></p>

|                                                                        | **Query** | **Firestore** | **CushionDB** | **Dexie.js** | **Orbit.js** | **SQLite** |
| ---------------------------------------------------------------------- | --------- | ------------- | ------------- | ------------ | ------------ | ---------- |
| [1st-class TypeScript support](methods#first-class-typescript-support) | ✓         | ✓             |               | ✓            | ✓            | ✓          |
| [Graphical developer tools](methods##graphical-developer-tools)        | ✓         |               |               |              |              |            |

<p style={{marginBottom: 0}}><i><small>Table 3. Related work: Comparison: UI framework integrations</small></i></p>

|                                                                | **Query** | **Firestore** | **CushionDB** | **Dexie.js** | **Orbit.js** | **SQLite** |
| -------------------------------------------------------------- | --------- | ------------- | ------------- | ------------ | ------------ | ---------- |
| [1st-class React support](methods#first-class-react-support)   | ✓         |               |               | ✓            |              |            |
| [1st-class Solid support](methods#first-class-solid-support)   | ✓         |               |               |              |              |            |
| [1st-class Vue support](methods#first-class-vue-support)       | ✓         |               |               | ✓            |              |            |
| [1st-class Svelte support](methods#first-class-svelte-support) | ✓         |               |               | ✓            |              |            |

<p style={{marginBottom: 0}}><i><small>Table 4. Related work: Comparison: ORM capabilities</small></i></p>

|                                                        | **Query** | **Firestore** | **CushionDB** | **Dexie.js** | **Orbit.js** | **SQLite** |
| ------------------------------------------------------ | --------- | ------------- | ------------- | ------------ | ------------ | ---------- |
| [Relationship tracking](methods#relationship-tracking) |           |               |               |              | ✓            | ✓          |
| [Live queries](methods#live-queries)                   |           | ✓             |               | ✓            | ✓            |            |

<p style={{marginBottom: 0}}><i><small>Table 5. Related work: Comparison: Consideration of asynchronicity and concurrency</small></i></p>

|                                                  | **Query** | **Firestore** | **CushionDB** | **Dexie.js** | **Orbit.js** | **SQLite** |
| ------------------------------------------------ | --------- | ------------- | ------------- | ------------ | ------------ | ---------- |
| [Optimistic updates](methods#optimistic-updates) | ✓         | ✓             |               |              | ✓            |            |
| [Browser tab sync](methods#browser-tab-sync)     | ✓         | ✓             |               | ✓            |              |            |

<p style={{marginBottom: 0}}><i><small>Table 6. Related work: Comparison: Offline support</small></i></p>

|                                                                                                 | **Query** | **Firestore** | **CushionDB** | **Dexie.js** | **Orbit.js** | **SQLite** |
| ----------------------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ------------ | ------------ | ---------- |
| [Offline-first](methods#offline-first)                                                          |           | ✓             | ✓             |              | ✓            |            |
| [Data persistence](methods#data-persistence)                                                    | ✓         | ✓             | ✓             | ✓            | ✓            | ✓          |
| [Creating when offline, publish when online](methods#creating-when-offline-publish-when-online) |           | ✓             | ✓             |              | ✓            |            |

Query stands for [TanStack Query](https://tanstack.com/query).

Firestore stands for the [Cloud
Firestore](https://firebase.google.com/products/firestore) client-side
SDK.

SQLite stands for [SQLite as a WebAssembly
module](#sqlite-as-a-webassembly-module).

### Modularity

#### Full stack

[Firestore](https://firebase.google.com/docs/firestore) and
[CushionDB](#cushiondb) are both entirely full stack solutions.
[TanStack Query](https://tanstack.com/query), [Orbit.js](#orbitjs) and
[SQLite](#sqlite-as-a-webassembly-module) are entirely client-side
solutions. [Dexie.js](#dexiejs) is a client-side solution, but on
[Dexie.js](#dexiejs)' home page, as of writing this, you can find a
link to [Dexie Cloud<sup>BETA</sup>](https://dexie.org/cloud/), a cloud-hosted
sync service for [Dexie.js](#dexiejs).

#### Backend-agnostic

[Firestore](https://firebase.google.com/docs/firestore) and
[CushionDB](#cushiondb) are not backend-agnostic solutions. [TanStack
Query](https://tanstack.com/query), [Dexie.js](#dexiejs),
[Orbit.js](#orbitjs) and [SQLite](#sqlite-as-a-webassembly-module) are
backend-agnostic solutions.

#### Modular

[Orbit.js](#orbitjs) is the only solution out of the bunch that is
truly modular in the sense that it's shipped as a toolkit where you can
pick and use the tools you like and discard the rest and less like a
solution that you either must buy into entirely or not at all.

### Developer experience

#### 1st-class TypeScript support

[TanStack Query](https://tanstack.com/query),
[Firestore](https://firebase.google.com/docs/firestore),
[Dexie.js](#dexiejs) and [Orbit.js](#orbitjs) are all written in
[TypeScript](https://www.typescriptlang.org/). The source for the
JavaScript bindings in [`wa-sqlite`](#sqlite-as-a-webassembly-module) is
written in JavaScript, but the library ships with its own
[TypeScript](https://www.typescriptlang.org/) type definition
declaration files. [CushionDB](#cushiondb) is written in JavaScript.

#### Graphical developer tools

[TanStack Query](https://tanstack.com/query) is the only solution out of
the bunch that has graphical developer tools.

### UI framework integrations

#### 1st-class React support

[TanStack Query](https://tanstack.com/query) and [Dexie.js](#dexiejs)
both have 1st-class support for [React](https://react.dev/):

-   [React Query | TanStack Query
    Docs](https://tanstack.com/query/v4/docs/react/overview)

-   [Get started with Dexie in
    React](https://dexie.org/docs/Tutorial/React)

The GitHub organization [Orbit.js](https://github.com/orbitjs) has a
small package called
[`react-orbit`](https://github.com/orbitjs/react-orbit), but it's very
minimal, so I would categorize it as an example of how to use
[Orbit.js](#orbitjs) with [React](https://react.dev/) instead of
viewing it as [Orbit.js](#orbitjs) having 1st-class
[React](https://react.dev/) support.

[Firestore](https://firebase.google.com/docs/firestore),
[CushionDB](#cushiondb) and [SQLite](#sqlite-as-a-webassembly-module)
don't have 1st-class support for [React](https://react.dev/).

#### 1st-class Solid support

[TanStack Query](https://tanstack.com/query) is the only solution out of
the bunch which has 1st-class support for
[Solid](https://www.solidjs.com/):

-   [Solid Query | TanStack Query
    Docs](https://tanstack.com/query/v4/docs/solid/overview)

#### 1st-class Vue support

[TanStack Query](https://tanstack.com/query) and [Dexie.js](#dexiejs)
both have 1st-class support for [Vue](https://vuejs.org/):

-   [Vue Query | TanStack Query
    Docs](https://tanstack.com/query/v4/docs/vue/overview)

-   [Get started with Dexie in Vue](https://dexie.org/docs/Tutorial/Vue)

[Firestore](https://firebase.google.com/docs/firestore),
[CushionDB](#cushiondb), [Orbit.js](#orbitjs) and
[SQLite](#sqlite-as-a-webassembly-module) don't have 1st-class support
for [Vue](https://vuejs.org/).

#### 1st-class Svelte support

[TanStack Query](https://tanstack.com/query) and [Dexie.js](#dexiejs)
both have 1st-class support for [Svelte](https://svelte.dev/):

-   [Svelte Query | TanStack Query
    Docs](https://tanstack.com/query/v4/docs/svelte/overview)

-   [Get started with Dexie in
    Svelte](https://dexie.org/docs/Tutorial/Svelte)

[Firestore](https://firebase.google.com/docs/firestore),
[CushionDB](#cushiondb), [Orbit.js](#orbitjs) and
[SQLite](#sqlite-as-a-webassembly-module) don't have 1st-class support
for [Svelte](https://svelte.dev/).

### ORM capabilities

#### Relationship tracking

[Orbit.js](#orbitjs) is aware of relationships in your data.
[SQLite](#sqlite-as-a-webassembly-module) is naturally aware of
relationships in your data as it's a fully-fledged relational database
which lets you interact with it using SQL (Structured Query Language).
[TanStack Query](https://tanstack.com/query),
[Firestore](https://firebase.google.com/docs/firestore),
[CushionDB](#cushiondb) and [Dexie.js](#dexiejs) are not aware of
relationships in your data.

#### Live queries

[Firestore](https://firebase.google.com/docs/firestore) has live queries
in the form of the [`onSnapshot`
API](https://firebase.google.com/docs/firestore/query-data/listen).
[Dexie.js](#dexiejs) and [Orbit.js](#orbitjs) have live queries:

-   [liveQuery() | dexie.org](<https://dexie.org/docs/liveQuery()>)

-   [Live Queries |
    Orbit.js](https://orbitjs.com/docs/querying-data#live-queries)

[TanStack Query](https://tanstack.com/query), [CushionDB](#cushiondb)
and [SQLite](#sqlite-as-a-webassembly-module) don't have live queries.

### Consideration of asynchronicity and concurrency

#### Optimistic updates

[TanStack Query](https://tanstack.com/query),
[Firestore](https://firebase.google.com/docs/firestore) and
[Orbit.js](#orbitjs) provide mechanisms for doing optimistic updates.
[CushionDB](#cushiondb), [Dexie.js](#dexiejs) and
[SQLite](#sqlite-as-a-webassembly-module) don't provide any mechanisms
for doing optimistic updates.

#### Browser tab sync

[Firestore](https://firebase.google.com/docs/firestore) and
[Dexie.js](#dexiejs) synchronize their states across browser tabs.
[TanStack Query](https://tanstack.com/query) has a
[plugin](https://tanstack.com/query/v4/docs/plugins/broadcastQueryClient),
which is as of writing this annotated as "experimental", which
synchronizes the
[QueryClient](https://tanstack.com/query/v4/docs/reference/QueryClient)'s
state across browser tabs. [CushionDB](#cushiondb),
[Orbit.js](#orbitjs) and [SQLite](#sqlite-as-a-webassembly-module)
don't synchronize their states across browser tabs.

### Offline support

#### Offline-first

[Firestore](https://firebase.google.com/docs/firestore),
[CushionDB](#cushiondb), and [Orbit.js](#orbitjs) were designed with
the enablement of offline-first web experiences in mind. [TanStack
Query](https://tanstack.com/query), [Dexie.js](#dexiejs) and
[SQLite](#sqlite-as-a-webassembly-module) were not designed with the
enablement of offline-first web experiences in mind.

#### Data persistence

All the solutions provide mechanisms to persist data.

#### Creating when offline, publish when online

[Firestore](https://firebase.google.com/docs/firestore),
[CushionDB](#cushiondb), and [Orbit.js](#orbitjs) provide mechanisms
for creating data when offline and publishing it when online. [TanStack
Query](https://tanstack.com/query), [Dexie.js](#dexiejs) and
[SQLite](#sqlite-as-a-webassembly-module) don't provide mechanisms for
creating data when offline and publishing it when online, the exception
being [Dexie.js](#dexiejs), if you use it with [Dexie
Cloud^BETA^](https://dexie.org/cloud/).

## Analysis

Let's take a closer look at my hypothesis that a recipe for the solution
can be derived from the [Cloud
Firestore](https://firebase.google.com/docs/firestore) client-side SDK.
I initially asked myself the question: "What enables the [Cloud
Firestore](https://firebase.google.com/docs/firestore) client-side SDK
to have an API such as the [`onSnapshot`
API](https://firebase.google.com/docs/firestore/query-data/listen),
which lets you listen to when the result of a query changes?". But that
is not the right question to ask, because the framework-agnostic core of
[TanStack Query](https://tanstack.com/query) has a very similar API to
the [Cloud Firestore](https://firebase.google.com/products/firestore)
client-side SDK's [`onSnapshot`
API](https://firebase.google.com/docs/firestore/query-data/listen) in
that you can subscribe to be notified when the result of query changes.
So, the answer to that question is simply: "The same thing that enables
it in [TanStack Query](https://tanstack.com/query): observables and
observers.".

What is then the difference between [TanStack
Query](https://tanstack.com/query) and the [Cloud
Firestore](https://firebase.google.com/products/firestore) client-side
SDK? Both have queries and both let you listen to when the result of a
query changes.

Let's explore the meaning of the word _query_ in the different
libraries. In general, _query_ is, in the context of software
development, a request for specific information from a database or other
data storage system. In [TanStack Query](https://tanstack.com/query), a
_query_ can be more specifically described as an abstraction for an
asynchronous read operation, its state, and its cached result. In the
[Cloud Firestore](https://firebase.google.com/products/firestore)
client-side SDK, a _query_ can be more specifically described as an
abstraction which describes the request for specific information itself,
meaning the request itself, in a structured way, which the library
understands. The [Cloud
Firestore](https://firebase.google.com/products/firestore) client-side
SDK has a query language, while [TanStack
Query](https://tanstack.com/query) does not.

In [TanStack Query](https://tanstack.com/query), the meaning of the key
that identifies a query is of no interest to the library. It only sees
the key as a pointer to some value in the
[`QueryCache`](https://tanstack.com/query/v4/docs/reference/QueryCache),
which is essentially a key-value store. Similarly, the data stored as
the result of a query is opaque to [TanStack
Query](https://tanstack.com/query). In contrast, the [Cloud
Firestore](https://firebase.google.com/products/firestore) client-side
SDK understands the data that flows through the library. This is what
allows the [Cloud
Firestore](https://firebase.google.com/products/firestore) client-side
SDK to know based on a socket message informing about a change, how the
in-memory data should be mutated to reflect the change and which query
listeners should be notified.

I have decided that [Orbit.js](#orbitjs) is the solution to taking care
of the query cache updating in a generic and robust way. I will
implement a solution for using the solution ([Orbit.js](#orbitjs))
together with [TanStack Query](https://tanstack.com/query).

[Orbit.js](#orbitjs) is the solution because:

-   It's modular/composable. It can be used in a way where it just
    solves the query cache updating problem, but changes little else
    about the application, or you can go all in, and use it to power
    offline-first web experiences.

-   It has a query language, and it understands the data that flows
    through it, and it lets you listen to when the result of query
    changes, like the [Cloud
    Firestore](https://firebase.google.com/products/firestore)
    client-side SDK. Additionally, it lets you describe relationships in
    your data, which the [Cloud
    Firestore](https://firebase.google.com/products/firestore)
    client-side SDK doesn't let you do to the same degree.

-   It's an entirely client-side solution and it's backend-agnostic. The
    solution doesn't require the entire stack to change.

[^6]: [Cerebris :: Projects](https://www.cerebris.com/projects/), accessed at 2023-05-07&nbsp;
[^7]: [Dan Gebhardt | LinkedIn](https://www.linkedin.com/in/dgeb/), accessed at 2023-05-07&nbsp;
