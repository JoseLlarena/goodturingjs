'use strict';

const program = require('commander'), fs = require('fs'), gt = require('./good-turing.js'), zz = what => console.log(what);

program
	.version('1.0.0')	 	
  	.description('smooths counts')
  	.usage('<count frequency file> -a -o -c')
  	.option('-i, --input <output>', 'input file')
  	.option('-o, --output <output>', 'output file')
  	.option('-r, --result <result>', 'output|probability [c|p]', /^(c|p)$/,'c')
  	.option('-a, --algo <algo>', 'smoothing algorithm [s|a]', /^(s|a)$/,'s')  
  	.option('-c, --confidence <number>', 'confidence level', parseFloat, 1.96)    
	.parse(process.argv);

zz(program.args);
	
const contents = fs.readFileSync(program.input, 'utf8');

const count_freq = {};

for(const line of contents.split('\n'))	
{
	const [c, f] = line.split(/\s+/).filter(Boolean);
	count_freq[c] = f;
}

const smoothed = gt.simple(count_freq);

let out = '';
for(const raw of Object.keys(smoothed).sort())
{
	out += `${raw}\t${smoothed[raw]}\n`;
}

console.log(out);
		
fs.writeFile(program.output, out, err =>
{
    if(err) 
    {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 