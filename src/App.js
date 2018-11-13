import React, { Component } from 'react';
import './App.css';
import axios from 'axios'; //to call foursquare venues
import MenuComp from './menu';
import Search from './search'
import './styles.css';
import escapeRegExp from 'escape-string-regexp';


class App extends Component {

  //empty arrays for values
  constructor(props) {
    super(props)
    this.state = {
      venues: [],
      markers: [],
      showVenues: [],
      query: '',
      hiddenVenues: []
    }
  }

  //mounts component + renders map in window
  componentDidMount() {
    this.getVenues()
  }

  //loads api key and calls back to the window
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?client=gme-nianticinc&callback=initMap")
    window.initMap = this.initMap
  }

  //calls api and gets venues
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "WNVAX2X5TR1B45L5VZYWPWNWHRGNVOC2XCV2J4LZTY5LP3XG",
      client_secret: "OION40GRCHFOBEABP5LHGTD5CCVVP4BVNY2YVXDMWHTUY13Q",
      query: "bookstore",
      near: "New York City",
      v: "20181109"
    }

    //retrieves + stores data asynchronously
    //map loads only after response is fetched
    axios
      .get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          //array of objects (coords) from foursquare
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log("error: " + error)
      })
  }

  //creates map
  initMap = () => {

    //map style
    let styledMapType = new window.google.maps.StyledMapType(
      [{
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [{"weight": "2.00"}]
      },
      {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#9c9c9c"}]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [{"visibility": "on"}]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{"color": "#f2f2f2"}]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ffffff"}]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ffffff"}]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{"saturation": -100}, {"lightness": 45}]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#eeeeee"}]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#7b7b7b"}]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{"color": "#ffffff"}]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{"visibility": "simplified"}]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#c8d7d4"}]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#070707"}]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{"color": "#ffffff"}]
    }],
            {name: 'Stylized'});


    //displays map in window
    //initial coords @ parsons nyc
    let map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7353, lng: -73.9946},
        zoom: 14,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
    })

    //sets map style on main
    map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

    //creates infobox per marker
    let infowindow = new window.google.maps.InfoWindow()
    this.infowindow = infowindow

    //loops through venues array inside state
    this.state.venues.map(myVenue => {

      let contents = `${myVenue.venue.name}`

      //adds a marker to each venue
      let marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name
      })

      //marker
      marker.addListener('click', function() {
        //changes contents
        infowindow.setContent(contents)
        //opens infobox onclick
        infowindow.open(map, marker)
      })
    })

  }

  updateQuery = query => {
    this.setState({ query })
    this.state.markers.map(marker => marker.setVisible(true))
    let filterVenues
    let hiddenVenues

    if (query) {
      let match = new RegExp(escapeRegExp(query), "i")
      filterVenues = this.state.venues.filter(myVenue =>
        match.test(myVenue.venue.name)
      )
      this.setState({ venues: filterVenues })
      hiddenVenues = this.state.markers.filter(marker =>
        filterVenues.every(myVenue => myVenue.venue.name !== marker.title)
      )
      hiddenVenues.forEach(marker => marker.setVisible(false))
      this.setState({ hiddenVenues })
    } else {
      this.setState({ venues: this.state.showVenues })
      this.state.markers.forEach(marker => marker.setVisible(true))
    }
  }

  render() {
    // contains map
    return (
      <main>

        <nav className="topbar" aria-label="header" tabIndex="0">
          <h2>lit map nyc</h2>
        </nav>

        <div id="search" aria-label="search">
          <Search
            venues={this.state.showVenues}
            markers={this.state.markers}
            filteredVenues={this.filteredVenues}
            query={this.state.query}
            clearQuery={this.clearQuery}
            updateQuery={j => this.updateQuery(j)}
            clickVenue={this.clickVenue}
          />
        </div>

        <div id="menu container" aria-label="menu">
          <MenuComp
            venues={this.state.venues}
            markers={this.state.markers}
          />
        </div>

        <div id="map"
          aria-label="map"
          role="application"
        >
        </div>

      </main>
    );
  }
}

//loads scripts to the window
function loadScript(url) {
  let index = window.document.getElementsByTagName("script")[0]
  let script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
