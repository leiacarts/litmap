import React, { Component } from 'react';
import Search from './search';
import { slide as Menu } from 'react-burger-menu';
import './styles.css'


class MenuComp extends Component {


  //opens marker on click
  openSesame = venueName => {
    this.props.markers.map(marker => {
      if (marker.title === venueName) {
        window.google.maps.event.trigger(marker, "click")
      }
    })
  }


  //toggles menu drawer open
  render() {
    return (
      <Menu>
        <div id="search" aria-label="search">
          <Search
            venues={this.props.showVenues}
            markers={this.props.markers}
            filteredVenues={this.filteredVenues}
            query={this.props.query}
            clearQuery={this.clearQuery}
            updateQuery={j => this.updateQuery(j)}
            clickVenue={this.clickVenue}
          />
        </div>

        <div className="venueList" aria-label="list of venues">
          {this.props.venues.map(myVenue => (
              <li
                role="menuitem"
                onClick={() => {
                  this.openSesame(myVenue.venue.name);
                }}
                aria-label={myVenue.venue.name}
                tabIndex="0"
                id={myVenue.venue.id}
                key={myVenue.venue.id}
              >
                {myVenue.venue.name}
                <br/>
              </li>
          ))}
        </div>
      </Menu>
    );
  }
}

export default MenuComp
