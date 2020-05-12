import React, { Component } from 'react';
import { CardText, Button, Card, Input } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import Dialog from '../dialog/editDialog';
import moment from 'moment';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import Loader from 'react-spinners/ScaleLoader';
import { FETCH_URL } from '../fetch/url';
import { css } from "@emotion/core";
import language from '../language/language';
import { putRekka } from '../fetch/apiFetch';

// CSS
import '../../Styles/calendar.css';

let array = [[{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }]];
let array2 = [[{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }]];
let i = 0;
let y = 0;
let nextWeek = 0;
let lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }

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
            isOpen: false,
            isOpen3: false,
            kauppa: '',
            id: '',
            rekka: '',
            showRullakot: false
        }
    }

    componentDidMount() {
        try {
            lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
            this.testData();
            this.testData2();
        } catch (err) {
            console.log(err);
        }
    }

    async testData() {
        try {
            lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
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
            lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
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
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        var weekDates = [];

        for (var i = 1; i <= 7; i++) {
            weekDates.push(moment().day(i + nextWeek));
        }

        return weekDates;
    }


    testGet(days) {
        try {
            lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
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
            lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
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
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        this.setState({ loading: true });
        nextWeek = nextWeek + 7;
        this.testData();
        this.testData2();
    }

    lastWeek() {
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        this.setState({ loading: true });
        nextWeek = nextWeek - 7;
        this.testData();
        this.testData2();
    }

    pakkausRekkaan(id) {
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        let rekkaID = document.getElementById(id).value;
        putRekka(id, rekkaID);
        this.setState({
            isOpen: false
        })
    }

    pakkausRekkaanBtn = (e) => {
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        let id = e.target.value;
        let rekkaID = e.target.id
        putRekka(id, rekkaID);
        this.setState({
            isOpen: false
        })
        console.log(e.target.id)
    }

    sumRullakot(doc) {
        try {
            return (<li className="rullakotCalendar">Rullakot: {doc.rullakot.map(item => item.rullakoidenMaara).reduce((prev, curr) => prev + curr, 0)}</li>)
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        var thisWeekDates = this.getThisWeekDates();
        let { array, array2, id, kauppa, rekka, showRullakot, loading } = this.state;

        if (loading) {
            return (<div className="middleLoader"><CardText>Loading...</CardText>
                <Loader
                    css={override}
                    height={140}
                    width={16}
                    color={"#123abc"}
                    loading={loading}
                /></div>)
        }

        return (
            <ErrorBoundary>
                <div className="calendarDiv">
                    <CardText className="kerattavatKaupat">{language[localStorage.getItem('language')].calendarToimitettavat}</CardText>
                    <Dialog className="DelWarn" isOpen2={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })}>
                        <Card className="alignBoxes">
                            <CardText className="textSizeKalenteriTitle">Rekka johon tilaus pakataan</CardText>
                            <CardText className="textSizeKalenteri">{kauppa}</CardText>
                            <CardText className="textSizeKalenteri">{id}</CardText>
                            <CardText className="textSizeKalenteri">{`Rekan numero: ${rekka}`}</CardText>
                            <ol className="btnListCalendar">
                                <li>
                                    <Button id="MEY-934" value={id} className="btnListCalendarButton" onClick={this.pakkausRekkaanBtn}>MEY-934</Button>
                                </li>
                                <li>
                                    <Button id="LJG-927" value={id} className="btnListCalendarButton" onClick={this.pakkausRekkaanBtn}>LJG-927</Button>
                                </li>
                                <li>
                                    <Button id="UBY-608" value={id} className="btnListCalendarButton" onClick={this.pakkausRekkaanBtn}>UBY-608</Button>
                                </li>
                                <li>
                                    <Button id="LYB-270" value={id} className="btnListCalendarButton" onClick={this.pakkausRekkaanBtn}>LYB-270</Button>
                                </li>
                                <li>
                                    <Button id="KIX-767" value={id} className="btnListCalendarButton" onClick={this.pakkausRekkaanBtn}>KIX-767</Button>
                                </li>
                                <li>
                                    <Button id="DAF" value={id} className="btnListCalendarButton" onClick={this.pakkausRekkaanBtn}>DAF</Button>
                                </li>
                                <li>
                                    <Button id="Schenker nouto" value={id} className="btnListCalendarButton" onClick={this.pakkausRekkaanBtn}>Schenker nouto</Button>
                                </li>
                            </ol>
                            <CardText className="textSizeKalenteri">Custom input mikäli rekkaa ei löydy</CardText>
                            <Input placeholder="Rekisteri" id={id}></Input>
                            <Button onClick={() => this.pakkausRekkaan(id)}>{language[localStorage.getItem('language')].trolleySave}</Button>
                        </Card>
                    </Dialog>
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
                                        {array2[0].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => { //<div>{doc.rekka !== lastVal ? <li className="headerRekat">{doc.rekka}</li> : undefined}<li className="kauppaLists"><CardText>{doc.rekka}</CardText><CardText>{doc.kauppa}</CardText><CardText style={{ position: "absolute", visibility: "hidden"}}>{lastVal = doc.rekka}</CardText></li></div>
                                            return (<div>{doc.rekka !== lastVals.val1 ? <li onClick={() => this.setState(prevState => ({ showRullakot: !prevState.showRullakot }))} className="headerRekat">Rekka: {doc.rekka} {doc.rullakot !== undefined ? showRullakot === true ? <CardText>{this.sumRullakot(doc)}</CardText> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val1 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[1].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val2 ? <li onClick={() => this.setState(prevState => ({ showRullakot: !prevState.showRullakot }))} className="headerRekat">Rekka: {doc.rekka} {doc.rullakot !== undefined ? showRullakot === true ? <CardText>{this.sumRullakot(doc)}</CardText> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val2 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[2].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val3 ? <li onClick={() => this.setState(prevState => ({ showRullakot: !prevState.showRullakot }))} className="headerRekat">Rekka: {doc.rekka} {doc.rullakot !== undefined ? showRullakot === true ? <CardText>{this.sumRullakot(doc)}</CardText> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val3 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[3].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val4 ? <li onClick={() => this.setState(prevState => ({ showRullakot: !prevState.showRullakot }))} className="headerRekat">Rekka: {doc.rekka} {doc.rullakot !== undefined ? showRullakot === true ? <CardText>{this.sumRullakot(doc)}</CardText> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val4 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[4].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val5 ? <li onClick={() => this.setState(prevState => ({ showRullakot: !prevState.showRullakot }))} className="headerRekat">Rekka: {doc.rekka} {doc.rullakot !== undefined ? showRullakot === true ? <CardText>{this.sumRullakot(doc)}</CardText> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val5 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[5].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val6 ? <li onClick={() => this.setState(prevState => ({ showRullakot: !prevState.showRullakot }))} className="headerRekat">Rekka: {doc.rekka} {doc.rullakot !== undefined ? showRullakot === true ? <CardText>{this.sumRullakot(doc)}</CardText> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val6 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[6].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val7 ? <li onClick={() => this.setState(prevState => ({ showRullakot: !prevState.showRullakot }))} className="headerRekat">Rekka: {doc.rekka} {doc.rullakot !== undefined ? showRullakot === true ? <CardText>{this.sumRullakot(doc)}</CardText> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val7 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                        <Button className="nextWeek" color="primary" onClick={() => this.nextWeek()}>{">"}</Button>
                    </div>
                    <CardText className="kerattavatKaupat">{language[localStorage.getItem('language')].calendarKerattavat}</CardText>
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
                                        {array[0].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[1].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[2].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[3].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[4].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[5].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array[6].sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}</li>)
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