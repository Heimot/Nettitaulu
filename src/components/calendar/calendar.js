import React, { Component } from 'react';
import { CardText, Button } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import moment from 'moment';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import Loader from 'react-spinners/ScaleLoader';
import { FETCH_URL } from '../fetch/url';
import { css } from "@emotion/core";

// CSS
import '../../Styles/calendar.css';

let array = [[{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }]];
let array2 = [[{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }]];
let i = 0;
let y = 0;
let nextWeek = 0;
let nextWeek2 = 0;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Calendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            array: [[{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }]],
            array2: [[{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }]],
            counter: 0,
            nextWeek: 0,
            loading: true,
        }
    }

    componentDidMount() {
        try {
            this.testData();
            this.testData2();
        } catch (err) {
            console.log(err);
        }
    }

    async testData() {
        try {
            var now = moment();
            i = 0;
            array = [];

            while (i < 7) {
                var days = now.clone().weekday(1 + i + nextWeek).format("DD/MM/YYYY");
                let calendarData = await this.testGet(days);
                array.push(calendarData.product);
                i++;
            }

            this.setState({
                array: array,
                loading: false,
            })

        } catch (err) {
            console.log(err);
        }
    }

    async testData2() {
        try {
            var now = moment();
            y = 0;
            array2 = [];

            while (y < 7) {
                var days = now.clone().weekday(1 + y + nextWeek).format("DD/MM/YYYY");
                let calendarData = await this.testGet2(days);
                array2.push(calendarData.product);
                y++;
            }

            this.setState({
                array2: array2,
            })

        } catch (err) {
            console.log(err);
        }
    }

    getThisWeekDates() {
        var weekDates = [];

        for (var i = 1; i <= 7; i++) {
            weekDates.push(moment().day(i + nextWeek));
        }

        return weekDates;
    }


    testGet(days) {
        try {
            var GETwAuth = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                }
            }
            return fetch(FETCH_URL + 'orders/get/calendar?date=' + days, GETwAuth)
                .then(res => res.json())
                .catch((error) => {
                    console.log(error);
                });
        } catch (err) {
            console.log(err);
        }
    }

    testGet2(days) {
        try {
            var GETwAuth = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                }
            }
            return fetch(FETCH_URL + 'orders/get/calendar?toimitus=' + days, GETwAuth)
                .then(res => res.json())
                .catch((error) => {
                    console.log(error);
                });
        } catch (err) {
            console.log(err);
        }
    }

    nextWeek() {
        this.setState({ loading: true });
        nextWeek = nextWeek + 7;
        this.testData();
        this.testData2();
    }

    lastWeek() {
        this.setState({ loading: true });
        nextWeek = nextWeek - 7;
        this.testData();
        this.testData2();
    }

    render() {
        var thisWeekDates = this.getThisWeekDates();
        let { array, array2 } = this.state;

        console.log(array2)

        if (this.state.loading) {
            return (<div className="middleLoader"><CardText>Loading...</CardText>
                <Loader
                    css={override}
                    height={140}
                    width={16}
                    color={"#123abc"}
                    loading={this.state.loading}
                /></div>)
        }

        return (
            <ErrorBoundary>
                <div className="calendarDiv">
                    <CardText className="kerattavatKaupat">Tuusjärven ja Ryönän toimitettavat kaupat</CardText>
                    <div className="tableBtnContainer">
                        <Button className="lastWeek" color="primary" onClick={() => this.lastWeek()}>{"<"}</Button>
                        <Table className="tableCalendar">
                            <Thead>
                                <Tr>

                                    {thisWeekDates.map(date => {
                                        return (<Th>{date.format("DD/MM/YYYY")}</Th>)
                                    })}
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        {array2[0].map(doc => {
                                            return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[1].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[2].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[3].map(doc => {
                                          return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[4].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[5].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[6].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                        <Button className="nextWeek" color="primary" onClick={() => this.nextWeek()}>{">"}</Button>
                    </div>
                    <CardText className="kerattavatKaupat">Tuusjärven ja Ryönän kerättävät kaupat</CardText>
                    <div className="tableBtnContainer">
                        <Button className="lastWeek" color="primary" onClick={() => this.lastWeek()}>{"<"}</Button>
                        <Table className="tableCalendar">
                            <Thead>
                                <Tr>

                                    {thisWeekDates.map(date => {
                                        return (<Th>{date.format("DD/MM/YYYY")}</Th>)
                                    })}
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        {array[0].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[1].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[2].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[3].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[4].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[5].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[6].map(doc => {
                                           return (<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                        <Button className="nextWeek" color="primary" onClick={() => this.nextWeek()}>{">"}</Button>
                    </div>
                </div>
            </ErrorBoundary >
        )
    }
}

export default Calendar;