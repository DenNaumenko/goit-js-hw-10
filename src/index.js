import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const countryInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(hendler, DEBOUNCE_DELAY));

function hendler({ target }) {
  const inputValueSanitized = target.value.trim();

  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  if (inputValueSanitized.length) {
    fetchCountryByName(inputValueSanitized)
      .then(result => {
        if (result.length > 10) {
          Notiflix.Notify.failure(
            `Too many matches found. Please enter a more specific name.`
          );
          return;
        }

        if (result.length > 1) {
          const arrayOfCountries = [];
          for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const countryObj = {
              nameOficial: element.name.official,
              flags: element.flags.svg,
            };

            arrayOfCountries.push(countryObj);
          }

          const arrayElements = arrayOfCountries.map(
            ({ nameOficial, flags }) => {
              return `<li>
                        <img class="flag_list" src="${flags}" alt="flag" />
                        ${nameOficial}
                    </li>`;
            }
          );

          countryList.insertAdjacentHTML('beforeend', arrayElements.join(''));
          return;
        }

        if (result.length === 1) {
          const resultCountry = result[0];
          const languages = Object.values(resultCountry.languages).join(', ');
          const element = `<img src="${resultCountry.flags.svg}" class="flag" alt="flag">
                            <h2>${resultCountry.name.official}</h2>
                            <b>Capital: </b><span>${resultCountry.capital}</span><br>
                            <b>Population: </b><span>${resultCountry.population}</span><br>
                            <b>Languages: </b><span>${languages}</span>`;

          countryInfo.insertAdjacentHTML('beforeend', element);
          return;
        }
      })
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function fetchCountryByName(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(resp => {
    if (!resp.ok) {
      throw new Error();
    }
    return resp.json();
  });
}
