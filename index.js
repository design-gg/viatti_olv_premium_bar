window.addEventListener("load", function() {
	let banner;
	if(banner = document.querySelector(".viattiolvcd")) {
		banner.classList.add("viattiolvcd-showup");
		banner.classList.add("viattiolvcd-tireshow");
		if (window.matchMedia("(min-width:600px)").matches) {
			banner.style.willChange = "height, scale";
			banner.querySelector(".viattiolvcd-video").style.willChange = "height";
			banner.querySelector(".viattiolvcd-about").style.willChange = "height";
			let trg;
			banner.addEventListener("mouseenter", function() {
				trg = event.target;
				setTimeout(() => {
					trg.classList.add("viattiolvcd-hovered");
				}, 0);
			});
			banner.addEventListener("mouseleave", function() {
				event.target.classList.remove("viattiolvcd-hovered");
				event.target.classList.add("viattiolvcd-unhover");
				setTimeout(() => {
					banner.classList.remove("viattiolvcd-unhover");
					banner.querySelector(".viattiolvcd-video").style.removeProperty("will-change");
					banner.querySelector(".viattiolvcd-about").style.removeProperty("will-change");
				}, 500);
			});

			setTimeout(() => {
				banner.style.willChange = "auto";
			}, 1000);
		}
		else {
			// for mobile expand banner on load page
			banner.style.willChange = "height, scale";
			banner.querySelector(".viattiolvcd-video").style.willChange = "width, left";
			banner.querySelector(".viattiolvcd-about").style.willChange = "width, margin-left, height";
			banner.classList.add("viattiolvcd-showup", "viattiolvcd-expand", "viattiolvcd-expanded");			
			viattiolvcd.getEndingVideo(banner);

			viattiolvcd._banner = banner;
			viattiolvcd.onLoadScrollPosition = window.scrollY;
			window.addEventListener("scroll", viattiolvcd.handleScroll);
			document.addEventListener("touchmove", viattiolvcd.handleScroll, { passive: true });
		}

		let touchstartY = 0;
		let touchendY = 0;

		function checkDirection() {
			if (touchendY < touchstartY) {
				if(banner = document.querySelector(".viattiolvcd")) {
					if(viattiolvcd.touchEndEl) {
						viattiolvcd.expand(banner, false, "down");
					}
				}
			}
			if (touchendY > touchstartY) {
				if(banner = document.querySelector(".viattiolvcd")) {
					if(viattiolvcd.touchstartEl) {
						viattiolvcd.expand(banner, false, "up");
					}
				}
			}
		}

		document.addEventListener('touchstart', (e) => {
			viattiolvcd.touchstartEl = false;
			if(e.target.closest(".viattiolvcd")) {
				viattiolvcd.touchstartEl = true;
			}
			touchstartY = e.changedTouches[0].screenX;
		});
		
		document.addEventListener('touchend', (e) => {
			viattiolvcd.touchEndEl = false;
			let touch = e.changedTouches[0];
			let _touchEndEl = document.elementFromPoint(touch.clientX, touch.clientY);
			touchendY = touch.screenX;
			if(_touchEndEl.closest(".viattiolvcd")) {
				viattiolvcd.touchEndEl = true;
			}
			
			checkDirection();			
		});
	}			
})

var viattiolvcd = {
	toggleMute: function(sender) {
		event.preventDefault();
		event.stopPropagation();
		sender.classList.toggle("mute-on");
		let video = sender.parentNode.querySelector("video");
		let isMuted = video.muted;

		video.muted = !isMuted;

		sender.setAttribute('aria-pressed', isMuted);
		sender.setAttribute('aria-label', !isMuted ? 'Включить звук' : 'Выключить звук');
	},
	expand: function(sender, isClick, direction) {
		let _sender = sender;

		if(isClick) {
			event.preventDefault();
			event.stopPropagation();
			_sender = sender.closest(".viattiolvcd");
		}
		
		if(_sender.classList.contains("viattiolvcd-expand")) {
			if(direction && direction != "down") return;
			_sender.classList.remove("viattiolvcd-expand");
			setTimeout(() => {
				_sender.classList.remove("viattiolvcd-expanded");
				setTimeout(() => {
					_sender.style.willChange = "auto";
					_sender.querySelector(".viattiolvcd-video").style.willChange = "auto";
					_sender.querySelector(".viattiolvcd-about").style.willChange = "auto";
				}, 600)
			}, 15);
		}
		else {
			if(direction && direction != "up") return;
			_sender.style.willChange = "height, scale";
			_sender.querySelector(".viattiolvcd-video").style.willChange = "width, left";
			_sender.querySelector(".viattiolvcd-about").style.willChange = "width, margin-left, height";
			_sender.classList.add("viattiolvcd-expand");
			setTimeout(() => {
				_sender.classList.add("viattiolvcd-expanded");
			}, 15);
		}
	},
	getEndingVideo: function(banner) {
		const video = banner.querySelector("video");			
		if(!video) return;

		let timerId = setInterval(() => {
			if(video.currentTime >= video.duration - .25) {
				viattiolvcd.expand(banner, false, "down");
				clearInterval(timerId);
			}
		}, 1000);	
	},
	handleScroll: function() {
		let vpH = window.innerHeight;
		let currentScrollPosition = window.scrollY;
		let fullHeightPage = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
			);

		if((currentScrollPosition > viattiolvcd.onLoadScrollPosition) && ((currentScrollPosition - viattiolvcd.onLoadScrollPosition) >= vpH / 2)) {
			viattiolvcd.expand(viattiolvcd._banner, false, "down");
			window.removeEventListener("scroll", viattiolvcd.handleScroll);
			document.removeEventListener("touchmove", viattiolvcd.handleScroll);
		}
		if(currentScrollPosition + vpH >= fullHeightPage) {
			viattiolvcd.expand(viattiolvcd._banner, false, "down");
			window.removeEventListener("scroll", viattiolvcd.handleScroll);
			document.removeEventListener("touchmove", viattiolvcd.handleScroll);
		}
	}
}
