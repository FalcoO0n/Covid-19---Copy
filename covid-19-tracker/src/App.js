import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, Component, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';
import Table from "./Table";
import { sortData} from "./util";

function App() {
	const [ countries, setCountries ] = useState([]);
	const [ country, setCountry ] = useState('worldwide');
	const [ countryInfo, setCountryInfo ] = useState({});
	const [ tableData, setTableData ] = useState([]);

	useEffect(() => {
		//gets worldwide data and saves it in setCountryInfo
		fetch('https://disease.sh/v3/covid-19/all').then((response) => response.json()).then((data) => {
			setCountryInfo(data);
		});
	});
	//STATE is way to write variable in react
	//useEffect = runs a piece of code based on given condition
	useEffect(() => {
		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries').then((response) => response.json()).then((data) => {
				const countries = data.map((country) => ({
					name: country.country,
					value: country.countryInfo.iso2
				}));
        
        const sortedData = sortData(data);
				setTableData(sortedData);
				setCountries(countries);
			});
		};

		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		setCountry(countryCode);

		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		//api for country change
		//https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
		await fetch(url).then((response) => response.json()).then((data) => {
			setCountry(countryCode); //updating the input field
			setCountryInfo(data); //store the response of country info
			//this will get all the data from the country response
		});
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>Covid-19 Tracker</h1>
					<FormControl classname="app__dropdown">
						<Select varient="outlined" onChange={onCountryChange} value={country}>
							{/* loop through all the countries and show drop down list of the 
            options*/}
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => <MenuItem value={country.value}>{country.name}</MenuItem>)}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					{/* infoboxes titel="Coronavirus cases" */}
					<InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
					{/* infoboxes titel="Coronavirus  */}
					<InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
					{/* infoboxes */}
					<InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
				</div>

				{/* Map */}
				<Map />
			</div>
			<Card className="app__right">
				<CardContent>
					<h3>Live Cases By Country</h3>
					<Table countries={tableData} />
					{/* Table */}
					<h3>Worldwide new cases</h3>    
					{/* Graph */}
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
