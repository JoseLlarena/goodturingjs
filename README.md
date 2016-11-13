# goodturingjs

Command line interface and library for the smoothing of probability mass functions

[Library API documentation](goodturingjs.github.io)

## Getting Started

### Prerequisites

[nodejs](https://nodejs.org/en/download/), for the CLI only

### Installing the CLI

```
npm i goodturing
```

#### usage 

```
node goodturing -h
```
```

  Usage: good-turing <input file> <output file> [options]

  recalculates counts and count probabilities of a probability mass distribution using good-turing smoothing
  <input file> should contain two whitespace-separated columns, the first being the raw count and the secound its frequency
  <output file> will be created/overwritten with two tab-separated columnns, the first being the input raw count and the second
  the smoothed count or its smoothed probability; for zero raw counts, the smooth count and its probability are aggregated over all symbols with zero counts


  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -t, --type [c|p]           output type: smoothed counts [c] or smoothed probability of counts [p], defaults to [c]
    -a, --algo [s|m]           smoothing algorithm: simple [s] or minmax [m], defaults to [s]
    -c, --confidence <number>  level of significance as z-score for Simple Good-Turing, defaults to 1.96
```

### Installing the library

#### In node.js
```
const good_turing = require('./good-turing.min.js')
```
#### In the browser

```
<script src='good-turing.min.js'></script>
```
`good_turing` will be available as a global
 
## Running the tests

Only for the library:

```
npm test
``` 
## License

This project is licensed under the MIT License - see the [LICENSE.md](../LICENSE.md) file for details