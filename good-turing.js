//jshint esversion:6, -W008 
module.exports = (function()
{	
	'use strict';

	const undef = obj => typeof obj === 'undefined', {keys} = Object, {log , exp , sqrt, abs} = Math, sq = x => x*x;	
			
	const o =
	{		
		adaptive_minmax(count_freq, probs = false)
		{  
			const smoothed_counts = {};			  				
			 
			for(const count of keys(count_freq))
			{
				const c = +count; 
				const f_above = count_freq[c+1] || 0;		
				smoothed_counts[c] = c > f_above ? c : (c+1) * (f_above + 1) / count_freq[c];
			} 
			
			if(!undef(smoothed_counts[0]))
				smoothed_counts[0] *= count_freq[0];

			if(probs === true)
			{  
				let N = 0;
				for(const c of keys(smoothed_counts))
				{
					N += (+c === 0? 1 : count_freq[c])*smoothed_counts[c];
				}
				for(const c of keys(smoothed_counts))
				{
					smoothed_counts[c] /= N;
				}
			}	

			return smoothed_counts; 
		},

		simple(count_freq, probs = false, conf = 1.96)
		{
 			const counts = keys(count_freq).map(c => +c).sort((a, b) => a > b ? 1: a < b? -1 : 0), n = counts.length;
 			const log_reg = o._log_regression(o._count_zfreq(count_freq, counts, n));  

			const smoothed_counts = {0: count_freq[1] || 0}; 	
 
			let N = 0 , non_zero_N = 0;			  				

			for(let i = 0, use_good_turing = false; i < n; i++)
			{
				const c = +counts[i], f = count_freq[c],  good_turing = (c+1)*log_reg(c+1)/log_reg(c);	
 				if(use_good_turing)
				{
					smoothed_counts[c] = good_turing; 
				}
				else if(undef(count_freq[c+1]))
				{
					smoothed_counts[c] = good_turing; 
					use_good_turing = true;
				}				
				else if(!use_good_turing)
				{  		
					const ff = count_freq[c+1], turing = (c+1)* ff/f;  

					if(abs(turing - good_turing) <= conf * sqrt( sq(c+1) * ff/sq(f) * (1+ff/f) ))
					{
						smoothed_counts[c] =  good_turing;	
						use_good_turing = true;
					}					
					else
					{
						smoothed_counts[c] = turing;		
					}	
				} 

				N += c * f;
				non_zero_N += smoothed_counts[c] * f;  
			}	 						 
 
			if(probs === true)
			{
				return o._as_stg_probs(smoothed_counts, counts, n, N, non_zero_N);
			}					 

			return smoothed_counts;
		},

		_as_stg_probs(smoothed_counts, counts, n, N, non_zero_N)
		{
			smoothed_counts[0] /= N;
			const norm = (1 - smoothed_counts[0])/non_zero_N;

			for(let i = 0; i < n; i++)
			{
				const c = +counts[i];
				smoothed_counts[c] = norm*smoothed_counts[c];   
			}

			return smoothed_counts;
		},

		_count_zfreq(count_freq, counts, n)
		{
			const count_zfreq = {[counts[0]]: count_freq[counts[0]]/(.5*counts[1])};		
			
			for(let i = 1; i < n-1; i++ )
			{
				const c = counts[i];				
			 
				count_zfreq[c] = count_freq[c]/(.5*(counts[i+1] - counts[i-1]));	 	 
			}

			count_zfreq[counts[n-1]] = count_freq[counts[n-1]]/(counts[n-1] - counts[n-2]);

			return count_zfreq; 
		},

		_log_regression(count_freq)
		{
			const counts = keys(count_freq);
			let avg_counts = 0, avg_freqs = 0, avg_sq_counts = 0, avg_prod = 0;

			for(const count of counts)
			{
				const c = log(+count), f = log(count_freq[count]);
				avg_counts += c;
				avg_freqs += f;
				avg_prod += c*f;
				avg_sq_counts += c*c;								
			}

			const n = counts.length;
			avg_counts /= n; // <x>
			avg_freqs /= n; // <y>			
			avg_prod /= n; // <xy>
			avg_sq_counts /= n; // <x^2>			

			const slope = (avg_prod - avg_counts*avg_freqs) / (avg_sq_counts - avg_counts*avg_counts);
			const intercept = avg_freqs - slope*avg_counts; 

			return count => exp(intercept + slope*log(count));
		}
	};

	return o;
}());