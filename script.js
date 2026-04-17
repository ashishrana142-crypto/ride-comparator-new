let distance = 0;
let duration = 0;

function getDistance() {
  let pickup = document.getElementById("pickup").value;
  let drop = document.getElementById("drop").value;

  if (!pickup || !drop) {
    alert("Enter both locations");
    return;
  }

  let service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix({
    origins: [pickup],
    destinations: [drop],
    travelMode: 'DRIVING',
  }, callback);
}

function callback(response, status) {
  if (status !== "OK") {
    alert("Error fetching distance");
    return;
  }

  let result = response.rows[0].elements[0];

  distance = result.distance.value / 1000; // km
  duration = result.duration.value / 60;   // minutes

  comparePrices();
}

function comparePrices() {
  let ola = 40 + (distance * 12) + (duration * 1);
  let uber = 50 + (distance * 14) + (duration * 1.5);
  let rapido = 20 + (distance * 10);

  let min = Math.min(ola, uber, rapido);

  let html = "";
  html += card("Ola", ola.toFixed(0), ola === min);
  html += card("Uber", uber.toFixed(0), uber === min);
  html += card("Rapido", rapido.toFixed(0), rapido === min);

  document.getElementById("results").innerHTML = html;
}

function card(name, price, isBest) {
  let pickup = document.getElementById("pickup").value;
  let drop = document.getElementById("drop").value;

  let link = "";

  if (name === "Uber") {
    link = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(drop)}`;
  } 
  else if (name === "Ola") {
    link = "https://book.olacabs.com/";
  } 
  else if (name === "Rapido") {
    link = "https://rapido.bike/";
  }

  return `
    <div class="card result-card ${isBest ? 'best' : ''}">
      <div>
        <strong>${name}</strong><br>
        ₹${price}
      </div>
      <button onclick="bookRide('${link}')">Book</button>
    </div>
  `;
}

function bookRide(url) {
  window.open(url, "_blank");
}