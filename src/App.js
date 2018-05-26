import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor () {
    super()
    this.state = {
      results: []
    }
    this.baseUrl = 'http://hapi.fhir.org/baseDstu3/';
    this.searchText = 'Watson';
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Fetch a practitioner!</h1>
        </header>
        <p className="App-intro">
        <button className="square" onClick={() => this.search()}>
          Search!
        </button>
        </p>
        {this.state.results.map(function(listValue, i){
          return (<DataDisplay resource={listValue} key={i}></DataDisplay>);
        })}
      </div>
    );
  }

  // Queries the server using practitioner name (in this case Watson) and returns details and org
  search() {
    this.setState({
      results: []
    });
    
    // Fetch practitioner info first, then use info to fetch organization
    fetch(this.baseUrl + 'Practitioner?family=' + this.searchText)
    .then(data => {
      return data.json();
    }).then(res => {
      res.entry.map(entry => {
        fetch(this.baseUrl + entry.resource.extension[0].valueReference.reference)
        .then(orgData => {
          return orgData.json();
        }).then(org => {
          var final = {
            practitioner: entry,
            organization: org,
          };

          //add to final results
          this.setState({
            results: [...this.state.results, final]
          });
        });
      });
    });
  }

}


// Returns and displays name of practitioner and organization details
function DataDisplay(props) {
  return (
    <span>
    {props.resource.practitioner.resource.name.map(function(resource, index) {
      return (
        <h2 key={index}>{resource.prefix}
          {resource.given.map((name, i) => <span key={i}> {name} </span>)}
          {resource.family}
        </h2>
      );
    })}
    <h4>{props.resource.organization.name}</h4>
    {props.resource.organization.address.map(function(address, index) {
      return (
        <span>
          <h6>{address.line.map((street, i) => <span key={i}> {street} </span>)}</h6>
          <h6>{address.postalCode}</h6>
          <h6>{address.city}</h6>
          <h6>{address.country}</h6>
        </span>
      );
    })}
    </span>
  );
}


export default App;
