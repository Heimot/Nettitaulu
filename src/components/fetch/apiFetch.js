import format from "date-fns/format";

export const getData = () => {
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

  let dateQ = `?date=${date}`;
  let valmisQ = `&valmis=${sessionStorage.getItem("userValmis")}`;
  let keraysQ = `&kerays=${localStorage.getItem('userLocation')}`;
  if (localStorage.getItem('userLocation') === "Molemmat") {
    keraysQ = "&kerays="
  }

  return fetch('http://localhost:3002/orders/tables' + dateQ + valmisQ + keraysQ, GETwAuth)
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });

}

export const getFlowersToAutocomplete = () => {
  var GETwAuth = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    }
  }

  return fetch('http://localhost:3002/items/flowers', GETwAuth)
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });
}

export const removeData = (_id) => {
  fetch('http://localhost:3002/orders/delete/id/' + _id, {
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

export const deleteFlowerData = (product) => {
  fetch('http://localhost:3002/products/delete/id/' + product._id, {
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

export const deleteFlowersData = (id) => {
  fetch('http://localhost:3002/products/delete/id/' + id, {
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

export const updateFlower = (product, kukka, toimi, kerays, lisatieto) => {
  if (kukka.length < 1) {
    kukka = product.kukka;
  }

  if (toimi.length < 1) {
    toimi = product.toimi;
  }

  if (kerays.length < 1) {
    kerays = product.kerays;
  }

  if (lisatieto.length < 1) {
    lisatieto = product.lisatieto;
  }

  fetch('http://localhost:3002/products/put/id/' + product._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      kukka: kukka,
      toimi: toimi,
      kerays: kerays,
      lisatieto: lisatieto
    }),
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });
}

export const updateFlowers = (userDatas, id, kukka, toimi, kerays, lisatieto) => {
  if (kukka.length < 1) {
    kukka = userDatas.products.kukka;
  }

  if (toimi.length < 1) {
    toimi = userDatas.products.toimi;
  }

  if (kerays.length < 1) {
    kerays = userDatas.products.kerays;
  }

  if (lisatieto.length < 1) {
    lisatieto = userDatas.products.lisatieto;
  }

  fetch('http://localhost:3002/products/put/id/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      kukka: kukka,
      toimi: toimi,
      kerays: kerays,
      lisatieto: lisatieto
    }),
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });
}

export const patchKeraysData = (product, idvalues, maara) => {
  if (maara > 0) {
    maara = document.getElementById(product._id).value;
  } else {
    maara = 0;
  }

  if (idvalues === 'Odottaa keräystä') {
    document.getElementById(`keratty/${product._id}`).value = "Keräyksessä";
    fetch('http://localhost:3002/products/patch/id/' + product._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify([
        {
          propName: "keratty",
          value: "Keräyksessä",
        },
        {
          propName: "kerattymaara",
          value: maara
        }
      ])
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (idvalues === "Keräyksessä") {
    document.getElementById(`keratty/${product._id}`).value = "Kerätty";
    fetch('http://localhost:3002/products/patch/id/' + product._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify([
        {
          propName: "keratty",
          value: "Kerätty"
        },
        {
          propName: "kerattymaara",
          value: maara
        }
      ])
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (idvalues === "Kerätty") {
    document.getElementById(`keratty/${product._id}`).value = "Ei ole";
    fetch('http://localhost:3002/products/patch/id/' + product._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify([
        {
          propName: "keratty",
          value: "Ei ole",
        },
        {
          propName: "kerattymaara",
          value: maara
        }
      ])
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (idvalues === "Ei ole") {
    document.getElementById(`keratty/${product._id}`).value = "Odottaa keräystä";
    fetch('http://localhost:3002/products/patch/id/' + product._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify([
        {
          propName: "keratty",
          value: "Odottaa keräystä",
        },
        {
          propName: "kerattymaara",
          value: maara
        }
      ])
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export const putFlowersOrderData = (asiakas, asiakaslisatieto, toimitusaika, kauppa, alisatieto, toimituspvm, _id, date) => {


  if (asiakas.length < 1) {
    asiakas = kauppa;
  }

  if (asiakaslisatieto.length < 1) {
    asiakaslisatieto = alisatieto;
  }

  if (toimitusaika.length < 1) {
    toimitusaika = toimituspvm;
  }

  fetch('http://localhost:3002/orders/put/id/' + _id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      kauppa: asiakas,
      alisatieto: asiakaslisatieto,
      date: sessionStorage.getItem("userDate"),
      toimituspvm: toimitusaika,
    }),
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });
  sessionStorage.removeItem('userDate2');
}

export const putFlowersCreatedOrderData = (asiakas, asiakaslisatieto, toimitusaika, keraysPVM, userDatas) => {

  if (asiakas.length < 1) {
    asiakas = userDatas.products.kauppa;
  }

  if (asiakaslisatieto.length < 1) {
    asiakaslisatieto = userDatas.products.alisatieto;
  }

  if (keraysPVM.length < 1) {
    keraysPVM = userDatas.products.date;
  }

  if (toimitusaika.length < 1) {
    toimitusaika = userDatas.products.toimituspvm;
  }

  fetch('http://localhost:3002/orders/put/id/' + userDatas._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      kauppa: asiakas,
      alisatieto: asiakaslisatieto,
      date: keraysPVM,
      toimituspvm: toimitusaika,
      valmis: userDatas.products.valmis,
    }),
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });
}

export const patchValmiusData = (valmius, _id) => {
  fetch('http://localhost:3002/orders/patch/id/' + _id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify([
      {
        propName: "valmis",
        value: valmius,
      },
    ])
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });
}

export const updateValmiusData = (_id, product) => {

/*  if (asiakas.length < 1) {
    asiakas = product.kauppa;
  }

  if (asiakaslisatieto.length < 1) {
    asiakaslisatieto = product.alisatieto;
  }

  if (keraysPVM.length < 1) {
    keraysPVM = product.date;
  }

  if (toimitusaika.length < 1) {
    toimitusaika = product.toimituspvm;
  }

  fetch('http://localhost:3002/products/put/id/' + product._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      kukka: kukka,
      toimi: toimi,
      kerays: kerays,
      lisatieto: lisatieto
    }),
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });*/
}
