"use strict";

const header = document.getElementById('header');  

window.onload=function() 
{   
    headerAnimation();
}

window.onresize=function() 
{   
    headerAnimation();
}

window.onscroll=function() 
{
    headerAnimation();
}


function headerAnimation () {
    let scrollTop = window.scrollY;
	if ( scrollTop > 100 ) {
	    header.classList.add('header-shrink');
	} else {
	    header.classList.remove('header-shrink');
	}

}

let scrollLinks = document.querySelectorAll('.scrollto');
const pageNavWrapper = document.getElementById('navigation');

scrollLinks.forEach((scrollLink) => {

	scrollLink.addEventListener('click', (e) => {
		const href = scrollLink.getAttribute('href');
		if (!href || href.charAt(0) !== '#') {
			return;
		}
		e.preventDefault();
		let element = document.querySelector(href);
		if (!element) return;
		const yOffset = 69;
		const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
		window.scrollTo({top: y, behavior: 'smooth'});
        if (pageNavWrapper && pageNavWrapper.classList.contains('show')){
			pageNavWrapper.classList.remove('show');
		}
    });
});

let spy = new Gumshoe('#navigation a', {
	offset: 69
});


/* ======= Countdown ========= */
let target_date = new Date("Oct 12, 2028").getTime();
let days, hours, minutes, seconds;
let countdown =  document.getElementById("countdown-box");
let days_span = document.createElement("SPAN");
days_span.className = 'days';
countdown.appendChild(days_span);
let hours_span = document.createElement("SPAN");
hours_span.className = 'hours';
countdown.appendChild(hours_span);
let minutes_span = document.createElement("SPAN");
minutes_span.className = 'minutes';
countdown.appendChild(minutes_span);
let secs_span = document.createElement("SPAN");
secs_span.className = 'secs';
countdown.appendChild(secs_span);

setInterval(function () {
    let current_date = new Date().getTime();
    let seconds_left = (target_date - current_date) / 1000;
    days = parseInt(seconds_left / 86400);
    seconds_left = seconds_left % 86400;
    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;
    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);

    days_span.innerHTML = '<span class="number">' + days + '</span>' + '<span class="unit">Days</span>';
    hours_span.innerHTML = '<span class="number">' + hours + '</span>' + '<span class="unit">Hrs</span>';
    minutes_span.innerHTML = '<span class="number">' + minutes + '</span>' + '<span class="unit">Mins</span>';
    secs_span.innerHTML = '<span class="number">' + seconds + '</span>' + '<span class="unit">Secs</span>'; 
 
}, 1000);
