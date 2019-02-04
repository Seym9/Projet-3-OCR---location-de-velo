window.addEventListener("load", () => {
	var slider = new Slider(3, document.getElementsByClassName("item_slider"), 5000);

	var map1 = new Map('mapid', '5f4ceec050937cc5749de2334df9c5f7b4b4e048', 'Nantes', 47.216728, -1.553095, booking);

	var canvas = new Canvas('canvas', 'clearBtn');

	var booking = new Reservation('formResa', map1, canvas);
});
