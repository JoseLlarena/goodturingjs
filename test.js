'use strict'; 	
const  should = require('should'), gt = require('./good-turing.js')  	;
const keys = Object.keys, exp = Math.exp, log = Math.log;  

describe('good-turing.js', _ =>
{

	const count_freq =  
			{1: 100, 2: 38, 3: 21, 4: 13, 5: 7, 6: 7, 7: 8, 8: 1, 9: 3, 10: 3, 11: 3, 12: 2, 13: 1, 14: 1, 15: 1, 16: 1, 21: 1, 33: 1};

	it('computes probability of counts, using stg',  function()
	{
		const gold_standard = 
			{0: .152, 1: .0007877, 2: .002142, 3: .003643, 4: .005204, 5: .006795, 6: .008402, 7: .01002, 8: .01165, 9: .01328, 10: .01491,
			 11: .01655, 12: .01819, 13: .01983, 14: .02147, 15: .02311, 16: .02476, 21: .03299, 33: .05277};  //{0: .04771, 1: 1.297, 2: .0238, 3: .03527, 4: .04671, 5: .05815, 6: .06957};

		const smoothed = gt.simple(count_freq, true);
		for(const count of keys(smoothed))
			(+(+smoothed[count]).toPrecision('4')).should.eql(gold_standard[count]);
	}); 

	it('computes smoothed counts, using stg',  function()
	{
		const gold_standard = 
			{0: 100 , 1: .4771, 2: 1.297, 3: 2.207, 4: 3.152, 5: 4.116, 6: 5.09, 7: 6.07, 8: 7.055, 9: 8.043, 10: 9.033, 11: 10.02,
			 12: 11.02, 13: 12.01, 14: 13.01, 15: 14, 16: 15, 21: 19.98, 33: 31.96}; 			 	 

		const smoothed = gt.simple(count_freq, false);
		for(const count of keys(smoothed))
			(+(+smoothed[count]).toPrecision('4')).should.eql(gold_standard[count]);
	});

	it('computes log-linear regression function',  function()
	{  		
		const data = {};

		for(let i = 1; i < 10; i++)
		{
			data[exp(i)] = exp(2 + i*3);
		}

		const fn = gt._log_regression(data);

		for(let i = 1; i < 10; i++)
		{
			fn(exp(i)).should.be.approximately(exp(2 + i*3), 1e-5);	
		} 
	});  	

	it('computes smoothed counts including zero, using adaptive minmax',  function()
	{ 	
		const freq_zero = 29*29-1;

		gt.adaptive_minmax({0: 9, 1: 8, 2: 6, 3: 5, 4:5, 5: 3, 6: 1})
			.should.eql({0: 1, 1: 1.75, 2: 3, 3: 4.8, 4: 4, 5: 5, 6: 6});	   
		console.log(gt.adaptive_minmax(Object.assign({0: freq_zero}, count_freq)));	
		console.log(gt.simple(count_freq));
	});  	
});
