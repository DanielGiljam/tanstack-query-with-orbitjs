# Introduction

_**Project Fly-By-Wire**_ is about finding better ways to develop data-heavy web applications.

_**Fly-By-Wire**_ is about designing a system for handling rapidly changing relational data in a web application.

<!-- prettier-ignore -->
> There are only two hard things in Computer Science: cache invalidation and naming things.<br/>
> &nbsp;&nbsp;&nbsp;&nbsp; – Phil Karlton

Cache invalidation is central in the first tier of challenges tackled by _**Project Fly-By-Wire**_.

Also, coming up with a good name for this project was very hard.

The name that was eventually chosen is a reference to the adoption of [Fly-By-Wire](https://en.wikipedia.org/wiki/Fly-by-wire) systems in aircraft. The aviation industry's adoption of Fly-By-Wire systems is meant to be seen as analogous to what we're trying to achieve here with data-heavy web applications. The same way that Fly-By-Wire systems in aircraft improve safety, reduce weight, and increase reliability, this project is about coming up with solutions to make it easier to develop data-heavy web applications that are more reliable and more efficient.

The analogy continues, as you'll discover, if you keep reading.

### What are "data-heavy web applications"?

Data-heavy web applications are web applications that needs to display rapidly changing relational data in realtime.

E.g.

-   A typical chat application. ([Slack](https://slack.com/), [Discord](https://discord.com/), [Telegram](https://telegram.org/), [WhatsApp](https://whatsapp.com/), …)
-   A dashboard for a stock trading application. <!-- TODO: give examples of dashboards for stock trading applications -->

## Problem

In my experience, popular patterns for developing web applications fall short when building data-heavy web applications.

There is no "popular pattern" for developing data-heavy web applications.

### What are "popular patterns"?

When I use the term "popular patterns", I'm referring to patterns that are widely adopted and widely encouraged by the web development community.

## The React Query pattern

The popular pattern I'm going to use as the primary example is [React.js](https://reactjs.org/) + [Tanstack Query](https://tanstack.com/query). From now on I'm going to refer to that pattern as the _**React Query**_ pattern.

<!-- TODO: motivate why The "popular pattern" can be considered The "popular pattern" -->

Most of the attributes of the _React Query_ pattern that are relevant to this context applies to other popular patterns as well. When this isn't the case, I'll try explicitly point it out.

<!-- TODO: list other popular patterns that exhibit the same limitations as the React Query pattern -->
