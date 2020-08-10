'use strict';

const apiKey = 'eleBssoK9XWGnVTT8MyYHtwuzuJ9bQ1L1Y2oYHFf'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


function createQueryParameters(query, maxResults, states) {
  const params = {
    api_key: apiKey,
    q: query,
    stateCode: states,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
        console.log(responseJson)
        createList(responseJson)
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayList(listHTML) {
    $('#js-park-list').html(listHTML);
    $('#list-container').removeClass('hidden');
}

function createList(responseJson) {
    let listHTML = "";
    for (let i=0; i < responseJson.data.length; i++) {
        let addressObject = findAddress(responseJson.data[i]);
        listHTML += `<li><h4>${responseJson.data[i].fullName}</h4><ul><li>${responseJson.data[i].description}</li><br><li><a href="${responseJson.data[i].url}">Website</a></li><li><h5>Physical Address</h5><ul><li>${addressObject.line1}<br>`;
        if (addressObject.line2.length > 0) {
            listHTML += `${addressObject.line2}<br>`
        }
        if (addressObject.line3.length > 0) {
            listHTML += `${addressObject.line3}<br>`
        }
        listHTML += `${addressObject.city}, ${addressObject.stateCode} ${addressObject.postalCode}</li></ul></ul></li>`
    }
    displayList(listHTML);
}

function findAddress(object) {
    for (let i=0; i < object.addresses.length; i++) {
        if (object.addresses[i].type === 'Physical') {
            return object.addresses[i];
        }
    }
    return null;
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    let states = $('#js-states').val();
    states = states.split(', ');
    states = states.join();
    createQueryParameters(searchTerm, maxResults, states);
  });
}

$(watchForm);