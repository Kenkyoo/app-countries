// script.js
$(document).ready(function () {
  const colors = ['#3C5B6F', '#153448', '#948979', "#DFD0B8"];
  $('.theme-color').each(function (index) {
    $(this).css('background-color', colors[index % colors.length]);
  });

  fetch('countries.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      initializeSearch(data);
      displayCountries(data);
      displayFlags(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

  function initializeSearch(data) {
    $('.ui.search').search({
      source: data,
      searchFields: ['en_short_name'],
      minCharacters: 3,
      onResults(response) {
        displaySearchResult(response.results);
      },
      onResultsClose() {
        displayCountries(data);
      }
    });
  }

  function displaySearchResult(results) {
    $('#result').empty();
    if (Array.isArray(results) && results.length > 0) {
      const { alpha_2_code, en_short_name, alpha_3_code, num_code } = results[0];
      const item = createCountryItem(alpha_2_code, en_short_name, alpha_3_code, num_code);
      $('#result').append(item);
    } else {
      $('#result').text('Sin resultados');
    }
  }

  function displayCountries(countries) {
    $('#result').empty();
    countries.forEach(country => {
      const item = createCountryItem(country.alpha_2_code, country.en_short_name, country.alpha_3_code, country.num_code);
      $('#result').append(item);
    });
  }

  function displayFlags(flags) {
    $('#pagination').empty();
    flags.forEach(flag => {
      const item = `<a class="item"><i class="${flag.alpha_2_code.toLowerCase()} flag"></i></a>`;
      $('#pagination').append(item);
    });
  }

  function createCountryItem(alpha2, name, alpha3, num) {
    return `
            <div class="item">
                <div class="middle aligned content">
                    <div class="header">
                        <i class="${alpha2.toLowerCase()} huge flag"></i>
                        ${name} (${num})
                    </div>
                </div>
                <div class="ui right floated">${alpha3}</div>
            </div>
        `;
  }

  window.onscroll = function () {
    const stickyDiv = document.getElementById("pagination");
    const sticky = stickyDiv.offsetTop;
    if (window.pageYOffset > sticky) {
      stickyDiv.classList.add("fixed");
    } else {
      stickyDiv.classList.remove("fixed");
    }
  };
});
