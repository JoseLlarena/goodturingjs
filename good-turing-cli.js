//jshint esversion:6, node: true
'use strict';

const fs = require('fs'), gt = require('./good-turing.js'), {log} = console, {keys} = Object, undef = _ => typeof _ === 'undefined';
 
const program = coerced(require('commander')
	.version('1.0.0')	 	
  	.description(
		  `recalculates counts and count probabilities of a probability mass distribution using good-turing smoothing
  <input file> should contain two whitespace-separated columns, the first being the raw count and the secound its frequency
  <output file> will be created/overwritten with two tab-separated columnns, the first being the input raw count and the second 
  the smoothed count or its smoothed probability; for zero raw counts, the smooth count and its probability are aggregated over all symbols with zero counts 
  `)
  	.usage('<input file> <output file> [options]')
	.arguments('<input file> <output file>')
  	.option('-t, --type [c|p]', 'output type: smoothed counts [c] or smoothed probability of counts [p], defaults to [c]', type => type.trim().toUpperCase())
  	.option('-a, --algo [s|m]', 'smoothing algorithm: simple [s] or minmax [m], defaults to [s]', algo => algo.trim().toUpperCase())  
  	.option('-c, --confidence <number>', 'level of significance as z-score for Simple Good-Turing, defaults to 1.96', parseFloat)    
	.parse(process.argv));

const 	algo = program.algo === 'M'? gt.minmax : gt.simple, 
		infile = program.args[0], outfile = program.args[1];

smoothed_to(outfile, algo(count_freq_from(infile), program.type === 'P', program.confidence));


function coerced(program)
{
	if(program.args.length != 2)
	{
		program.help(text => '\n  NEEDS <input file> AND <output file>\n'+ text);	
	}

	program.type = program.type || 'C';
	if(!/[C|P]/.test(program.type))
	{
		program.help(text => `\n  TYPE NEEDS TO BE [c] OR [p], BUT WAS ${program.type}\n${text}`);
	}
	
	program.algo = program.algo || 'S';
	if(!/[S|M]/.test(program.algo))
	{
		program.help(text => '\n  ALGO NEEDS TO BE [s] OR [m]\n'+ text);
	}

	if(!undef(program.confidence))
	{
		if(!isNaN(program.confidence) && isFinite(program.confidence) && program.confidence >= 0)
		{
			if(program.algo !== 'S') program.help(text => '\n  CONFIDENCE IS ONLY APPLICABLE TO THE [s] OPTION\n'+ text);
		}
		else
		{
			program.help(text => '\n  CONFIDENCE NEEDS TO BE A POSITIVE NUMBER\n'+ text);
		}	
	}
	program.confidence = program.confidence || 1.96;

	return program;
}
 
function count_freq_from(file)
{
	try
	{
		const valid_row = /^\s*\d+\s+\d+\s*$/, white_space = /\s+/;
		const contents = fs.readFileSync(file, 'utf8');

		const count_freq = {};

		for(const line of contents.split('\n'))	
		{
			if(!valid_row.test(line)) throw {name: 'Invalid Row Structure', message: 'row has invalid structure: '+line};
			const [c, f] = line.split(white_space).filter(Boolean);
			count_freq[c] = +f;
		}

		if(keys(count_freq).length === 0) throw {name: 'Invalid File Contents', message: 'contents of file are invalid'};

		return count_freq;
	}
	catch(exception)
	{
		log(exception);
		process.exit(1);
	}
}

function smoothed_to(file, smoothed)
{
	let output = '';
	for(const raw of keys(smoothed).map(c => +c).sort((a, b) => a > b ? 1: a < b? -1 : 0))
	{
		output += `${raw}\t${smoothed[raw]}\n`;
	}

	log(output);
			
	fs.writeFile(file, output, err =>
	{
		if(err) 
		{
			log(err);
			process.exit(-1);
		}
	});

	return file;
}