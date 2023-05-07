# Conclusion

I reached my goal of coming up with a solution that can take of the
query cache updating in a generic and robust way.

The solution is to use [Orbit.js](https://orbitjs.com/). I additionally
developed a library for using [Orbit.js](https://orbitjs.com/) together
with [TanStack Query](https://tanstack.com/query) which combines the
best of both worlds:

-   The excellent UI framework integrations and asynchronous state
    management of [TanStack Query](https://tanstack.com/query)

-   The amazing data orchestration capabilities of
    [Orbit.js](https://orbitjs.com/)

[Orbit.js](https://orbitjs.com/) eliminates the need for writing query
cache updaters. However, you still need to write updaters, where you
tell [Orbit](https://orbitjs.com/) about changes to data. While these
updaters aren't as concise as I had expected and the number of lines of
code might not differ all too much from the number of lines of code of a
query cache updater, the code in an updater is significantly more
expressive than the code in a query cache updater and the code in an
updater is also more static and decoupled, especially from the UI of the
application.

## Further development

[Orbit.js](https://orbitjs.com/) is an exciting library in many ways and
I feel like its potential hasn't been fully tapped into by the web
development and industry. [Orbit.js](https://orbitjs.com/) is designed
in a way which screams "extend me!", with hooks and slots to be found in
every corner, that can be used for customizing it and adding features
and functionality on top of its already super powerful and solid core. I
could potentially see an entire ecosystem of solutions forming around
[Orbit.js](https://orbitjs.com/), which would greatly benefit developers
who work on large-scale, complex web applications.

At a certain point, however, [Orbit.js](https://orbitjs.com/) won't be
enough. For really complex web applications this might be the case. I
predict the query language and the data model is where
[Orbit.js](https://orbitjs.com/) would first fall short. Not in the data
orchestration features. In that department I've yet to imagine a better
solution. But while [Orbit.js](https://orbitjs.com/) lets you describe
relationships in your data and query based on relationships, it comes
with some limitations and its nowhere close to being as good as
fully-fledged SQL.

For really complex web applications, I think it would be worthwhile
investigating [SQLite as a WebAssembly
module](https://github.com/rhashimoto/wa-sqlite).
