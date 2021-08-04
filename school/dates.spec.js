var expect = require('chai').expect;

describe("Date", function() {

	beforeEach(function() {
	});

	describe('month', ()=>{

		it('is zero-based', ()=>{
			let today = new Date(2017, 0, 25);
			expect(today.toString()).to.contain('Jan');
		})
	});

	describe('adding one day', ()=>{

		it('can be done adding ms', ()=>{
			let today = new Date(2017, 7, 25);
			let tomorrow = new Date(today.getTime() + 1000*60*60*24* 1);

			expect(tomorrow.getTime()).to.equal((new Date(2017, 7, 26)).getTime());
		});
	});

	describe('substracting one day', ()=>{

		it('can be done the same way', ()=>{
			let today = new Date(2017, 7, 25);
			let yesterday = new Date(today.getTime() - 1000*60*60*24* 1);

			expect(yesterday.getTime()).to.equal((new Date(2017, 7, 24)).getTime());
		});
	});

	describe('week', ()=>{

		it('kind-of starts on Sunday', ()=>{
			let sunday = new Date(2015, 0, 18);

			expect(sunday.getDay()).to.equal(0);
		})
	})

	describe('finding Monday around a date', ()=>{

		let dayLength = 1000*60*60*24;
			
		it('is straigth-forward from Monday to Saturday', ()=>{
			let thursday = new Date(2015, 0, 15);
			let monday = new Date( thursday.getTime() - dayLength * (thursday.getDay()-1) );

			expect(monday.getTime()).to.equal((new Date(2015, 0, 12)).getTime());
		});

		it('is different for Sunday', ()=> {
			let sunday = new Date(2015, 0, 18);
			let monday = new Date( sunday.getTime() - dayLength * (7-1) );

			expect(monday.getTime()).to.equal((new Date(2015, 0, 12)).getTime());
		});

		const f = (n)=> (n+6) % 7;
		const mondayOf = (date)=> new Date( date.getTime() - dayLength * f(date.getDay()) );

		it('can be unified', ()=> {
			expect(f(1)).to.equal(0);
			expect(f(2)).to.equal(1);
			expect(f(3)).to.equal(2);
			expect(f(4)).to.equal(3);
			expect(f(5)).to.equal(4);
			expect(f(6)).to.equal(5);
			expect(f(0)).to.equal(6);
			
			let thursday = new Date(2015, 0, 15);
			let sunday = new Date(2015, 0, 18);
			expect(mondayOf(thursday).getTime()).to.equal((new Date(2015, 0, 12)).getTime());
			expect(mondayOf(sunday).getTime()).to.equal((new Date(2015, 0, 12)).getTime());
		});

		const addDays = (count, date)=> new Date(date.getTime() + dayLength * count);

		it('is a base to find the other days around a date', ()=>{
			let thursday = new Date(2015, 0, 15);
			let sunday = addDays(6, mondayOf(thursday));
			expect(sunday.getTime()).to.equal((new Date(2015, 0, 18)).getTime());
		})
	})
	
});
