import React, { Component } from 'react';

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
          onChange={event => this.props.updateQuery(event.target.value)}
        />
      </div>
    );
  }
}

export default Search;
