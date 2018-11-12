import React, { Component } from 'react';
import './App.css';
import axios from 'axios'; //to call foursquare venues
import Menu from './menu';
import './styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

library.add(faBars)

class App extends Component {
  state = {
    venues: [],
    filtered: null,
    selectedIndex: null,
    open: false
  }

  styles = {
    button: {
      position: "absolute",
      left: 10,
      top: 10,
      padding: 10,
      background: "#eeeee"
    }
  }

  //mounts component + renders map in window
  componentDidMount() {
    this.getVenues()
    this.setState({
      filtered: this.filterVenues(this.state.venues, "")
    });
  }

  toggleMenu = () => {
    this.setState({
      open: !this.state.open
    });
  }

  updateQuery = (query) => {
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterVenues(this.state.venues, query)
    })
  }

  filterVenues = (locations, query) => {
    //filter locations to match search terms
    return locations.filter(location => location.name);
  }

  clickListItem = (index) => {
    //set state to chosen locations in array
    this.setState({
      selectedIndex: index,
      open: !this.state.open
    })
  }

  //loads api key and calls back to the window
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?client=gme-nianticinc&callback=initMap")
    window.initMap = this.initMap
  }

  //calls api
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "WNVAX2X5TR1B45L5VZYWPWNWHRGNVOC2XCV2J4LZTY5LP3XG",
      client_secret: "OION40GRCHFOBEABP5LHGTD5CCVVP4BVNY2YVXDMWHTUY13Q",
      query: "bookstore",
      near: "New York City",
      v: "20181109"
    }

    //retrieves + stores data
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
    }
],
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

    map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

    //creates infobox per marker
    let infowindow = new window.google.maps.InfoWindow()

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


  render() {
    // contains map
    return (
      <div id="App">
        <nav className="topbar">
          <h2>lit map nyc</h2>
          <button style={this.styles.button} onClick={this.toggleMenu}><FontAwesomeIcon icon="bars"/></button>
        </nav>

        <main>
          <div id="map"
            locations={this.state.filtered}
            selectedIndex={this.state.selectedIndex}
          >
          </div>
        </main>

        <Menu
          className="menu"
          locations={this.state.filtered}
          open={this.state.open}
          toggleMenu={this.toggleMenu}
          filterVenues={this.updateQuery}
          clickListItem={this.clickListItem}
          selectedIndex={this.state.selectedIndex} />
      </div>
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
