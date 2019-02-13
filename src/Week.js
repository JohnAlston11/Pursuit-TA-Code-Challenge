import React from 'react';
import axios from 'axios';

export default class Week extends React.Component {
    constructor(){
        super();
    
        this.state = {
          dailyWeather: [], // Holds the daily weather info from the API.
          degree: "F", // Determines if we're viewing in Fahrenheiht or Celsius. Initial set to Fahrenheiht.
          width: 0, // Checks the window height and width for resizing.
          height: 0, // This is for a more responsive design.
          dayName: {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday", 
            3: "Wednesday", // Storing the days of the week for later access.
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
          },
          monthName: {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",  // Storing months of the year for later access.
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December",
          }
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
      }
    
      componentDidMount(){
        
        // HTTP request done using JS library Axios. Makes handling AJAX calls smoother and cleaner.
        axios.get("http://api.aerisapi.com/forecasts/newyork,ny?client_id=IzmQWvILXr0imONBtVQgf&client_secret=4tjdEvQWaHkOHWx4MwsRJhfxPVo1TKvrJzsovx4Y")
        
        .then(response=>{  
          // Targeting the data from the API. All of the useful data was found at this route.
          this.setState({dailyWeather: response.data.response[0].periods})
        })
        .catch((err)=>{console.log(err)}); // If something goes wrong, log the error.
    
        //Informs me on the size of the viewing window. Helps for responsiveness.
        this.updateWindowDimensions();
        
        //Telling the window to check for any resizing and to save it.
        window.addEventListener('resize', this.updateWindowDimensions);
      }
      
      componentWillUnmount(){
        //Tells window to stop checking for the resizing before component quits.
        window.removeEventListener('resize', this.updateWindowDimensions);
      }
    
      updateWindowDimensions() {
        //Storing windows height and width in the state.
        this.setState({ width: window.innerWidth, height: window.innerHeight });
      }
    
      // Handles the button that changes the degrees from fahrenheit to celsius and vice versa.
      handleDegreeToggle = () => {
        const {degree} = this.state;
        // Checking which form the degress is in and changes to the opposite.
        degree === "F" ? this.setState({degree: "C"}) : this.setState({degree: "F"});
      }
    
      // Handling the responsiveness to name of the day.
      handleDayChange = (day) =>{
        const {width, dayName} = this.state;
        // Checking to see if the width is on a smaller screen.
        if(width < 500){
          // If it is return a shorter version of the name of the day.
          return dayName[new Date(day.dateTimeISO).getDay()].slice(0, 3)
        }else{
          // If it isn't, return the entire name.
          return dayName[new Date(day.dateTimeISO).getDay()]
        }
      }
    
      render() {
        const {dailyWeather, monthName, degree} = this.state;
        return (
          <div className="App">
            <h1>NYC Daily Weather</h1>
            {/* Getting the current year */}
            <h3>{new Date().getFullYear()}</h3>
            {/* Getting the current month */}
            <h3>{monthName[new Date().getMonth()]}</h3>
            <div className="weather-container" >
              {dailyWeather.map((day, key)=>(
                <div className="daily"  key={key}>
                  {/* Use the information from the API to pass through the function to get the day */}
                  <p>{this.handleDayChange(day)}</p>
                  {/* Use the information from the API to get the month and date.
                    Adding 1 to the month because the value for the month is zero indexed.
                  */}
                  <p>{`${new Date(day.dateTimeISO).getMonth()+1}/${new Date(day.dateTimeISO).getDate()}`}</p>
                  {/* Using the icon name from the API to target it locally. */}
                  <img src={require(`./icons/${day.icon}`)} alt={day.icon}/>
                  {/* Using the letter stored in state to target the correct degree format in the API. */}
                  <p>HIGH: {day[`maxTemp${degree}`]}&deg;{degree}</p>
                  <p>LOW: {day[`minTemp${degree}`]}&deg;{degree}</p>
                </div>
              ))}
            </div>
            <button className="degree-toggle" onClick={this.handleDegreeToggle}>Fahrenheiht / Celsius</button>
          </div>
        );
    }
}