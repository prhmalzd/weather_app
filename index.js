const body = document.querySelector('body');
const mainBg = document.getElementById('main');
const homeBg = document.getElementById('home')
const weatherContainerNextDaysBg = document.getElementById('weatherContainerNextDays')

const nextDaysDetails = document.getElementById('nextDays__details')
const todayDetails = document.getElementById('today__details')
const navbarToday = document.getElementById('navbar__today')

let time
const dayBackgroundImage = 'linear-gradient(#0B7DA1, #33AADD, #2DC8EA)'
const nightBackgroundImage = 'linear-gradient(#08244F, #134CB5, #0B42AB)'

//  function for converting english digits to persian

const e2p = s => s.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

document.addEventListener('DOMContentLoaded', function () {
    const hour = new Date().getHours();

    if (hour >= 7 && hour < 20) {
        time = 'day'
        body.style.backgroundImage = dayBackgroundImage
        mainBg.style.backgroundImage = dayBackgroundImage
        homeBg.classList.add('home__dayTime')
        weatherContainerNextDaysBg.classList.add('home_weatherContainer__nextDays__dayTime')
    } else {
        time = 'night'
        body.style.backgroundImage = nightBackgroundImage
        mainBg.style.backgroundImage = nightBackgroundImage
        homeBg.classList.add('home__nightTime')
        weatherContainerNextDaysBg.classList.add('home_weatherContainer__nextDays__nightTime')
    }
  });

async function getResponse() {
    try {
        const response = await fetch('https://api.dastyar.io/express/weather?lat=35.67194277&lng=51.42434403', {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            creatingNextDays(data)
            creatingToday(data)
            creatingNavbarTodayTitle()
        } else {
            console.error('API request failed:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getResponse();

function creatingNextDays (data) {
    
    for (let i = 1 ; i<data.length ; i++) {

        const container = document.createElement('div')
        container.classList.add('home_weatherContainer__nextDays__details__oneDetail')

        const dayTitle = document.createElement('h3')
        dayTitle.classList.add('home_weatherContainer__nextDays__details__oneDetail__day')
        const dayTitleText = data[i].dateTitle.split(' ')
        dayTitle.innerText = dayTitleText[0]

        const icon = document.createElement('img')
        // assiging icon src
        const iconSrc = assignIconSrc(data , i)
        icon.src = iconSrc

        const degreesContainer = document.createElement('div')
        degreesContainer.classList.add('home_weatherContainer__nextDays__details__oneDetail__degrees')

        const minDegree = document.createElement('h3')
        minDegree.classList.add('home_weatherContainer__nextDays__details__oneDetail__minmax')
        const minDegreeValueInt = e2p(Math.floor(data[i].min))
        minDegree.innerText = `حداقل °${minDegreeValueInt}`

        const maxDegree = document.createElement('h3')
        maxDegree.classList.add('home_weatherContainer__nextDays__details__oneDetail__minmax')
        const maxDegreeValueInt = e2p(Math.floor(data[i].max))
        maxDegree.innerText = `حداکثر °${maxDegreeValueInt}`

        container.appendChild(dayTitle)
        container.appendChild(icon)

        degreesContainer.appendChild(minDegree)
        degreesContainer.appendChild(maxDegree)

        container.appendChild(degreesContainer)

        nextDaysDetails.appendChild(container)

        // adding line
        if (i !== 5) {
            const line = document.createElement('div')
            line.classList.add('home_weatherContainer__nextDays__details__line')
            nextDaysDetails.appendChild(line)
        }

    }
}

function creatingToday (data) {
    const bigIcon = document.createElement('img')
    // assiging icon src
    const bigIconSrc = assignIconSrc(data, 0)
    bigIcon.src = bigIconSrc

    const todayInfo = document.createElement('div')
    todayInfo.classList.add('home_weatherContainer__today__info')
    
    const upperDiv = document.createElement('div')
    upperDiv.classList.add('home_weatherContainer__today__info__upper')

    const aveDegree = document.createElement('h3')
    aveDegree.classList.add('home_weatherContainer__today__info__upper__aveDegree')
    const aveDegreeValueInt = e2p(Math.floor(data[0].current))
    aveDegree.innerText = `°${aveDegreeValueInt}`

    const dayTitle = document.createElement('h3')
    dayTitle.classList.add('home_weatherContainer__today__info__upper__title')
    dayTitle.innerText = data[0].customDescription.text

    const lowerDiv = document.createElement('div')
    lowerDiv.classList.add('home_weatherContainer__today__info__lower')

    const minDegree = document.createElement('h3')
    minDegree.classList.add('home_weatherContainer__today__info__lower__minmax')
    const minDegreeValueInt = e2p(Math.floor(data[0].min))
    minDegree.innerText = `حداقل °${minDegreeValueInt}`

    const maxDegree = document.createElement('h3')
    maxDegree.classList.add('home_weatherContainer__today__info__lower__minmax')
    const maxDegreeValueInt = e2p(Math.floor(data[0].max))
    maxDegree.innerText = `حداکثر °${maxDegreeValueInt}`

    upperDiv.appendChild(aveDegree)
    upperDiv.appendChild(dayTitle)

    lowerDiv.appendChild(minDegree)
    lowerDiv.appendChild(maxDegree)

    todayInfo.appendChild(upperDiv)
    todayInfo.appendChild(lowerDiv)

    todayDetails.appendChild(bigIcon)
    todayDetails.appendChild(todayInfo)
}

function creatingNavbarTodayTitle() {

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      
      const persianDate = new Date().toLocaleDateString('fa-IR', options);


    const todaysInfo = document.createElement('h2')
    todaysInfo.innerText = persianDate

    navbarToday.appendChild(todaysInfo)

}


  


  function assignIconSrc (data , i) {
    let iconSrc
    for (let j = 0 ; j < pigIconsMoon.length ; j++) {
        if (data[i].weather.main === pigIconsMoon[j].name) {
            if (time === 'day') iconSrc = pigIconsSun[j].src
            else iconSrc = pigIconsMoon[j].src
        }
    }
    if (!iconSrc) {
        if (time === 'day') iconSrc = pigIconsSun[1].src
        else iconSrc = pigIconsMoon[1].src
    }

    return iconSrc
  }