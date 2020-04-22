import format from "date-fns/format";
import { FETCH_URL } from "./url";

export const getData = (searchData, chosen) => {
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
  let kukkaQ = `&kukka=`;
  let kauppaQ = `&kauppa=`

  if (searchData !== "" && chosen === "kauppoja") {
    kauppaQ = `&kauppa=${searchData}`;
  } else if (searchData !== "" && chosen === "kukkia") {
    kukkaQ = `&kukka=${searchData}`;
  }

  if (localStorage.getItem('userLocation') === "Molemmat") {
    keraysQ = "&kerays="
  }

  return fetch(FETCH_URL + 'orders/tables' + dateQ + valmisQ + keraysQ + kukkaQ + kauppaQ, GETwAuth)
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });

}

export const getTableId = (data) => {
  let location = localStorage.getItem('userLocation');
  if (location === 'Molemmat') {
    location = "";
  }

  var GETwAuth = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    }
  }

  return fetch(`${FETCH_URL}orders/get/id/${data.id}?paikka=${location}&valmis=${sessionStorage.getItem('userValmis')}`, GETwAuth)
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });

}

export const getUserData = () => {
  var GETwAuth = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    }
  }

  return fetch(FETCH_URL + 'user/get/users', GETwAuth)
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

  return fetch(FETCH_URL + 'items/get/id/items', GETwAuth)
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });
}

export const removeData = (_id) => {
  fetch(FETCH_URL + 'orders/delete/id/' + _id, {
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
  fetch(FETCH_URL + 'products/delete/id/' + product._id, {
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
  fetch(FETCH_URL + 'products/delete/id/' + id, {
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

export const delUserData = () => {
  fetch(FETCH_URL + 'user/delete/id/' + sessionStorage.getItem("delID"), {
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

  fetch(FETCH_URL + 'products/put/id/' + product._id, {
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

  fetch(FETCH_URL + 'products/put/id/' + id, {
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

export const updateFlowersEdit = (products, id, kukka, toimi, kerays, lisatieto) => {
  if (kukka.length < 1) {
    kukka = products.kukka;
  }

  if (toimi.length < 1) {
    toimi = products.toimi;
  }

  if (kerays.length < 1) {
    kerays = products.kerays;
  }

  if (lisatieto.length < 1) {
    lisatieto = products.lisatieto;
  }

  fetch(FETCH_URL + 'products/put/id/' + id, {
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

  if (idvalues === 'Odottaa keräystä' || idvalues === 'Awaiting collecting') {
    document.getElementById(`keratty/${product._id}`).value = "Keräyksessä";
    fetch(FETCH_URL + 'products/patch/id/' + product._id, {
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

  if (idvalues === "Keräyksessä" || idvalues === 'Collecting') {
    document.getElementById(`keratty/${product._id}`).value = "Kerätty";
    fetch(FETCH_URL + 'products/patch/id/' + product._id, {
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

  if (idvalues === "Kerätty" || idvalues === "Collected") {
    document.getElementById(`keratty/${product._id}`).value = "Ei ole";
    fetch(FETCH_URL + 'products/patch/id/' + product._id, {
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

  if (idvalues === "Ei ole" || idvalues === "Not available") {
    document.getElementById(`keratty/${product._id}`).value = "Odottaa keräystä";
    fetch(FETCH_URL + 'products/patch/id/' + product._id, {
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

export const putFlowersOrderData = (asiakas, asiakaslisatieto, toimitusaika, kauppa, alisatieto, toimituspvm, _id, keraysPVM, date) => {

  if (asiakas.length < 1) {
    asiakas = kauppa;
  }

  if (asiakaslisatieto.length < 1) {
    asiakaslisatieto = alisatieto;
  }

  if (toimitusaika.length < 1) {
    toimitusaika = toimituspvm;
  }

  if(keraysPVM.length < 1) {
    keraysPVM = date;
  }

  fetch(FETCH_URL + 'orders/put/id/' + _id, {
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

  fetch(FETCH_URL + 'orders/put/id/' + userDatas._id, {
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

export const patchValmiusData = (valmius2, _id, location) => {
  fetch(FETCH_URL + 'orders/patch/id/' + _id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify([
      {
        propName: location,
        value: valmius2,
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

export const patchValmiusProductsData = (id, valmius) => {
  fetch(FETCH_URL + 'products/patch/id/' + id, {
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

export const patchTarkastettuProductsData = (product, valmius) => {
  fetch(FETCH_URL + 'products/patch/id/' + product._id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify([
      {
        propName: "tarkastettu",
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

export const postRullakko = (kauppa, rVuosi) => {
  return fetch(FETCH_URL + 'rullakot/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      kaupanNimi: kauppa,
      vuosi: rVuosi,
      history: format(new Date(), "dd/MM/yyyy")
    }),
  })
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });
}

export const putRullakkoToOrders = (_id, rullakkoIDS) => {
  fetch(FETCH_URL + 'orders/put/id/' + _id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      rullakot: rullakkoIDS
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

export const deleteRullakkoFromOrders = (rullakko) => {
  fetch(FETCH_URL + 'rullakot/delete/id/' + rullakko._id, {
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

export const updateRullakkoData = (rullakko, kauppa, rNimi, rMaara) => {
  if (rNimi.length <= 0) {
    rNimi = rullakko.rullakonNimi;
  }
  if (rMaara.length <= 0) {
    rMaara = rullakko.rullakoidenMaara;
  }
  fetch(FETCH_URL + 'rullakot/put/id/' + rullakko._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      rullakonNimi: rNimi,
      rullakoidenMaara: rMaara,
      kaupanNimi: kauppa,
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

export const getRullakotData = (year) => {
  return fetch(FETCH_URL + 'rullakot/get?year=' + year, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
  })
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });
}

export const postHylly = (kauppa, rVuosi) => {
  return fetch(FETCH_URL + 'hyllyt/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      kaupanNimi: kauppa,
      vuosi: rVuosi,
      history: format(new Date(), "dd/MM/yyyy")
    }),
  })
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });
}

export const putHyllyToOrders = (_id, hyllyIDS) => {
  fetch(FETCH_URL + 'orders/put/id/' + _id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      hyllyt: hyllyIDS
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

export const deleteHyllyFromOrders = (hylly) => {
  fetch(FETCH_URL + 'hyllyt/delete/id/' + hylly._id, {
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

export const updateHyllyData = (hylly, kauppa, rHylly, rHyllyjenMaara) => {
  if (rHylly.length <= 0) {
    rHylly = hylly.hyllynNimi
  }
  if (rHyllyjenMaara.length <= 0) {
    rHyllyjenMaara = hylly.hyllyjenMaara
  }
  fetch(FETCH_URL + 'hyllyt/put/id/' + hylly._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
    body: JSON.stringify({
      hyllynNimi: rHylly,
      hyllyjenMaara: rHyllyjenMaara,
      kaupanNimi: kauppa,
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

export const getHyllytData = (year) => {
  return fetch(FETCH_URL + 'hyllyt/get?year=' + year, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
  })
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });
}

export const getPalautetut = (year) => {
  return fetch(FETCH_URL + 'palautetut/get?year=' + year, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
    },
  })
    .then(res => res.json())
    .catch((error) => {
      console.log(error);
    });
}
