# Method

In brief, my method can be broken into two parts of which each part can further be broken into steps:

1. Research
    1. Find related work.
    2. Compare related work.
    3. Decide if related work can be utilized in the solution to the problem.
2. Implementation
    1. Develop an example application which demonstrates the problem.
    2. Develop the solution to the problem in the example application.
    3. Extract the solution from the example application into a library.

## Research

I explore related work in order to gain a greater insight into potential ways of solving the problem and to find pre-existing solutions to potentially draw from, use in, integrate into or embed into my solution. Related work meaning projects with any kind of overlap in terms of solving problems in the problem space of the problem I'm trying to solve.

### Finding related work

My process of searching for and finding related work can be described as follows:

1. Search the internet using Google with a random search term.
    - Random meaning something your brain made up on the spot, either based on a wild guess or an educated guess that the search term will yield beneficial results, using creativity and intuition to your advantage, and allowing it to be boosted by your experience interacting with web search algorithms and navigating the internet to find solutions to your problems.
2. Select a few interesting results.
    - Opening each in new tab, if you're using a web browser (like most people)
3. Skim through the selected results, following interesting looking links, if such are encountered.
    - Also opening interesting looking links within the results in new tabs.
4. End process if you have found a solution to your problem, else repeat, using findings from previous iteration as inspiration for new search terms.

The process advances in bursts over the course of several months.

### Comparing related work

I compare related work and [Tanstack Query][tq] against my checklist:

-   Modularity

    -   **Full-stack**

        The project is a full-stack solution, meaning it comes both with a server-side component and a client-side component.

    -   **Backend-agnostic**

        The project is backend-agnostic solution, meaning it can be used with any kind of backend.

    -   **Modular**

        The project is modular solution, meaning it can be incrementally adopted or it can be used in a partial manner.

-   Developer experience

    -   **1st-class TypeScript support**

        The project is written in TypeScript and it ships with detailed type definitions.

    -   **Graphical "dev tools"**

        There is an official graphical developer tool to be used with the solution.

-   UI framework integration

    -   **1st-class React support**

        There is official React support.

    -   **1st-class Solid support**

        There is official Solid support.

    -   **1st-class Vue support**

        There is official Vue support.

    -   **1st-class Svelte support**

        There is official Svelte support.

-   ORM capabilities

    -   **"Live queries"**

        The solution provides a mechanism to listen for when the result of a query for data changes.

-   Consideration of asynchronicity and concurrency

    -   **Optimistic updates**

        The solution provides a dedicated mechanism for doing optimistic updates.

    -   **Browser tab sync**

        The solution provides a way to synchronize the state between browser tabs.

-   Offline-support

    -   **Offline-first**

        The solution is capable to be used in an offline-first manner.

    -   **Data persistence**

        The solution provides a mechanism to persist data.

    -   **Create when offline, publish when online**

        The solution provides a mechanism to create data when offline, persist it locally, and publish it to any potential remote data source once the client regains network connectivity.

### Deciding if related work can be utilized in the solution to the problem

I make a case for whether there is related work that can be utilized in the solution to the problem, and if that is the case, then what that related work is and why that particular related work was selected.

## Implementation

I first solve the problem in an example application which uses [Tanstack Query][tq]. I then extract the solution into a separate library.

### Developing an example application

I develop an example application which uses [Tanstack Query][tq] and which acts as a sandbox for developing the solution to the problem as well as a practical example of the problem, prior to the solution being developed in it.

The application should resemble a typical chat application, the likes of

-   [Slack](https://slack.com/),
-   [Discord](https://discord.com/),
-   [Telegram](https://telegram.org/),
-   or [WhatsApp](https://whatsapp.com/).

The UI is expected to look something like this:

![typical chat application UI](06-method.assets/typical-chat-app-ui.png)

On the left-hand side, you have a list of chat rooms. On the right-hand side, you have a list of messages in the currently selected chat room.

#### Detailed requirements

-   It should be able to fetch and display a list of chat rooms.
    -   Ordered by when the latest chat message was sent, descending.
-   It should let the user select a chat room to view the messages in that room and send new messages to that room.
-   It should be able to fetch and display a list of chat messages in the currently selected room.
    -   Ordered by when the latest chat message was sent, descending.
-   It should let the user send a new chat message to the currently selected room.
-   It should automatically and as quickly as possible reflect update the UI to reflect the changes to the data when new chat messages arrive.

### Solving the problem

I solve the problem in the example application, while keeping in mind things like code isolation and generality, since in the next step I'll have to pull out the solution into its own, separate library.

### Packaging the solution as a library

I extract the solution from the example application into a separate library, and package it in a way which allows it to be consumed and used in any application that uses [Tanstack Query][tq], with minimal additional configuration.

[tq]: https://tanstack.com/query
