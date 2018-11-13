import React, { Component } from 'react';
import './styles.css'

class Search extends Component {
  render() {
    return (
      <div className="venueFilter" role="application">
        <input
          type="text"
          autoFocus
          id="query-filter"
          placeholder="search filter"
          aria-label="venue filter"
          value={this.props.query}
          onChange= {(e) => this.props.updateQuery(e.target.value)}
        />
      </div>
    );
  }
}

export default Search;
