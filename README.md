# goodturingjs

Command line interface and library for the smoothing of probability mass functions

[Library API documentation](https://josellarena.github.io/goodturingjs/module-goodturing.html)

## Getting Started

### Prerequisites

[nodejs](https://nodejs.org/en/download/), for the node CLI/library

### Installing the CLI


globally:

```
npm i -g goodturing
```
locally:

```
npm i goodturing
```
#### Usage


global:

```
goodturing -h
```

local:

```
./node_modules/.bin/goodturing -h
```

```

  Usage: goodturing <input file> <output file> [options]

  recalculates counts and count probabilities of a probability mass distribution using good-turing smoothing
  <input file> should contain two whitespace-separated columns, the first being the raw count and the secound its frequency
  <output file> will be created/overwritten with two tab-separated columnns, the first being the input raw count and the second
  the smoothed count or its smoothed probability; for zero raw counts, the smooth count and its probability are aggregated over
  all symbols with zero counts

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -t, --type [c|p]     output type: smoothed counts [c] or smoothed probability of counts [p], defaults to [c]
    -a, --algo [s|m]     smoothing algorithm: simple [s] or minmax [m], defaults to [s]
    -c, --crit <number>  critical value for Turing/Linear-Good-Turing switch for Simple Good-Turing, defaults to 1.96
```

### Installing the library


#### In node


```
git clone git@github.com:josellarena/goodturingjs.git
```
```
const goodturing = require('./good-turing.js');
```
or if cli  has been installed locally:
```
const goodturing = require('goodturing');
```
if globally, first do:

```
npm ln goodturing
```

#### In the browser


`good-turing.min.js` is an uglified es5-babelised version of `good-turing.js`

```
<script src='good-turing.min.js'></script>
```
`goodturing` will be available as a global
 

### Uninstalling


globally:

```
npm un -g goodturing
```
locally:

```
npm un goodturing
```

## Running the tests


Only for the library:
```
npm test
``` 
if mocha not installed, first do:
```
npm i mocha 
```
## License


This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details