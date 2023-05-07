# Aim

Come up with a solution which can take care of the query cache updating
in a generic and robust way.

Generic as in decoupled and deduplicated (reducing the amount of
boilerplate needed for each query cache updater). Robust as in hiding
the complexity and writing it only once with meticulous care and
precision.
