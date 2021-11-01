// Notes: I could have likely created more functions below, rather than crowding the app.setWeather function.  I hope it still makes sense!  As always, all comments are appreciated.  Thank you so much!

// --- Namespace variable ---
const app = {};


// --- API variables ---
app.weatherURL = 'http://api.openweathermap.org/data/2.5/forecast?';
app.filmUrl = 'http://www.omdbapi.com/';


// --- API promises ---
app.getWeatherAPI = (city) => {
    const weatherPromise = $.ajax({
        url: app.weatherURL,
        method: 'GET',
        dataType: 'JSON',
        data: {
            appid: process.env.WEATHER_API_KEY,
            q: city
        }
    })
    return weatherPromise;
}

app.getFilmAPI = (title) => {
    const filmPromise = $.ajax({
        url: app.filmUrl,
        method: 'GET',
        dataType: 'JSON',
        data: {
            apiKey: process.env.FILM_API_KEY,
            t: title
        }
    })
    return filmPromise;
}


// --- Event Listeners and functions ---

// Selecting location
app.getLocation = () => {
    $('select').on('change', () => {
        const locationSelect = $('option:selected').val();
        app.setWeather(locationSelect);
    })
}

// Getting and setting available rainy days
app.setWeather = (city) => {
    const weatherPromise = app.getWeatherAPI(city);
    weatherPromise.then((weatherInformation) => {

        $('.rain-available-group').addClass('display-block').removeClass('no-display');
        $('.rain-selection-group').addClass('no-display').removeClass('display-block');
        $('.rain-available').empty();
        $('.rain-selection').empty();
        $('.film-title').empty();
        $('.film-poster').attr('src', '');
        $('.film-poster').attr('alt', '');
        
        app.finalPairing = 0;

        weatherInformation.list.forEach(function(item) {
            const forecastPrecip = item.weather[0].main;
            const forecastTime = item.dt_txt;

            if (forecastPrecip == 'Rain') {
                app.setAvailableRainDays(forecastTime);                
            };
        })

        // Getting and setting rainy day selection from user
        $('.individualDate').on('click', (event) => {

            if (app.finalPairing == 0) {
                $('.rain-selection-group').addClass('display-block').removeClass('no-display');
                $('.rain-selection').empty();

                const setRainDay = event.currentTarget.childNodes[0].innerHTML;

                const appendRainSelection = `
                <div class="individualDateSelected"><h3>${setRainDay}</h3><i class="rain-cloud-selected fas fa-cloud-showers-heavy"></i></div>
                `;
                $('.rain-selection').append(appendRainSelection);

                $('.film-button').removeClass('no-display').addClass('display');
                $('.location-select').prop('disabled', true);

            }

        })
    })

    // Getting and setting film selection from user
    $('.film-button').on('click', () => {

        app.finalPairing = 1;
        $('.film-button').removeClass('display').addClass('no-display');
        $('.film-title').empty();
        $('.film-poster').empty();
        
        const titlePossibilities = [`Forrest Gump`, `Harry Potter and the Sorcerer's Stone`, `Ferris Bueller's Day Off`, `The Princess Bride`, `The Shawshank Redemption`, `Back to the Future`, `The Devil Wears Prada`, `Shrek`, `Clueless`, `Up`, `The Goonies`, `Jurassic Park`, `Finding Nemo`, `Pirates of the Caribbean`, `Willy Wonka & the Chocolate Factory`, `Star Wars`, `Lord of the Rings`, `Dirty Dancing`, `Avengers`, `The Chronicles of Narnia`, `The Lion King`, `The Parent Trap`, `How to Train Your Dragon`, `Titanic`, `Raiders of the Lost Ark`, `Good Will Hunting`, `The Breakfast Club`, `Grease`, `10 Things I Hate About You`, `Edward Scissorhands`];
        title = app.getRandom(titlePossibilities);

        const filmPromise = app.getFilmAPI(title);
        filmPromise.then((filmSelection) => {

            const appendPoster = `
            <img src="" alt="" class="film-poster">
            `;
            $('.button-container').append(appendPoster);
            $('.film-poster').attr('src', filmSelection.Poster);
            $('.film-poster').attr('alt', filmSelection.Title);

            // Setting final pairing
            setTimeout(() => {
                $('.rain-selection-column').addClass('borderCelebration');
                $('.rain-selection-title').text(`Enjoy ${filmSelection.Title}... and the Rain!`);
                $('.film-poster').addClass('film-poster-end');
            }, 50);

        })
    })
}


// --- Utility functions ---

// Formating output for available rain days
app.setAvailableRainDays = (unorderedTime) => {

    // Month
    const monthNum = unorderedTime.substring(5, 7);
    const month =
        monthNum == '01' ? 'January' : monthNum == '02' ? 'February' : monthNum == '03' ? 'March' : monthNum == '04' ? 'April' : monthNum == '05' ? 'May' : monthNum == '06' ? 'June' : monthNum == '07' ? 'July' : monthNum == '08' ? 'August' : monthNum == '09' ? 'September' : monthNum == '10' ? 'October' : monthNum == '11' ? 'November' : 'December';

    // Day
    const dayNum = unorderedTime.substring(8, 10);
    let day = '';

    if (dayNum.substring(0,1) == '0') {
        day = dayNum.substring(1,2);
    } else {
        day = dayNum;
    }

    // Time of day
    const timeOfDayNum = unorderedTime.substring(11, 13);
    let timeOfDayTwelveHour = '';
    let timeOfDay = '';

    if (timeOfDayNum == '00') {
        timeOfDayTwelveHour = 'AM';
        timeOfDay = '12';
    } else if (timeOfDayNum > '00' && timeOfDayNum < '12') {
        timeOfDayTwelveHour = 'AM';
        timeOfDay = timeOfDayNum.substring(1, 2).toString();
    } else if (timeOfDayNum == '12') {
        timeOfDayTwelveHour = 'PM';
        timeOfDay = timeOfDayNum.toString();
    } else if (timeOfDayNum > '12') {
        timeOfDayTwelveHour = 'PM';
        timeOfDay = (timeOfDayNum - '12').toString();
    }

    // Rendering rain days
    const appendRainAvailable = `
    <a href="#rain-selection-title"><div class="individualDate"><h3>${month} ${day}<br>${timeOfDay}:00 ${timeOfDayTwelveHour}</h3><i class="rain-cloud fas fa-cloud-showers-heavy"></i></div></a>
    `;
    $('.rain-available').append(appendRainAvailable);

}


// Randomizer
app.getRandom = (filmList) => {;
    const randomizer = Math.floor(Math.random() * filmList.length);
    return filmList[randomizer];
}


// --- Init ---
app.init = () => {
    app.getLocation();

}


// --- Document ready ---
$(function(){
    app.init()
});