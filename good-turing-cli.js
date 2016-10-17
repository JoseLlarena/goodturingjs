'use strict';

const program = require('commander');
program
	.version('1.0.0')	 	
  	.description('smooths counts')
  	.usage('<count frequency file> -a -o -c')
  	.option('-a, --algo <algo>', 'smoothing algorithm [s|a]', /^(s|a)$/,'s')
  	.option('-o, --output <output>', 'output|probability [c|p]', /^(c|p)$/,'c')
  	.option('-c, --confidence <number>', 'confidence level', parseFloat, 1.96)
   	.action
   	(
		file => 
		{
			  console.log('arg...', file);
			  console.log('algo...', program.algo);
			  console.log('output...', program.output);
			  console.log('confidence...', program.confidence);
		}
	)
	.parse(process.argv);