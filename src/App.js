import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  //mounts component + renders map in window
  componentDidMount() {
    this.renderMap()
  }

  //loads api key and calls back to the window
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?client=gme-nianticinc&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    //puts map in window
    //initial coords @ nyc
    let map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7128, lng: -74.0060},
        zoom: 12
    })
  }


  render() {
    return (
      <main> //contains map
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
