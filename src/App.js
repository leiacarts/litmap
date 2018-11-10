import React, { Component } from 'react';
import './App.css';
import axios from 'axios'; //to call foursquare venues

class App extends Component {
  state = {
    venues: []
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

    //displays map in window
    //initial coords @ nyc
    let map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7128, lng: -74.0060},
        zoom: 12
    })

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
      <main>
        <div id="map"></div>
      </main>
    )
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
