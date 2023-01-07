import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

const iconRetinaUrl = 'assets/images/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/images/leaflet/location_green.png';
const shadowUrl = 'assets/images/leaflet/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl: 'assets/images/leaflet/location_green.png',
  shadowUrl,
  iconSize: [23, 33],
  iconAnchor: [16, 33],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [33, 33]
});
const iconFrom = L.icon({
  iconRetinaUrl,
  iconUrl: 'assets/images/leaflet/truck_green.png',
  shadowUrl,
  iconSize: [33, 33],
  iconAnchor: [16, 33],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [33, 33]
});
const iconTo = L.icon({
  iconRetinaUrl,
  iconUrl: 'assets/images/leaflet/location_red.png',
  shadowUrl,
  iconSize: [23, 32],
  iconAnchor: [12, 32],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [32, 32]
});
const myProvider = new OpenStreetMapProvider();

@Component({
  selector: 'dialog-map',
  templateUrl: './dialog-map.component.html',
  styleUrls: ['./dialog-map.component.scss']
})
export class DialogMapComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  location = { lat: 28.1045642, lon: -26.3296247, label: '' };
  marker: L.Marker<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogMapComponent>,
    private _formBuilder: UntypedFormBuilder) {
    if (data) {
      this.location.lat = data.lat;
      this.location.lon = data.lon;
      this.location.label = data.label;
    }
    L.Icon.Default.imagePath = "assets/images/leaflet/"
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.initAutocomplete();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.location.lat, this.location.lon],
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.marker = L.marker(new L.LatLng(this.location.lat, this.location.lon), { draggable: true });

    this.marker.addTo(this.map);
    this.marker.on('drag', this.markerMove, this);
    // marker.on("drag", function (e) {
    //   var marker = e.target;
    //   var position = marker.getLatLng();
    //   this.markerMove(position);
    // });

    this.map.addControl(GeoSearchControl({      
      provider: myProvider, // required
      showMarker: true, // optional: true|false  - default true
      showPopup: false, // optional: true|false  - default false
      marker: {
        icon: new L.Icon.Default(),
        draggable: true,
      },    
      popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
      resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
      maxMarkers: 1, // optional: number      - default 1
      retainZoomLevel: false, // optional: true|false  - default false
      animateZoom: true, // optional: true|false  - default true
      autoClose: false, // optional: true|false  - default false
      searchLabel: this.data.label, // optional: string      - default 'Enter address'
      keepResult: false, // optional: true|false  - default false
      updateMap: true, // optional: true|false  - default true
    }));

    this.map.on('geosearch/showlocation', this.searchEventHandler, this);
  }

  searchEventHandler(result) {
    this.marker.removeFrom(this.map);
    this.marker = L.marker(new L.LatLng(result.location.x, result.location.y), { draggable: true });   
    this.marker.addTo(this.map);
    this.marker.on('drag', this.markerMove, this); 
    this.location.lat = result.location.y;
    this.location.lon = result.location.x;
  }

  markerMove(e) {
    var marker = e.target;
    var position = marker.getLatLng();

    this.location.lat = position.lat;
    this.location.lon = position.lng;
  }

  initAutocomplete() {
    // const input = document.getElementById("pac-input") as HTMLInputElement;
    // var options = {
    //   componentRestrictions: { country: 'za' }
    // };
    // const searchBox = new google.maps.places.Autocomplete(input, options);

    // searchBox.addListener("place_changed", () => {
    //   const place = searchBox.getPlace();

    //     if (!place.geometry || !place.geometry.location) {
    //       console.log("Returned place contains no geometry");
    //       return;
    //     }

    //     this.location.lat = place.geometry.location.lat();
    //     this.location.lon = place.geometry.location.lng();
    //     this.location.label = place.formatted_address;

    //     L.marker(new L.LatLng(this.location.lat, this.location.lon), { icon: iconDefault }).addTo(this.map);

    //     setTimeout(() => {
    //       this.map.fitBounds(L.latLngBounds(new L.LatLng(this.location.lat, this.location.lon), new L.LatLng(this.location.lat, this.location.lon)))
    //     }, 100);
    // });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
  submit(): void {
    this.dialogRef.close({ location: this.location });
  }
}
