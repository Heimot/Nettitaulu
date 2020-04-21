import React, { Component } from 'react';
import { Card, CardText, Button, Input } from 'reactstrap';
import { Redirect } from "react-router-dom";
import { getRullakotData, getHyllytData, getPalautetut } from '../fetch/apiFetch';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import socketIOClient from "socket.io-client";
import format from "date-fns/format";
import { FETCH_URL, SOCKET_URL } from '../fetch/url';

// CSS
import '../../Styles/rullakot.css';

let year = format(new Date(), "yyyy")
let b = 0;
let d = 0;
let filteredForReal = [];
let filtered = [];
let filteredRullakko = [];
let filteredR = [];
let filteredRullakkoR = [];
let x;
let y;

const endpoint = SOCKET_URL;
const socket = socketIOClient(endpoint);

class Rullakot extends Component {
    constructor() {
        super();
        this.state = {
            rullakotData: [{ rullakonNimi: "ErrorHandler", rullakoidenMaara: 404, kaupanNimi: "Error" }],
            hyllytData: [{ hyllynNimi: "Error", hyllyjenMaara: 404, kaupanNimi: "Error" }],
            palautettuData: [{ rullakonNimi: "ErrorHandler", rullakoidenMaara: 404, hyllynNimi: "Error", hyllyjenMaara: 404, kaupanNimi: "Error" }],
        }
    }

    componentDidMount() {
        try {
            socket.on('rullakotUpdt', async (data) => {
                if (data.message === true) {
                    this.rullakotApiData();
                };
            });
            this.rullakotApiData();
        } catch (err) {
            console.log(err);
        }
    }

    async rullakotApiData() {
        try {
            const data = await getRullakotData(year);
            const hyllyData = await getHyllytData(year);
            const palautetut = await getPalautetut(year);
            this.setState({
                rullakotData: data,
                hyllytData: hyllyData,
                palautettuData: palautetut
            })
        } catch (err) {
            console.log(err);
        }
    }

    rullakotFilterer() {
        try {
            let { rullakotData } = this.state;

            let array = [];
            let result = {};
            let counts = {};

            array.push(
                rullakotData.map(doc => {
                    return doc.rullakonNimi;
                })
            )
            Object.keys(result).map(key => ({ [key]: result[key] }))
            for (let i = 0; i < array.length; i++) {
                result[array[i]] = (result[array[i]] || 0) + 1
            }
            Object.keys(result).map(str => str.replace(/\s/g, '')).toString().split(",").forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

            return ([...new Set(Object.keys(result).toString().split(","))])
        } catch (err) {
            console.log(err);
        }
    }

    hyllytFilterer() {
        try {
            let { hyllytData } = this.state;

            let array = [];
            let result = {};
            let counts = {};

            array.push(
                hyllytData.map(doc => {
                    return doc.hyllynNimi;
                })
            )
            Object.keys(result).map(key => ({ [key]: result[key] }))
            for (let i = 0; i < array.length; i++) {
                result[array[i]] = (result[array[i]] || 0) + 1
            }
            Object.keys(result).map(str => str.replace(/\s/g, '')).toString().split(",").forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

            return ([...new Set(Object.keys(result).toString().split(","))])
        } catch (err) {
            console.log(err);
        }
    }

    sum(doc, rullakot) {
        try {
            let rMaara = rullakot;
            let rullakotNames = rullakot;
            for (x of rMaara) {
                let nimi = rullakotNames[b - 1];
                let { rullakotData } = this.state;
                b++;
                if (b > rullakotNames.length) {
                    b = 1;
                }
                filtered = rullakotData.filter(doc2 => {
                    return doc2.kaupanNimi === doc
                })
                filteredForReal = filtered.filter(doc3 => {
                    return doc3.rullakonNimi === nimi
                })
                const sum = `${nimi}: ${filteredForReal.map(item => item.rullakoidenMaara).reduce((prev, curr) => prev + curr, 0)}`;
                return sum;
            }
        } catch (err) {
            console.log(err);
        }
    }

