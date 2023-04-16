# Problem

The most prominent problem I face when developing with [Tanstack Query][tq] is that if I opt-out of revalidation, then I have to write huge amounts of boilerplate-heavy fragile query cache updating code which is tightly coupled with both the data model and the UI of the app. I identify that there's a missing piece here — a need for a solution which can take care of the query cache updating in a generic and robust way.

Query cache updaters — when implemented as suggested in [Tanstack Query's documentation][tqd] — are bad because:

-   They are difficult to write.
    -   Writing a bug-free query cache updater requires the developer to take into consideration all permutations of what the state of the query could be when the query cache updater is being run.
        -   The developer must have a profound understanding of how [Tanstack Query][tq] works in order to know what cases to consider and how to consider them.
        -   This results in a lot of boilerplate code.
    -   The complexity of writing a bug-free (robust) real-life-use-case query cache updater isn't clearly conveyed in [Tanstack Query's documentation][tqd].
        -   Perhaps a very intelligent and experienced developer could pick it up from between the lines in the documentation, but for most developers, it's something that the they must discover for themselves through trial and error.
-   They are difficult to maintain for the same reasons that they are difficult to write.
-   They are tightly coupled with the data model **_AND_** with the UI in the application, so they need to be updated whenever the data model or the UI changes — which is another way of saying they need to updated very frequently.

This prevents [Tanstack Query][tq] from scaling well in larger, more complex applications.

## What are query cache updaters?

"Query cache updaters" is the term I will use to refer to functions that updates the [query cache](https://tanstack.com/query/docs/reference/QueryCache).
Query cache updaters are needed when you want to update the result of a query without having to re-fetch the query.
See [Updates from Mutation Responses](https://tanstack.com/query/latest/docs/guides/updates-from-mutation-responses) for more information.
Note that a query cache updater doesn't always have to be used in conjunction with a mutation.
A query cache updater can be used anywhere where you have access to the [`QueryClient`](https://tanstack.com/query/docs/reference/QueryClient) object.
For example, in a chat application, you could use a query cache updater in conjunction with a [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) message handler to update the query which holds the list of chat messages whenever a new chat message arrives.

## Why do we need query cache updaters?

It may seem counter-intuitive that we need query cache updaters, especially as [Tanstack Query][tq] describes itself on its home page as giving us "always-up-to-date auto-managed queries". This is half-true, in that out-of-the-box, [Tanstack Query][tq] is configured in a way where it will constantly revalidate our queries[^4], effectively resulting in them being almost "always-up-to-date".

In reality, you will most likely opt-out of revalidation — in other words, tweak your configuration so that queries are not revalidated automatically, in order to avoid that the app is making too many unnecessary network requests. Instead you will manually update the query cache when something has changed. For manually updating the query cache when something has changed, you need to write query cache updaters.

### How Tanstack Query achieves almost always-up-to-date queries with its default configuration

So it achieves almost always-up-to-date auto-managed queries by effectively "polling" the backend (or whatever the data source is where the data is being loaded from in the [query functions](https://tanstack.com/query/docs/guides/query-functions)). It is not literally polling, but close enough. When using [Tanstack Query][tq] with the default configuration, you can see that queries are re-fetched incredibly often.

For bandwidth and performance reasons, it may not be desirable to be "polling" the backend with network requests.

Thus, in real-word use-cases, the configuration is usually tweaked so that queries are not invalidated automatically and instead they're manually invalidated when the developer knows something has changed (e.g. upon receiving a socket message or when a mutation has been successfully executed).

However, even when controlling when queries are invalidated, a lot of unnecessary and expensive network requests can still incur. For example, if all the relevant data regarding a change was provided in the socket message informing the client about the change, then, in theory, no network requests need to be made — only the query cache needs to be updated.

[tq]: https://tanstack.com/query
[tqd]: https://tanstack.com/query/docs

[^4]: [Important Defaults | Tanstack Query Docs](https://tanstack.com/query/docs/guides/important-defaults), accessed at 2023-04-11&nbsp;
