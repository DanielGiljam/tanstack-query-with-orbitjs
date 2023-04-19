---
sidebar_position: 0
---

# Introduction

This thesis is about coming up with a way to make [Tanstack Query][tq] feel more like the [Cloud Firestore](https://firebase.google.com/docs/firestore) client-side SDK.

The [Cloud Firestore](https://firebase.google.com/docs/firestore) client-side SDK provides an unparalleled interface, in terms of elegance, for dealing with "real-time" data in the client-side code. Combining the positive traits of the [Cloud Firestore](https://firebase.google.com/products/firestore) client-side SDK with [Tanstack Query][tq] could hypothetically solve the most prominent problem I face when developing with [Tanstack Query][tq].

The most prominent problem I face when developing with [Tanstack Query][tq] is that if I opt-out of revalidation, then I have to write huge amounts of boilerplate-heavy fragile query cache updating code which is tightly coupled with both the data model and the UI of the app. I identify that there's a missing piece here — a need for a solution which can take care of the query cache updating in a generic and robust way. My hypothesis is that the recipe for that solution can be derived from the [Cloud Firestore](https://firebase.google.com/products/firestore) client-side SDK.

## Prerequisites

I assume that the reader is familiar with current web application development practices, patterns, frameworks, libraries, and tooling, and that the reader has some experience working with [Tanstack Query][tq] or similar libraries, such as [SWR by Vercel](https://swr.vercel.app/).

## Delimitations

### Delimitation #1

In this thesis, the underlying assumption is that [Tanstack Query][tq] is part of our frontend stack, and that is not going to change.

### Delimitation #2

In this thesis, the underlying assumption is that we cannot use [Cloud Firestore](https://firebase.google.com/products/firestore) as part of our stack.

[tq]: https://tanstack.com/query
