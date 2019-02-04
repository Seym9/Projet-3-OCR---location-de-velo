class Map {

	/**
	 * @param {string} mapid     The id of the div in HTML 
	 * @param {string} key       The API key from JCDecaux
	 * @param {string} city      The city from JCDecaux
	 * @param {number} latitude  The latitute for the center of the map
	 * @param {number} longitude The longitute for the center of the map
	 */
	constructor(mapid, key, city, latitude, longitude, bookingObj) {
		this.mapid = mapid;
		this.key = key;
		this.city = city;
		this.latitude = latitude;
		this.longitude = longitude;
		this.bookingObj = bookingObj;
		this.initMap();
	}

	/**
	 * Create the map with the markers , and the cluster 
	 */
	initMap() {
		this.mymap = L.map(this.mapid).setView([this.latitude, this.longitude], 13);

		let korona = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
			attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 0,
			maxZoom: 18
		});

		this.mymap.addLayer(korona);

		this.markersCluster = new L.MarkerClusterGroup();

		this.getStations();
	}

	/**
	 * Call the api from JCDecaux to generate the stations 
	 */
	getStations() {
		ajaxGet(`https://api.jcdecaux.com/vls/v1/stations?contract=${this.city}&apiKey=${this.key}`, (response) => {
			let stations = JSON.parse(response);
			stations.forEach((station) => {
				this.setMarker(station);
			});
			this.mymap.addLayer(this.markersCluster);
		});
	}

	/**
	 * Statement to choose thr right icon
	 * @param {object} station Station object
	 */
	setMarker(station) {
		let iconPath = "";
		let stationStatus = "";
		let panelBtn = document.getElementById("btn_panel");

		if ((station.status === "OPEN") && (station.available_bikes > 5)) {
			iconPath = 'img/map/cyclingGreen.png';
			stationStatus = "ouvert";
		} else if ((station.status === "OPEN") && (station.available_bikes > 0) && (station.available_bikes <= 5)) {
			iconPath = 'img/map/cyclingOrange.png';
			stationStatus = "ouvert";
		} else {
			iconPath = 'img/map/cyclingRed.png';
			stationStatus = "fermé";
		}

		let icon = L.icon({
			iconUrl: iconPath,
			iconSize: [32, 32],
			iconAnchor: [16, 32],
			popupAnchor: [0, -76]
		});

		let latLng = new L.LatLng(station.position.lat, station.position.lng);

		let marker = new L.Marker(latLng, {
			title: station.address,
			icon: icon
		});

		marker.addEventListener("click", () => {
			this.selectedStation = station;

			if (station.name === sessionStorage.getItem("station")) {
				console.log("station reservé");
			};

			document.getElementById("station_status").textContent = stationStatus;
			document.getElementById("station_name").textContent = station.name;
			document.getElementById("station_stands").textContent = station.available_bike_stands;

			if (station.name === sessionStorage.getItem("station")) {
				document.getElementById("station_bikes").textContent = station.available_bikes - 1 + " (Vous avez une réservation en cours dans cette station)";
			} else {
				document.getElementById("station_bikes").textContent = station.available_bikes;
			}

			if (iconPath.includes("Green")) {
				panelBtn.style.visibility = "visible";
				panelBtn.textContent = "reserver";
			} else if (iconPath.includes("Orange")) {
				panelBtn.style.visibility = "visible";
				panelBtn.textContent = "Plus beaucoup de vélos disponnible !";
			} else {
				panelBtn.style.visibility = "hidden";
			}

			if ($("#defaut_panel").css("display") === "block") {
				$("#defaut_panel").hide(500);
				$("#panel_info").show(500);
			}
		});

		this.markersCluster.addLayer(marker);
	}
}
