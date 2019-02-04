class Slider {
	/**
	 * @param {number} maxImages     Maximum images in the slider
	 * @param {object} classSlider   Attribut to select figures
	 * @param {number} timeInterval  Set time between every slides
	 */
	constructor(maxImages, classSlider, timeInterval) {
		this.items = classSlider;
		this.imageNum = 0;
		this.maxImages = maxImages;
		this.timeInterval = timeInterval;
		this.slideInterval = setInterval(this.nextSlide.bind(this), this.timeInterval);
		this.controls = "play";
		this.icon = document.querySelector(".button_slider i");

		document.getElementById("nextBtn").addEventListener("click", this.nextSlide.bind(this));

		document.getElementById("prevBtn").addEventListener("click", this.prevSlide.bind(this));

		document.addEventListener("keydown", this.keybordControl.bind(this));

		document.querySelector(".button_slider").addEventListener("click", () => {
			this.icon.classList.toggle("fa-play");
			this.icon.classList.toggle("fa-pause");
			this.actualControl();
		});
	}
	/**
	 * This method is for move the slider between images with keybord
	 * @param {object} e event object
	 */
	keybordControl(e) {
		if (e.keyCode === 39) {
			this.nextSlide();
		} else if (e.keyCode === 37) {
			this.prevSlide();
		}
	}
	/**
	 * Method to allow the slide to move forward
	 */
	nextSlide() {
		this.items[this.imageNum].style.opacity = "0";
		if (this.imageNum >= this.maxImages) {
			this.imageNum = 0;
		} else {
			this.imageNum++;
		}
		this.items[this.imageNum].style.opacity = "1";
	}
	/**
	 * Method to allow the slide to move back
	 */
	prevSlide() {
		this.items[this.imageNum].style.opacity = "0";
		if (this.imageNum <= 0) {
			this.imageNum = this.maxImages;
		} else {
			this.imageNum--;
		}
		this.items[this.imageNum].style.opacity = "1";
	}
	/**
	 * Method to stop the slide
	 */
	pauseInterval() {
		if (this.controls === "play") {
			clearInterval(this.slideInterval);
			this.controls = "pause";
		}
	}
	/**
	 * Method to activate auto scrolling
	 */
	playInterval() {
		if (this.controls === "pause") {
			this.slideInterval = setInterval(this.nextSlide.bind(this), this.timeInterval);
			this.controls = "play";
		}
	}

	actualControl() {
		if (this.controls === "pause") {
			this.playInterval();
		} else {
			this.pauseInterval();
		}

	}
};
