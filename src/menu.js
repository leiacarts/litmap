import React, { Component } from 'react';
import axios from 'axios';
import App from './App.js';
import { slide as Menu } from 'react-burger-menu';
import Drawer from '@material-ui/core/Drawer';


class MenuComp extends Component {
  state = {
    open: false,
    query: ""
  }

  //updates search query
  updateQuery = (newQuery) => {
    this.setState({ query: newQuery })
    this.props.filterVenues(newQuery);
  }

  //toggles menu drawer open
  render() {
    return (
      <Drawer open={this.props.open} onClose={this.props.toggleMenu}>
        <section className="menu">
          <input
            className='filter'
            type='text'
            placeholder='filter'
            autoFocus
            id="query-filter"
            onChange= {e => this.updateQuery(e.target.value)}
            value={this.props.query}
          />
          <ul className="list">
            {this.props.venues && this.props.venues.map((location, index) => {
              return (
                <li className='listing' key={index}>
                  <button key={index} onClick={() => this.props.clickListItem(index)}>{location.name.toString().toLowerCase().index()}</button>
                </li>
              )
            })}
          </ul>
        </section>
      </Drawer>
    )
  }

}

export default MenuComp
