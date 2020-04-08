import React, { Component } from 'react';
import { Card, CardText, Button, Input } from 'reactstrap';
import { getRullakotData } from '../fetch/apiFetch';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';

// CSS
import '../../Styles/rullakot.css';

let b = 0;
let filteredForReal = [];
let filtered = [];
let x;

class Rullakot extends Component {
    constructor() {
        super();
        this.state = {
            rullakotData: [{ rullakonNimi: "ErrorHandler", rullakoidenMaara: 404, hyllyjenMaara: 404, kaupanNimi: "Error" }],
        }
    }

    componentDidMount() {
        this.rullakotApiData();
    }

    async rullakotApiData() {
        const data = await getRullakotData();
        console.log(data);
        this.setState({
            rullakotData: data
        })
    }

    rullakotFilterer() {
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
    }

    sum(doc, rullakot) {

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
            const sum = `${filteredForReal.map(item => item.rullakoidenMaara).reduce((prev, curr) => prev + curr, 0)}`;
            const sumNimi = `${nimi}: ${sum}`;
            if (sum > 0) {
                return sumNimi;
            } else {
                return "";
            }
        }
    }

    render() {
        let { rullakotData } = this.state;
        let rullakot = this.rullakotFilterer();

        let array = [];
        let result = {};
        let counts = {};

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

        let uniq = [...new Set(Object.keys(result).toString().split(","))]

        if (uniq.length > 0) {
            return (
                <ErrorBoundary>
                    {uniq.map(doc => {
                        return (
                            <div className="rullakkoTop">
                                <Card className="rullakkoCard">
                                    <CardText>Kauppa: {doc}</CardText>
                                    {rullakot.map(doc2 => {
                                        return (
                                            <li className="rullaList">
                                                {this.sum(doc, rullakot)}
                                            </li>
                                        )
                                    })}
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