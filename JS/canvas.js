class Canvas {

	/**
	 * @param {string} canvasId   id of the canvas
	 * @param {string} clearBtnId id of the button for clear the canvas 
	 */
	constructor(canvasId, clearBtnId) {
		this.canvas = $(`#${canvasId}`);
		this.idBtnClear = clearBtnId;
		this.ctx = this.canvas[0].getContext("2d");

		this.ctx.lineWidth = 2;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";

		this.painting = false;
		this.isEmpty = true;

		this.canvas.on("mousedown touchstart", this.mouseDown.bind(this));
		this.canvas.on("mousemove touchmove", this.draw.bind(this));
		this.canvas.on("mouseleave touchend", this.mouseUp.bind(this));
		this.canvas.on("mouseup", this.mouseUp.bind(this));

		$(`#${this.idBtnClear}`).on("click", this.clearCanvas.bind(this));

		$(window).on("resize", this.size.bind(this));
	}

	/**
	 * When the mouse is release
	 */
	mouseUp() {
		this.painting = false;
	}

	/**
	 * When the mouse is pressed
	 * @param {object} e event object
	 */
	mouseDown(e) {
		//Prevent scrolling for the touchevents
		e.preventDefault();
		this.ctx.beginPath();
		this.painting = true;
	}

	/**
	 * The method to define the drawning with tactil or mouse and place the cursor inside the canvas and hide the offset
	 * @param {object} e event object
	 */
	draw(e) {
		if (!this.painting) return;

		let posY;
		let posX;

		if (e.type === "touchmove") {
			posY = e.originalEvent.touches[0].pageY;
			posX = e.originalEvent.touches[0].pageX;
		} else {
			posY = e.pageY;
			posX = e.pageX;
		}

		let topPos = posY - this.canvas.offset().top;
		let leftPos = posX - this.canvas.offset().left;

		this.ctx.lineTo(leftPos, topPos);
		this.ctx.stroke();

		this.isEmpty = false;
	}

	/**
	 * Clear the canvas to draw again 
	 */
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);
		this.isEmpty = true;
	}

	size() {
		$("#canvas")[0].width = $("#lastName").width();

		this.ctx.lineWidth = 2;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";

		this.isEmpty = true;
	}
}
