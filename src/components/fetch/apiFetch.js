import format from "date-fns/format";

export const getData = (valmis) => {
    var GETwAuth = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        }
    }
    var date = format(new Date(), 'dd/MM/yyyy');

    if (sessionStorage.getItem('userDate')) {
        date = sessionStorage.getItem('userDate');
    } else {
        date = format(new Date(), 'dd/MM/yyyy');
    };

    return fetch('http://localhost:3002/products/tables?date=' + date + '&valmis=' + valmis, GETwAuth)
        .then(res => res.json())
        .catch((error) => {
            console.log(error);
        });

}

export const removeData = (_id) => {
    fetch('http://localhost:3002/products/' + _id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
      })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch((error) => {
          console.log(error);
        });
}
