const url = 'https://api.covid19api.com/';

fetch(`${url}countries`)
    .then(res => res.json())
    .then(res => validCountries(res))
    .catch(err => console.error(err));

function validCountries(input) {
    for (let i of input){
        let option = document.createElement('option');
        option.text = i.Country;
        document.getElementById('combo').append(option);
    }
}

startFunction();
function startFunction() {
    fetch(`${url}summary`)
        .then(res => res.json())
        .then(res => informationsGlobal(res))
        .catch(err => {window.alert("Não foi possivél carregar essas informações"); console.error(err)});

    function informationsGlobal(input) {
        let newDate = new Date(input.Global.Date),
        year = newDate.getFullYear();
        month = newDate.getMonth() < 10 ? month = '0' + Number(newDate.getMonth()+1) : month = newDate.getMonth()+1;
        day = newDate.getDate() < 10 ? day = '0' + Number(newDate.getDate()) : month = newDate.getDate();            

        newDate = (`${year}.${month}.${day}  ${newDate.getHours()}:${newDate.getMinutes()}`);

        document.getElementById('death').innerHTML = input.Global.TotalDeaths.toLocaleString();
        document.getElementById('confirmed').innerHTML = input.Global.TotalConfirmed.toLocaleString();
        document.getElementById('recovered').innerHTML = input.Global.TotalRecovered.toLocaleString();
        document.getElementById('actives').innerHTML = "Atualização"
        document.getElementById('active').innerHTML = newDate;
    }
}

function myFunction() {

    let date = document.getElementById('today').value;
    let country = document.getElementById('combo').value;
    var dateYesterday = new Date(document.getElementById('today').value);
    dateYesterday = String(`${dateYesterday.getFullYear()}-${
        dateYesterday.getMonth()+1}-${dateYesterday.getDate()}`);

    if(country === "Global") {
        startFunction();
    } else {

        fetch(`${url}country/${country}?from=${date}T00:00:00Z&to=${date}T23:59:59Z`)
            .then(res => res.json())
            .then(res => informations(res))
            .catch(err => {window.alert("Não foi possivél carregar essas informações"); console.error(err)});
        
        function informations(input) {
            document.getElementById('death').innerHTML = input[0].Deaths.toLocaleString();
            document.getElementById('confirmed').innerHTML = input[0].Confirmed.toLocaleString();
            document.getElementById('recovered').innerHTML = input[0].Recovered.toLocaleString();
            document.getElementById('actives').innerHTML = "Total Ativos"
            document.getElementById('active').innerHTML = input[0].Active.toLocaleString();
            
            var dateNow = {
                'death': input[0].Deaths,
                'confirmed': input[0].Confirmed,
                'recovered': input[0].Recovered,
                'active': input[0].Active
            }

            fetch(`${url}country/${country}?from=${dateYesterday}T00:00:00Z&to=${dateYesterday}T23:59:59Z`)
                .then(res => res.json())
                .then(res => yesterday(res, dateNow))
                .catch(err => {window.alert("Não foi possivél carregar essas informações"); console.error(err)});
        }

        function yesterday(input, dateNow) {

            let tdeath = dateNow.death - input[0].Deaths,
            tconfirmed =  dateNow.confirmed - input[0].Confirmed,
            trecovered = dateNow.recovered - input[0].Recovered,
            tactive = dateNow.active - input[0].Active

            insertDailyData('tdeath', tdeath, tdeath > 0 );
            insertDailyData('tconfirmed', tconfirmed, tconfirmed > 0 );
            insertDailyData('trecovered', trecovered, trecovered > 0 );
            insertDailyData('tactive', tactive, tactive > 0 );       
        }
        
        function insertDailyData(element, value, increase){
            !increase ? document.getElementById(element)
            .innerHTML = `<img src="./assets/img/down.png"> Diario ${value.toLocaleString()}` : document.getElementById(element)
            .innerHTML = `<img src="./assets/img/up.png"> Diario ${value.toLocaleString()}`
        }
    }
}
