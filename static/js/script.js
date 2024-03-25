'use strict';



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});



/**
 * SLIDER
 */

const sliders = document.querySelectorAll("[data-slider]");

const initSlider = function(currentSlider) {

  const sldierContainer = currentSlider.querySelector("[data-slider-container]");
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

  let currentSlidePos = 0;

  const moveSliderItem = function () {
    sldierContainer.style.transform = `translateX(-${sldierContainer.children[currentSlidePos].offsetLeft}px)`;
  }

  /**
   * NEXT SLIDE
   */

  const slideNext = function () {
    const slideEnd = currentSlidePos >= sldierContainer.childElementCount - 1;

    if (slideEnd) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }

    moveSliderItem();
  }

  sliderNextBtn.addEventListener("click", slideNext);

  /**
   * PREVIOUS SLIDE
   */

   const slidePrev = function () {

    if (currentSlidePos <= 0) {
      currentSlidePos = sldierContainer.childElementCount - 1;
    } else {
      currentSlidePos--;
    }

    moveSliderItem();
  }

  sliderPrevBtn.addEventListener("click", slidePrev);

  const dontHaveExtraItem = sldierContainer.childElementCount <= 1;
  if (dontHaveExtraItem) {
    sliderNextBtn.style.display = "none";
    sliderPrevBtn.style.display = "none";
  }

}

for (let i = 0, len = sliders.length; i < len; i++) { initSlider(sliders[i]); }



/**
 * ACCORDION
 */

const accordions = document.querySelectorAll("[data-accordion]");

let lastActiveAccordion = accordions[0];

const initAccordion = function (currentAccordion) {

  const accordionBtn = currentAccordion.querySelector("[data-accordion-btn]");

  const expandAccordion = function () {
    if (lastActiveAccordion && lastActiveAccordion !== currentAccordion) {
      lastActiveAccordion.classList.remove("expanded");
    }

    currentAccordion.classList.toggle("expanded");

    lastActiveAccordion = currentAccordion;
  }

  accordionBtn.addEventListener("click", expandAccordion);

}

for (let i = 0, len = accordions.length; i < len; i++) { initAccordion(accordions[i]); }




function validateForm() {
  // Validate meter (0, 1, 2, 3)
  // var meter = document.getElementById("res").value;
  // if (meter < 0 || meter > 3) {
  //     alert("Meter value must be between 0 and 3.");
  //     return false;
  // }

  // Validate square_feet, air_temperature, dew_temperature, wind_speed (numeric)
  var square_feet = document.getElementById("square_feet").value;
  var air_temperature = document.getElementById("air_temperature").value;
  var dew_temperature = document.getElementById("dew_temperature").value;
  var wind_speed = document.getElementById("wind_speed").value;

  if (isNaN(square_feet) || isNaN(air_temperature) || isNaN(dew_temperature) || isNaN(wind_speed)) {
      alert("Square Feet, Air Temperature, Dew Temperature, and Wind Speed must be numeric values.");
      return false;
  }

  // Validate timestamp (not empty)
  var timestamp = document.getElementById("timestamp").value;
  if (timestamp === "") {
      alert("Please select a timestamp.");
      return false;
  }

  return true;
}

// document.addEventListener('DOMContentLoaded', function() {
//   document.getElementById('dropButton').addEventListener('click', function() {
//       var list = document.getElementById('droppedList');
//       list.innerHTML = ''; // Clear the list first

//       var itemsContent = ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'];
//       // Add 5 points to the list
//       for (var i = 1; i <= 5; i++) {
//           var listItem = document.createElement('li');
          
//           list.appendChild(listItem);
//       }
//   });
// });



document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('dropButton').addEventListener('click', function() {
      var list = document.getElementById('droppedList');
      list.innerHTML = ''; // Clear the list first

      // Randomly shuffle the itemsContent array
      var shuffledItems = shuffleArray(itemsContent);

      // Add specific content to each list item
      for (var i = 0; i < 5; i++) {
          var listItem = document.createElement('li');
          listItem.insertAdjacentHTML('beforeend', shuffledItems[i]);
          list.appendChild(listItem);
      }

      var headerHTML = '<h2 id="sugg">Suggestions to help You 😊</h2>';
      list.insertAdjacentHTML('beforebegin', headerHTML);

      // Hide the button
      var button = document.getElementById('dropButton');
      button.style.display = 'none';
  });
});

// Function to shuffle an array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

// Assuming itemsContent is an array containing your items
var itemsContent = [
  '<strong>Energy-Efficient Lighting:</strong> Replace traditional bulbs with LED lights, which consume significantly less energy and have a longer lifespan.',
  '<strong>Energy-Efficient HVAC Systems:</strong> Upgrade to energy-efficient heating, ventilation, and air conditioning (HVAC) systems and ensure regular maintenance to optimize performance.',
  '<strong>Insulation:</strong> Improve insulation in walls, ceilings, and windows to reduce heat loss during winters and heat gain during summers, thereby decreasing reliance on heating and cooling systems.',
  '<strong>Energy-Efficient Appliances:</strong> Choose Energy Star-rated appliances for the office kitchen and break areas to reduce energy consumption.',
  '<strong>Occupancy Sensors:</strong> Install occupancy sensors for controlling lighting, heating, and cooling systems in areas like conference rooms, restrooms, and storage spaces.',
  '<strong>Employee Awareness Programs:</strong> Educate employees about energy-saving practices and encourage them to adopt simple habits like turning off lights and equipment when not in use.',
  '<strong>Regular Maintenance:</strong> Conduct regular maintenance of building systems and equipment to ensure they operate efficiently and identify any issues promptly.',
  '<strong>Seal Leaks:</strong> Seal gaps and leaks in windows, doors, and ductwork to prevent air leakage, which can lead to energy wastage.'
];
