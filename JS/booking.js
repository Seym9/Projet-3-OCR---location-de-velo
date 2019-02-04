class Reservation {

	/**
	 * @param {string} formId       id of the form in HTML
	 * @param {object} mapObject    name of the var who instance the map
	 * @param {object} canvasObject name of the var who instance the canvas
	 */
	constructor(formId, mapObject, canvasObject) {
		$("#" + formId).on("submit", this.book.bind(this));
		this.canvas = canvasObject;
		this.mapObj = mapObject;

		this.display();
		this.autofill();
		this.timer();
		this.firstState();
		this.backState();

	}



	/**
	 * Test the element to display a border red or green
	 * @param {boolean} boolean determine the boolean
	 * @param {object}  elt     the element we want to test
	 */
	check(boolean, elt) {
		if (boolean) {
			$(elt).css("border", "1px solid red")
		} else {
			$(elt).css("border", "1px solid green");
		}
	}

	/**
	 * Manage the reservation , store the name of the station and the time in sessionStorage and the first and last name in local storage , determine with a regex if the user correctly meet all the requierments ask in the form
	 * @param {object} e the event of the book object
	 */
	book(e) {
		e.preventDefault();

		this.emptyRegex = /^[\s]*$/;
		let lastname = $("#lastName").val();
		let firstname = $("#firstName").val();

		this.check(this.canvas.isEmpty, $("#canvas"));
		this.check(this.emptyRegex.test(lastname), $("#lastName"));
		this.check(this.emptyRegex.test(firstname), $("#firstName"));

		if ((!this.canvas.isEmpty) && !this.emptyRegex.test(lastname) && !this.emptyRegex.test(firstname)) {
			sessionStorage.setItem("station", this.mapObj.selectedStation.name);
			sessionStorage.setItem("count", Date.now());

			localStorage.setItem("lastname", lastname);
			localStorage.setItem("firstName", firstname);

			this.canvas.clearCanvas();
			this.display();
			this.timer();
			$("#canvas, #lastName, #firstName").css("border", "");
			$("#panel_canvas").hide();
			$("#booking-details").show();
			$("#panel_canvas").hide(500);
			$("#defaut_panel").show(500);
		}
	}

	/**
	 * Display the details of the reservation from local and session storage in HTML
	 */
	display() {
		if (sessionStorage.getItem("station")) {
			$('#station_booked').text(`${sessionStorage.getItem("station")}`);
			$('#station_booked').text(`${sessionStorage.getItem("station")}`);
			$('#name_booker').text(`${localStorage.getItem("lastname")} ${localStorage.getItem("firstName")}`);
			$("#booking-details").show();
		}
	}

	/**
	 * Hide the panel who contains the station informations to show the form
	 */
	firstState() {

		$("#btn_panel").on("click", () => {
			if ($("#panel_info").css("display") === "block") {
				$("#panel_info").hide(500);
				$("#panel_canvas").show(500, () => {
					this.canvas.size();
				});
			}
		});
	}

	/**
	 * When the user is on the form panel , return on the station informations panel when he click on the button
	 */
	backState() {
		$("#back_state").on("click", () => {
			if ($("#panel_canvas").css("display") === "block") {
				$("#panel_canvas").hide(500);
				$("#panel_info").show(500);
			}
		});
	}

	/**
	 * If the user already used the app , fill his last and first name inside the form automatically
	 */
	autofill() {
		if (localStorage.getItem("lastname")) {
			$("#lastName").val(localStorage.getItem("lastname"));
			$("#firstName").val(localStorage.getItem("firstName"));
		}
	}

	/**
	 * Timer of 20 minutes (can be easily changed) this timer use the Date object so it continue until the user close the session
	 */
	timer() {
		let minutes = 20;
		let minInMs = minutes * 60 * 1000;

		let chrono = setInterval(() => {

			let time = Date.now() - Number(sessionStorage.getItem("count"));

			let timeRemain = minInMs - time;

			let minuteRemain = Math.floor(timeRemain / 1000 / 60)
			let secondsRemain = Math.floor(timeRemain / 1000 % 60);

			if (String(secondsRemain).length === 1) {
				secondsRemain = "0" + secondsRemain;
			}
			if (time < minInMs) {
				$("#time").text(minuteRemain + "min " + secondsRemain + "s");
			} else {
				clearInterval(chrono);
				sessionStorage.clear();
				$("#booking-details").hide();
			}
		}, 1000);
	}
}
