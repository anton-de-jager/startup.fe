import { Component, OnInit, AfterViewInit, Inject, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0
};

// const internalGetCurrentPosition = async (options: GeolocationOptions = {}): Promise<GeolocationPosition> => {
//   return new Promise<GeolocationPosition>((resolve, reject) => {
//     const id = Geolocation.watchPosition(options, (position, err) => {
//       Geolocation.clearWatch({id});
//       if(err) {
//         reject(err);
//         return;
//       }
//       resolve(position);
//     });
//   });
// };

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
  selector: 'app-address',
  templateUrl: './dialog-address.component.html',
  styleUrls: ['./dialog-address.component.scss']
})
export class DialogAddressComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  location = { lat: 28.1045642, lon: -26.3296247, label: '' };
  address = '';
  addressForm: UntypedFormGroup;

  coordinate: any;
  watchCoordinate: any;
  watchId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddressComponent>,
    private _formBuilder: UntypedFormBuilder,
    private zone: NgZone) {
    if (data) {
      this.location.lat = data.lat;
      this.location.lon = data.lon;
      this.location.label = data.label;
      this.address = data.address;
    }
    L.Icon.Default.imagePath = "assets/images/leaflet/"
  }

  ngOnInit(): void {
    this.addressForm = this._formBuilder.group({
      address: [this.address, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.initMap(this.location.lat, this.location.lon);
    this.initAutocomplete();
  }

  private initMap(lat, lon): void {
    this.map = L.map('map', {
      center: [lat, lon],
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    let marker = L.marker(new L.LatLng(lat, lon), { draggable: true });

    marker.addTo(this.map);
    marker.on('drag', this.markerMove, this);
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

  async current() {
    this.map.remove();
    if (Capacitor.getPlatform() !== 'web') {
      const geolocationEnabled = await Geolocation.checkPermissions();

      if (geolocationEnabled.location !== 'granted') {
        const granted = await Geolocation.requestPermissions();

        if (granted.location !== 'granted') {
          return;
        }
      }
    }
    Geolocation.getCurrentPosition().then(res => {
      console.log(res);
      this.location.lat = res.coords.latitude;
      this.location.lon = res.coords.longitude;
      this.initMap(res.coords.latitude, res.coords.longitude);
      this.initAutocomplete();
    });
    // this.clearWatch();
    // this.getCurrentCoordinate();
    // this.watchPosition();
  }

  async requestPermissions() {
    const permResult = await Geolocation.requestPermissions();
    console.log('Perm request result: ', permResult);
  }

  async getCurrentCoordinate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }
    if (Capacitor.getPlatform() !== 'web') {
      const geolocationEnabled = await Geolocation.checkPermissions();

      if (geolocationEnabled.location !== 'granted') {
        const granted = await Geolocation.requestPermissions();

        if (granted.location !== 'granted') {
          return;
        }
      }
    }
    Geolocation.getCurrentPosition().then(data => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        accuracy: data.coords.accuracy
      };
      console.log(this.coordinate);
    }).catch(err => {
      console.error(err);
    });
  }

  watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({}, (position, err) => {
        console.log('Watch', position);
        this.zone.run(() => {
          this.watchCoordinate = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log(this.watchCoordinate);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  clearWatch() {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
  submit(): void {
    this.dialogRef.close({ location: this.location, address: this.addressForm.value.address });
  }
}
