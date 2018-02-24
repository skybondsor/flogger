### Flogger
A UI Testing Frame &amp; Logger

## Why
Testing your UI can be painful and slow. This single-page dealie makes it slightly less painful and slightly less slow. 

## To use:
1) Add Flogger to your project, possibly in its `/tests` folder. Saving directly into your project helps avoid cross-domain issues with the iframe.
2) Update the `src` of the iframe from `example.html` to whatever the root of your project is, possibly `/app`.
3) Gut the `tests` array and fill it with your project's test cases.
4) Test your project.
5) Copy the log into your issue tracker or an email, or save it as a file - whatever makes it easiest for you to use it to fix errors you found while testing.
6) Fix the errors you found while testing.
7) Repeat.

# Questions you might have:
- Does Flogger affect the contents of the iframe? _Nope! It just leads you through interacting with that content._
- Inline JS is pretty lame; why not abstract a bit more? _Because it works fine and obvs building this was at least partly a way to procrastinate actually doing QA. I figured I should get back to that ASAP!_