    sumPalautetut(doc, rullakot) {
        try {
            let rMaara = rullakot;
            let rullakotNames = rullakot;
            for (x of rMaara) {
                let nimi = rullakotNames[b - 1];
                let { palautettuData } = this.state;
                b++;
                if (b > rullakotNames.length) {
                    b = 1;
                }
                filtered = palautettuData.filter(doc2 => {
                    return doc2.kaupanNimi === doc
                })
                filteredForReal = filtered.filter(doc3 => {
                    return doc3.rullakonNimi === nimi
                })
                const sum = `${filteredForReal.map(item => item.rullakoidenMaara).reduce((prev, curr) => prev + curr, 0)}`;
                const sumNimi = `${nimi}: ${sum}`
                if (sum > 0) {
                    return sumNimi;
                } else {
                    return `${nimi}: 0`;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    sumHylly(doc, hyllyt) {
        try {
            let rMaara = hyllyt;
            let hyllytNames = hyllyt;
            for (y of rMaara) {
                let rNimi = hyllytNames[d - 1];
                let { hyllytData } = this.state;
                d++;
                if (d > hyllyt.length) {
                    d = 1;
                }
                filtered = hyllytData.filter(doc2 => {
                    return doc2.kaupanNimi === doc
                })

                filteredRullakko = filtered.filter(doc3 => {
                    return doc3.hyllynNimi === rNimi
                })
                const sum = `${rNimi}: ${filteredRullakko.map(item => item.hyllyjenMaara).reduce((prev, curr) => prev + curr, 0)}`;
                return sum;
            }
        } catch (err) {
            console.log(err);
        }
    }

    sumHyllyPalautetut(doc, hyllyt) {
        try {
            let rMaara = hyllyt;
            let hyllytNames = hyllyt;
            for (y of rMaara) {
                let rNimi = hyllytNames[d - 1];
                let { palautettuData } = this.state;
                d++;
                if (d > hyllyt.length) {
                    d = 1;
                }
                filtered = palautettuData.filter(doc2 => {
                    return doc2.kaupanNimi === doc
                })
                filteredRullakko = filtered.filter(doc3 => {
                    return doc3.hyllynNimi === rNimi
                })
                const sum = `${filteredRullakko.map(item => item.hyllyjenMaara).reduce((prev, curr) => prev + curr, 0)}`;
                const sumNimi = `${rNimi}: ${sum}`
                if (sum > 0) {
                    return sumNimi;
                } else {
                    return `${rNimi}: 0`;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    IDGRAB(doc, doc2) {
        try {
            let { palautettuData } = this.state;
            let rVuosi = format(new Date(), "yyyy");
            let summaVal = 0;
            let value = 0;

            filtered = palautettuData.filter(doc2 => {
                return doc2.kaupanNimi === doc
            })
            filteredRullakko = filtered.filter(doc3 => {
                return doc3.hyllynNimi === doc2
            })
            const sum = `${filteredRullakko.map(item => item._id)}`;
            value = `${filteredRullakko.map(item => item.hyllyjenMaara)}`;

            if (value === "") {
                value = 0;
            }
            if (!isNaN(parseInt(document.getElementById(`${doc}Hylly${doc2}${year}`).value))) {
                summaVal = parseInt(value) + parseInt(document.getElementById(`${doc}Hylly${doc2}${year}`).value);
            } else if (document.getElementById(`${doc}Hylly${doc2}${year}`).value.includes('--')) {
                summaVal = parseInt(value) - parseInt(document.getElementById(`${doc}Hylly${doc2}${year}`).value.split('--')[1]);
                if (summaVal < 0) {
                    summaVal = 0;
                }
            } else {
                summaVal = parseInt(value);
            }

            if (sum.length > 0) {
                if (document.getElementById(`${doc}Hylly${doc2}${year}`).value > 0) {
                    return fetch(`${FETCH_URL}palautetut/put/id/${doc}Hylly${doc2}${rVuosi}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                        },
                        body: JSON.stringify({
                            hyllyjenMaara: summaVal
                        }),
                    })
                        .then(res =>
                            socket.emit('rullakotUpdt', {
                                message: true
                            }))
                        .catch((error) => {
                            console.log(error);
                        });
                } else if (document.getElementById(`${doc}Hylly${doc2}${year}`).value.includes('--')) {
                    return fetch(FETCH_URL + 'palautetut/put/id/' + `${doc}Hylly${doc2}${rVuosi}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                        },
                        body: JSON.stringify({
                            hyllyjenMaara: summaVal
                        }),
                    })
                        .then(res =>
                            socket.emit('rullakotUpdt', {
                                message: true
                            }))
                        .catch((error) => {
                            console.log(error);
                        });
                }
            } else {
                return fetch(FETCH_URL + 'palautetut/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                    },
                    body: JSON.stringify({
                        _id: `${doc}Hylly${doc2}${rVuosi}`,
                        hyllynNimi: doc2,
                        hyllyjenMaara: parseInt(document.getElementById(`${doc}Hylly${doc2}${year}`).value),
                        kaupanNimi: doc,
                        vuosi: rVuosi
                    }),
                })
                    .then(res =>
                        socket.emit('rullakotUpdt', {
                            message: true
                        }))
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } catch (err) {
            console.log(err);
        }
    }

    IDGRABR(doc, doc2) {
        try {
            let { palautettuData } = this.state;
            let rVuosi = format(new Date(), "yyyy");
            let summaVal = 0;
            let value = 0;

            filtered = palautettuData.filter(doc2 => {
                return doc2.kaupanNimi === doc
            })
            filteredRullakko = filtered.filter(doc3 => {
                return doc3.rullakonNimi === doc2
            })
            const sum = `${filteredRullakko.map(item => item._id)}`;
            value = `${filteredRullakko.map(item => item.rullakoidenMaara)}`;

            if (value === "") {
                value = 0;
            }
            if (!isNaN(parseInt(document.getElementById(`${doc}Rullakko${doc2}${year}`).value))) {
                summaVal = parseInt(value) + parseInt(document.getElementById(`${doc}Rullakko${doc2}${year}`).value);
            } else if (document.getElementById(`${doc}Rullakko${doc2}${year}`).value.includes('--')) {
                summaVal = parseInt(value) - parseInt(document.getElementById(`${doc}Rullakko${doc2}${year}`).value.split('--')[1]);
                if (summaVal < 0) {
                    summaVal = 0;
                }
            } else {
                summaVal = parseInt(value);
            }

            if (sum.length > 0) {
                if (document.getElementById(`${doc}Rullakko${doc2}${year}`).value > 0) {
                    return fetch(FETCH_URL + 'palautetut/put/id/' + `${doc}Rullakko${doc2}${rVuosi}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                        },
                        body: JSON.stringify({
                            rullakoidenMaara: summaVal
                        }),
                    })
                        .then(res =>
                            socket.emit('rullakotUpdt', {
                                message: true
                            }))
                        .catch((error) => {
                            console.log(error);
                        });
                } else if (document.getElementById(`${doc}Rullakko${doc2}${year}`).value.includes('--')) {
                    return fetch(FETCH_URL + 'palautetut/put/id/' + `${doc}Rullakko${doc2}${rVuosi}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                        },
                        body: JSON.stringify({
                            rullakoidenMaara: summaVal
                        }),
                    })
                        .then(res =>
                            socket.emit('rullakotUpdt', {
                                message: true
                            }))
                        .catch((error) => {
                            console.log(error);
                        });
                }
            } else {
                return fetch(FETCH_URL + 'palautetut/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                    },
                    body: JSON.stringify({
                        _id: `${doc}Rullakko${doc2}${rVuosi}`,
                        rullakonNimi: doc2,
                        rullakonMaara: parseInt(document.getElementById(`${doc}Rullakko${doc2}${year}`).value),
                        kaupanNimi: doc,
                        vuosi: rVuosi
                    }),
                })
                    .then(res =>
                        socket.emit('rullakotUpdt', {
                            message: true
                        }))
                    .catch((error) => {
                        console.log(error);
                    });;
            }
        } catch (err) {
            console.log(err);
        }
    }

    liID(doc, doc2) {
        try {
            let { palautettuData } = this.state;

            filtered = palautettuData.filter(doc2 => {
                return doc2.kaupanNimi === doc
            })
            filteredRullakko = filtered.filter(doc3 => {
                return doc3.hyllynNimi === doc2
            })
            const sum = `${filteredRullakko.map(item => item._id)}`;

            console.log(sum)
            if (sum.length > 0) {
                return sum;
            } else {
                return ``;
            }
        } catch (err) {
            console.log(err);
        }
    }

    liIDR(doc, doc2) {
        try {
            let { palautettuData } = this.state;
            console.log(doc2)
            console.log(doc)

            filteredR = palautettuData.filter(doc10 => {
                return doc10.kaupanNimi === doc
            })
            filteredRullakkoR = filteredR.filter(doc3 => {
                return doc3.rullakonNimi === doc2
            })
            const sum = `${filteredRullakkoR.map(item => item._id)}`;

            if (sum.length > 0) {
                return sum;
            } else {
                return ``;
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        let { rullakotData } = this.state;
        let rullakot = this.rullakotFilterer();
        let hyllyt = this.hyllytFilterer();
        let array = [];
        let result = {};
        let counts = {};
        let artest = [];
        console.log(rullakotData)

        if (sessionStorage.getItem("userData") === null) {
            return <Redirect to="/" />
        }

        array.push(
            rullakotData.map(doc => {
                return doc.kaupanNimi;
            })
        )
        Object.keys(result).map(key => ({ [key]: result[key] }))
        for (let i = 0; i < array.length; i++) {
            result[array[i]] = (result[array[i]] || 0) + 1
        }
        Object.keys(result).map(str => str.replace(/\s/g, '')).toString().split(",").forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

        let uniq = [...new Set(Object.keys(result).toString().split(","))];

        let test = "fs fs   fff safafa fafas ffa";
        let testtt = [];

        if (uniq.length > 0) {
            return (
                <ErrorBoundary>
                    <div className="YEARcount">
                        <Button className="buttonArrow" onClick={() => (year = parseInt(year) - 1) + this.rullakotApiData()} >{"<"}</Button>
                        <Input className="YearInput" value={year} readOnly />
                        <Button className="buttonArrow" onClick={() => (year = parseInt(year) + 1) + this.rullakotApiData()} >{">"}</Button>
                    </div>
                    {uniq.map(doc => {
                        return (
                            <div className="rullakkoTop">
                                <Card className="rullakkoCard">
                                    <CardText className="kauppaRulla">Kauppa: {doc}</CardText>
                                    <div className="flexR">
                                        <div className="lainassa">
                                            <CardText className="rullakotRulla">Rullakot lainassa</CardText>
                                            {rullakot.map(doc2 => {
                                                return (
                                                    <li className="rullaList">
                                                        {this.sum(doc, rullakot)}
                                                        <li className="hyllyList">
                                                            <table>
                                                                <tr>
                                                                    <th>Lisätty</th>
                                                                    <th>Rullakoiden määrä</th>
                                                                </tr>
                                                                {console.log(rullakotData.sort((a, b) => {
                                                                    return b.history - a.history
                                                                }))}
                                                                {rullakotData.filter(docFiltered => {
                                                                    return docFiltered.kaupanNimi === doc
                                                                })
                                                                    .filter(docfilter2 => {
                                                                        return docfilter2.rullakonNimi === doc2
                                                                    }).sort((a, b) => {
                                                                        return b.history - a.history
                                                                    }).splice(-5).reverse().map(docc => {
                                                                        let lengthDoc = docc;
                                                                        lengthDoc.length= 5;
                                                                        docc.length = 5;
                                                                        return (
                                                                            <tr>
                                                                                <td>{docc.history}</td>
                                                                                <td>{docc.rullakoidenMaara}</td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                    )


                                                                }

                                                            </table>
                                                        </li>
                                                    </li>
                                                )
                                            })}
                                            <CardText className="hyllytRulla2">Hyllyt lainassa</CardText>
                                            {hyllyt.map(doc2 => {
                                                return (
                                                    <li className="hyllyRullaList2">
                                                        {this.sumHylly(doc, hyllyt)}
                                                        <li className="hyllyList">

                                                        </li>
                                                    </li>
                                                )
                                            })}
                                        </div>
                                        <div className="palautettu">
                                            <CardText className="rullakotRulla">Rullakot palautettu</CardText>
                                            {rullakot.map(doc2 => {
                                                return (
                                                    <li className="rullaList">
                                                        {this.sumPalautetut(doc, rullakot)}
                                                        <li className="hyllyList">
                                                            <Input className="inputPalautetut" id={`${doc}Rullakko${doc2}${year}`}></Input>
                                                            <Button className="tallennaPalautetut" onClick={() => this.IDGRABR(doc, doc2)}>Tallenna</Button>
                                                        </li>
                                                    </li>
                                                )
                                            })}
                                            <CardText className="hyllytRulla">Hyllyt palautettu</CardText>
                                            {hyllyt.map(doc2 => {
                                                return (
                                                    <li id={`${doc}HyllyValue${doc2}${year}`} className="hyllyRullaList">
                                                        {this.sumHyllyPalautetut(doc, hyllyt)}
                                                        <li className="hyllyList">
                                                            <Input className="inputPalautetut" id={`${doc}Hylly${doc2}${year}`}></Input>
                                                            <Button className="tallennaPalautetut" onClick={() => this.IDGRAB(doc, doc2)}>Tallenna</Button>
                                                        </li>
                                                    </li>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </Card>
                            </div >
                        )
                    })
                    }
                </ErrorBoundary>
            )
        }
        return (
            <div>

            </div>
        );
    }
}

export default Rullakot;