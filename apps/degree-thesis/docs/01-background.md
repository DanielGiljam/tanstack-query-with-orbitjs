# Background

## TanStack Query

[TanStack Query](https://tanstack.com/query) (formerly known as React
Query) by [Tanner Linsley](https://tannerlinsley.com/) has 33,984 stars
on GitHub as of 11th of April 2023[^1]. In the State of JS Survey 2022,
28% of respondents said that had used it as a data fetching library[^2].
It is part of the increasingly popular open-source full stack solution
T3 Stack. [TanStack Query](https://tanstack.com/query) is trusted by
numerous big companies in production[^3].

I've used [TanStack Query](https://tanstack.com/query) for a while now
in several projects that I work on, and I think it's a great library
which elegantly solves many problems and challenges commonly faced when
developing web applications. I hope it becomes even more popular and
widely adopted. I think it's a positive technology with a positive
impact on the web development community and industry.

It provides the following value:

-   Solution for managing the state of async read and writes and
    accurately reflecting it in the UI.

    -   Very complex wheel to try and re-invent yourself.

-   Separation of concerns.

    -   UI components can be written in a truly declarative fashion
        thanks to its great API design.

-   Good developer experience.

    -   Well-designed API which provides both high-level access and
        low-level access.

    -   Good [documentation](https://tanstack.com/query/latest/docs).

    -   Fully-fledged type definitions
        ([TypeScript](https://typescriptlang.org/) support).

    -   Graphical "devtools"[^4],
        which is great for debugging while developing.

But while it solves many problems and challenges commonly faced when
developing web applications, it does not solve all of them. Or by
solving some problems and challenges, it takes you to the next level and
"unlocks" some new problems and challenges.

In this thesis, I will address what I found to be the most prominent
problem which [TanStack Query](https://tanstack.com/query) does not
solve.

## The Cloud Firestore client-side SDK

The [Cloud Firestore](https://firebase.google.com/products/firestore)
client-side SDK is — as the name suggests — a SDK for interacting
with [Cloud Firestore](https://firebase.google.com/products/firestore)
from a client application. [Cloud
Firestore](https://firebase.google.com/products/firestore) is a
"real-time" database. The downside of [Cloud
Firestore](https://firebase.google.com/products/firestore) is that it's
part of [Google](https://about.google/)'s proprietary and closed-source
backend-as-a-service platform [Firebase](https://firebase.google.com/),
which disqualifies its use in a lot of projects, due to reasons such as
costs, the risk of vendor lock-in, to name a few.

The upside is that it provides an unparalleled interface, in terms of
elegance, for dealing with "real-time" data in the client-side code.
Combining the positive traits of the [Cloud
Firestore](https://firebase.google.com/products/firestore) client-side
SDK with [TanStack Query](https://tanstack.com/query) could
hypothetically solve the most prominent problem I face when developing
with [TanStack Query](https://tanstack.com/query).

### Cloud Firestore

[Cloud Firestore](https://firebase.google.com/products/firestore) is a
NoSQL document database which is hosted in the cloud and part of
[Firebase](https://firebase.google.com/), an app development platform
provided by [Google](https://about.google/). Its counterparts in
[AWS](https://aws.amazon.com/) land and
[Azure](https://azure.microsoft.com/) land are commonly viewed as being
[DynamoDB](https://aws.amazon.com/dynamodb) and
[CosmosDB](https://cosmos.azure.com/), respectively, although there are
significant differences between the databases in terms of their design
and functionality.

What in my opinion mostly distinguishes [Cloud
Firestore](https://firebase.google.com/products/firestore) from similar
solutions is its "real-time" functionality — a set of capabilities
inherited from its predecessor / sibling product [Firebase Realtime
Database](https://firebase.google.com/products/realtime-database), for
which the "real-time" functionality was the main selling point back in
the day.

### "Real-time" databases

A "real-time" database — such as [Firebase Realtime
Database](https://firebase.google.com/products/realtime-database) — is
a database which provides a mechanism for clients to subscribe to be
notified about changes to the data in the database. In the case of
[Firebase Realtime
Database](https://firebase.google.com/products/realtime-database) as
well as [Cloud
Firestore](https://firebase.google.com/products/firestore), the
implementation of this mechanism is by design hidden to the consumer of
the service(s). [Google](https://about.google/)'s backend and the
client-side SDK work in tandem to provide a high-level way of consuming
"real-time" data.

In [Cloud Firestore](https://firebase.google.com/products/firestore)'s
client-side SDK, this is done by using the [`onSnapshot`
API](https://firebase.google.com/docs/firestore/query-data/listen). It
lets you listen to when the result of a database query changes.

[^1]: [TanStack/query on GitHub](https://github.com/tanstack/query), accessed at 2023-04-11&nbsp;
[^2]: [State of JavaScript 2022: Other Tools](https://2022.stateofjs.com/en-US/other-tools/#data_fetching), accessed at 2023-04-12&nbsp;
[^3]: [TanStack Query | React Query, Solid Query, Svelte Query, Vue Query](https://tanstack.com/query), accessed at 2023-04-12&nbsp;
[^4]: [Devtools | TanStack Query Docs](https://tanstack.com/query/v4/docs/devtools), accessed at 2023-05-07&nbsp;
