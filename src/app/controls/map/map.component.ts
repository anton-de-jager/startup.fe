import { Component, OnInit, AfterViewInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MatSnackBar } from '@angular/material/snack-bar';

const myProvider = new OpenStreetMapProvider();


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, AfterViewInit {
    private map: L.Map;
    @Input() current: any;
    @Input() destination: any;
    @Input() label: string = '';
    @Input() editable = false;
    @Input() search = false;

    @Output() select: EventEmitter<any> = new EventEmitter<any>();
    @Output() moveItem: EventEmitter<any> = new EventEmitter<any>();

    mapReady: boolean = false;

    constructor(
        private _snackBar: MatSnackBar
    ) {
        L.Icon.Default.imagePath = "assets/images/leaflet/"
        // L.Icon.Default.mergeOptions({
        //     iconRetinaUrl: 'assets/images/leaflet/marker-icon-2x.png',
        //     iconUrl: 'assets/images/leaflet/marker-icon.png',
        //     shadowUrl: 'assets/images/leaflet/marker-shadow.png'
        // });
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);

        this.map = L.map('map', {
            center: [this.current.lat, this.current.lon],
            zoom: 16
        });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);

        let marker = L.marker(new L.LatLng(this.current.lat, this.current.lon), { draggable: this.editable });

        marker.addTo(this.map);

        marker.on('click', () => {
            this.select.emit({ lat: this.current.lat, lon: this.current.lon });
        });

        if (this.editable) {
            marker.on("drag", function (e) {
                var marker = e.target;
                var position = marker.getLatLng();
                this.lat = position.lat;
                this.lon = position.lng;
            });
        }

        if (this.destination) {
            // const planOptions: L.Routing.PlanOptions = {
            //     addWaypoints: false,
            //     draggableWaypoints: false,
            //     createMarker: function () { return null; },
            //     createGeocoderElement: function () { return null; },
            //     createGeocoder: function () { return null; }
            // };

            // var minlat = 200, minlon = 200, maxlat = -200, maxlon = -200;

            // let plan = new L.Routing.Plan([new L.LatLng(this.current.lat, this.current.lon), new L.LatLng(this.destination.lat, this.destination.lon)], planOptions);

            // let control = L.Routing.control({
            //     router: L.Routing.osrmv1({
            //         serviceUrl: `http://router.project-osrm.org/route/v1/`
            //     }),
            //     collapsible: false,
            //     showAlternatives: false,
            //     fitSelectedRoutes: false,
            //     show: false,
            //     routeWhileDragging: false,
            //     plan
            // });
            // control.addTo(this.map).getContainer().style.display = "None";

            // if (minlat > this.current.lat) minlat = this.current.lat;
            // if (minlon > this.current.lon) minlon = this.current.lon;
            // if (maxlat < this.current.lat) maxlat = this.current.lat;
            // if (maxlon < this.current.lon) maxlon = this.current.lon;

            // if (minlat > this.destination.lat) minlat = this.destination.lat;
            // if (minlon > this.destination.lon) minlon = this.destination.lon;
            // if (maxlat < this.destination.lat) maxlat = this.destination.lat;
            // if (maxlon < this.destination.lon) maxlon = this.destination.lon;

            // L.marker(new L.LatLng(this.current.lat, this.current.lon)).addTo(this.map);
            // L.marker(new L.LatLng(this.destination.lat, this.destination.lon)).addTo(this.map);

            // setTimeout(() => {
            //     this.map.fitBounds(L.latLngBounds(new L.LatLng(minlat, minlon), new L.LatLng(maxlat, maxlon)))
            // }, 100);
        }

        if (this.search) {
            this.map.addControl(GeoSearchControl({
                provider: myProvider, // required
                showMarker: true, // optional: true|false  - default true
                showPopup: false, // optional: true|false  - default false
                marker: {
                    // optional: L.Marker    - default L.Icon.Default
                    icon: new L.Icon.Default(),
                    draggable: false,
                },
                popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
                resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
                maxMarkers: 1, // optional: number      - default 1
                retainZoomLevel: false, // optional: true|false  - default false
                animateZoom: true, // optional: true|false  - default true
                autoClose: false, // optional: true|false  - default false
                searchLabel: 'Enter address', // optional: string      - default 'Enter address'
                keepResult: false, // optional: true|false  - default false
                updateMap: true, // optional: true|false  - default true
            }));
        }
    }
}