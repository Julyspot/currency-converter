const BASE_URL = "https://v6.exchangerate-api.com/v6/184d3e0051f748ce979163aa/latest/";
const dropdown = document.querySelectorAll(".dropdown select");
const from_curr = document.querySelector(".from select");
const to_curr = document.querySelector(".to select");
const btn = document.querySelector("button");
const form = document.querySelector("form");


for (let select of dropdown) {
    for (let currency_code in countryList) {
        const newoption = document.createElement("option");
        newoption.innerText = currency_code;
        newoption.value = currency_code;

        if (select.name === "from" && currency_code === "USD") {
            newoption.selected = true;
        } else if (select.name === "to" && currency_code === "INR") {
            newoption.selected = true;
        }

        select.append(newoption);
    }

    select.addEventListener("change", (evt) => {
        updateflag(evt.target);
    });
}


const updateflag = (element) => {
    const currency_code = element.value;
    const country = countryList[currency_code];
    const newsrc = `https://flagsapi.com/${country}/shiny/64.png`;
    const img = element.parentElement.querySelector("img");
    img.src = newsrc;
};


const fetchExchangeRate = async () => {
    const amount = document.querySelector(".amount input");
    let amount_value = amount.value;


    if (amount_value === "" || amount_value < 1) {
        amount_value = 1;
        amount.value = "1";
    }

    const from = from_curr.value.toUpperCase();
    const to = to_curr.value.toUpperCase();
    const URL = `${BASE_URL}${from}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (data.result === "success") {
            const rate = data.conversion_rates[to];
            const convertedAmount = (rate * amount_value).toFixed(2);

            document.getElementById("exchange").innerHTML = `<strong>1 ${from} = ${rate} ${to}</strong>`;

            document.querySelector(".msg").innerHTML = `<p><strong>Converted Amount: ${convertedAmount} ${to}<strong></p>`;
            document.querySelector(".msg").appendChild(btn);
        } else {
            throw new Error("Error fetching exchange rates.");
        }
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        alert("Failed to fetch exchange rate. Please try again later.");
    }
};


btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    fetchExchangeRate();
});


form.addEventListener("keypress", (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault();
        fetchExchangeRate();
    }
});
