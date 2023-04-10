# Tiers of challenges

I've identified four tiers of challenges when using current popular patterns to develop web applications.

## Tier I: Single browser tab

Challenges:

-   Keeping the data in the client up-to-date while keeping the following in mind:

    -   Code footprint
        -   Maintainability
        -   Scalability
    -   Perceived performance of the application
        -   User experience
    -   Bandwidth usage / number of requests made to the server
        -   Constantly refreshing the data by polling the server is not a solution

## Tier II: Multiple browser tabs

Challenges:

-   Keeping the data in the tabs (clients) in sync with each other.

## Tier III: Offline support

Challenges:

-   Maintaining a lazily populated local mirror of the remote data.

## Tier IV: Beyond offline support…

Challenges:

-   Change queues.

    -   Allow the user to make changes to the data while offline.
    -   The changes are published to the server (updated in the remote source) when the user comes back online.

-   Offline search indexes.
    -   Maintain search indexes of the local mirror
    -   Allow the user to search through the locally cached data while offline.

<!-- TODO: illustration for each of the tiers of challenges -->
