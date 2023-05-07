# Problem

The most prominent problem I face when developing with [TanStack
Query](https://tanstack.com/query) is that if I opt-out of revalidation,
then I have to write huge amounts of boilerplate-heavy fragile query
cache updating code which is tightly coupled with both the data model
and the UI of the app. I identify that there's a missing piece here —
a need for a solution which can take care of the query cache updating in
a generic and robust way.

Query cache updaters — when implemented as suggested in [TanStack
Query's documentation](https://tanstack.com/query/v4/docs) — are bad
because:

-   They are difficult to write.

    -   Writing a bug-free query cache updater requires the developer to
        take into consideration all permutations of what the state of
        the query could be when the query cache updater is being run.

        -   The developer must have a profound understanding of how
            [TanStack Query](https://tanstack.com/query) works to know
            what cases to consider and how to consider them.

        -   This results in a lot of boilerplate code.

    -   The complexity of writing a bug-free (robust) real-life-use-case
        query cache updater isn't clearly conveyed in [TanStack Query's
        documentation](https://tanstack.com/query/v4/docs).

        -   Perhaps a very intelligent and experienced developer could
            pick it up from between the lines in the documentation, but
            for most developers, it's something that they must discover
            for themselves through trial and error.

-   They are difficult to maintain for the same reasons that they are
    difficult to write.

-   They are tightly coupled with the data model **_AND_** with the UI
    in the application, so they need to be updated whenever the data
    model or the UI changes — which is another way of saying they need
    to be updated very frequently.

This prevents [TanStack Query](https://tanstack.com/query) from scaling
well in larger, more complex applications.

:::info

See [_Results: A concrete example of the
problem_](results#a-concrete-example-of-the-problem) for a concrete example of
the problem.

:::

## What are query cache updaters?

"Query cache updaters" is the term I use to refer to functions that
update the
[`QueryCache`](https://tanstack.com/query/v4/docs/reference/QueryCache).
Query cache updaters are needed when you want to update the result of a
query without having to re-fetch the query. See [Updates from Mutation
Responses](https://tanstack.com/query/v4/docs/guides/updates-from-mutation-responses)
for more information. Note that a query cache updater doesn't always
have to be used in conjunction with a mutation. A query cache updater
can be used anywhere where you have access to the
[`QueryClient`](https://tanstack.com/query/v4/docs/reference/QueryClient)
object. For example, in a chat application, you could use a query cache
updater in conjunction with a
[`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
message handler to update the query which holds the list of chat
messages whenever a new chat message arrives.

## Why do we need query cache updaters?

It may seem counter-intuitive that we need query cache updaters,
especially as [TanStack Query](https://tanstack.com/query) describes
itself on its home page as giving us "always-up-to-date auto-managed
queries". This is half-true, in that out-of-the-box, [TanStack
Query](https://tanstack.com/query) is configured in a way where it will
constantly revalidate our queries[^5] effectively resulting in them being almost
"always-up-to-date".

In reality, you will most likely opt-out of revalidation — in other
words, tweak your configuration so that queries are not revalidated
automatically — in order to avoid that the app is making too many
unnecessary network requests. Instead, you will manually update the
query cache when something has changed. For manually updating the query
cache when something has changed, you need to write query cache
updaters.

### How TanStack Query achieves almost always-up-to-date auto-managed queries with its default configuration

It achieves almost always-up-to-date auto-managed queries through
frequent revalidation of the queries. By default[^5], TanStack Query will
revalidate a query when:

-   An observer is added.

-   The window is refocused.

-   The network is reconnected.

This results in queries being revalidated very often. For bandwidth and
performance reasons, it may not be desirable to be hitting the backend
with network requests (or whatever data source with whatever way they're
being queried in the query functions) that often.

Thus, in real-word use-cases, the configuration is usually tweaked so
that queries are not invalidated automatically and instead they're
manually invalidated when the developer knows something has changed
(e.g., upon receiving a socket message or when a mutation has been
successfully executed).

However, even when controlling when queries are invalidated, a lot of
unnecessary and expensive network requests can still incur. For example,
if all the relevant data regarding a change was provided in the socket
message informing the client about the change, then, in theory, no
network requests need to be made — only the query cache needs to be
updated.

[^5]: [Important Defaults | Tanstack Query Docs](https://tanstack.com/query/docs/guides/important-defaults), accessed at 2023-04-11&nbsp;
