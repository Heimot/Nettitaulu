import React, { Component } from 'react';
import { CardText, Button, Card, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import Dialog from '../dialog/editDialog';
import moment from 'moment';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import Loader from 'react-spinners/ScaleLoader';
import { FETCH_URL } from '../fetch/url';
import { css } from "@emotion/core";
import language from '../language/language';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { putRekka, putInfoCalendar, createInfoCalendar, getCalendarInfo, putOrdersOrder } from '../fetch/apiFetch';

// CSS
import '../../Styles/calendar.css';

let array = [[{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }]];
let array2 = [[{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }], [{ "kauppa": "Loading...." }]];
let i = 0;
let y = 0;
let nextWeek = 0;
let lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null, val8: null }

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
            showRullakot: false,
            infoBox: false,
            rekkaUsed: '',
            date: '',
            infoData: '',
            createNew: false,
            orderLists: false,
            counterI: null,
            orderList: [],
            redirect: false,
        }
    }

    componentDidMount() {
        try {
            if (sessionStorage.getItem("userData") === null) {
                this.setState(() => ({
                    redirect: true
                }));
            }
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
    }

    sumRullakot(doc) {
        try {
            lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
            return (<li className="rullakotCalendar">Rullakot: {doc.rullakot.map(item => item.rullakoidenMaara).reduce((prev, curr) => prev + curr, 0)}</li>)
        } catch (err) {
            console.log(err);
        }
    }

    pushPDF = (doc, i) => {
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        let rekat = array2[i].filter(docs => { return (docs.rekka === doc.rekka) })
        let rullakot = doc.rullakot.map(item => item.rullakoidenMaara).reduce((prev, curr) => prev + curr, 0)
        this.pushToPDF(rekat, rullakot);
    }

    pushToPDF = (rekat, rullakot) => {
        try {
            lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
            var doc = new jsPDF();
            let i = 0;
            let b = 1;
            let rekatLenght = rekat.length;
            let result = [];

            if (rullakot === undefined) {
                rullakot = 0;
            }

            for (i = 0; i < rekatLenght; i++) {
                result.push([rekat[i].kauppa.toString(), rekat[i].rekka.toString()])
            }

            var header = function () {
                doc.setFontSize(10)
                doc.text(`Rullakoiden määrä: ${rullakot.toString()}`, 85, 10)
            };

            doc.autoTable({
                head: [['Kauppa', 'Rekka']],
                body: result,
                margin: { horizontal: 0, top: 20 },
                bodyStyles: { valign: 'top' },
                styles: { overflow: 'linebreak', cellWidth: 'wrap' },
                columnStyles: { text: { cellWidth: 'auto' } },
                didDrawPage: header
            });


            doc.save('rekat.pdf');
        } catch (err) {
            console.log(err);
        };
    }

    async calendarInfo() {
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        let { infoData, date, rekkaUsed, createNew } = this.state;
        let idCreated = date.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') + rekkaUsed.replace(/\s/g, '').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        if (createNew) {
            createInfoCalendar(idCreated, infoData);
        } else {
            putInfoCalendar(idCreated, infoData);
        }
        this.setState({ infoBox: false })

    }

    async stateChangesGet(doc, thisWeekDates, i) {
        try {
            lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
            this.setState({
                infoBox: true,
                rekkaUsed: doc.rekka,
                date: thisWeekDates[i].format('DD/MM/YYYY'),
                infoData: "",
                createNew: false
            });
            let idCreated = thisWeekDates[i].format('DD/MM/YYYY').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') + doc.rekka.replace(/\s/g, '').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            let data = await getCalendarInfo(idCreated);
            if (data.message !== "NoDataFound") {
                this.setState({
                    infoData: data.calendar.info
                });
            } else {
                this.setState({
                    createNew: true
                });
            }
        } catch (err) {
            console.log(err)
        }
    }

    startOrdering(doc, i) {
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        this.setState({
            orderLists: true,
            counterI: i,
            orderList: array2[i].filter(docs => { return docs.rekka === doc.rekka }).sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).sort((a, b) => { return a.position - b.position })
        })
    }

    openOptions(doc, thisWeekDates, i) {
        lastVals = { val1: null, val2: null, val3: null, val4: null, val5: null, val6: null, val7: null }
        let { showRullakot } = this.state;
        let data = doc.rekka + thisWeekDates[i].format('DD/MM/YYYY');
        if (showRullakot !== data) {
            this.setState({ showRullakot: data })
        } else {
            this.setState({ showRullakot: "" })
        }
    }

    savePositionChanges(orderList) {
        orderList.map(doc => {
            let id = doc._id;
            let position = document.getElementById(`${doc.rekka}/${doc._id}`).value;
            if (position.length <= 0 && !isNaN(position)) {
                position = doc.position;
            }
            putOrdersOrder(id, position);
        })
    }

    handleChange = (e) => {
        this.setState({
            infoData: e.target.value
        })
    }

    render() {
        var thisWeekDates = this.getThisWeekDates();
        let { array, array2, id, kauppa, rekka, showRullakot, loading, infoBox, rekkaUsed, date, infoData, orderLists, orderList, counterI } = this.state;

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


        if (this.state.redirect) {
            return <Redirect to="/" />
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
                    <Dialog className="DelWarn" isOpen2={infoBox} onClose={(e) => this.setState({ infoBox: false })}>
                        <Card className="alignBoxes">
                            <CardText className="textSizeKalenteriTitle">Lisätietoa</CardText>
                            <CardText className="textSizeKalenteri">{date}</CardText>
                            <CardText className="textSizeKalenteri">{rekkaUsed}</CardText>
                            <Input value={infoData} placeholder="TEXT" onChange={this.handleChange} type="textarea"></Input>
                            <Button onClick={() => this.calendarInfo()}>Tallenna</Button>
                        </Card>
                    </Dialog>
                    <Dialog className="DelWarn" isOpen2={orderLists} onClose={(e) => this.setState({ orderLists: false })}>
                        <Card>
                            <Td>
                                {orderList.sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                    return (<div>{doc.rekka !== lastVals.val8 ? <div className="headerRekat2"><CardText className="headerOrderRekka">Rekka: {doc.rekka}</CardText> <CardText className="headerOrder">Järjestys numero: </CardText></div> : undefined}<li className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}><div className="flexWidth"><CardText className="kauppaLI">{doc.kauppa}</CardText><Input id={`${doc.rekka}/${doc._id}`} placeholder={doc.position} className="positionLI"></Input></div><CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val8 = doc.rekka}</CardText></li></div>)
                                })}
                            </Td>
                            <Button onClick={() => this.savePositionChanges(orderList)}>Tallenna järjestys</Button>
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
                                        {array2[0].sort((a, b) => { return a.position - b.position }).sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val1 ? <li className="headerRekat"><CardText onClick={() => this.openOptions(doc, thisWeekDates, i = 0)}>Rekka: {doc.rekka}</CardText> {doc.rullakot !== undefined ? showRullakot === doc.rekka + thisWeekDates[0].format('DD/MM/YYYY') ? <div><div className="btnDownFall"><Button className="pdfBtnDoc" onClick={() => this.pushPDF(doc, i = 0)}></Button> <Button className="qaInfoBtn" onClick={() => this.stateChangesGet(doc, thisWeekDates, i = 0)}></Button> <Button className="orderBtnOrders" onClick={() => this.startOrdering(doc, i = 0)}></Button></div><CardText>{this.sumRullakot(doc)}</CardText></div> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val1 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[1].sort((a, b) => { return a.position - b.position }).sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val2 ? <li className="headerRekat"><CardText onClick={() => this.openOptions(doc, thisWeekDates, i = 1)}>Rekka: {doc.rekka}</CardText> {doc.rullakot !== undefined ? showRullakot === doc.rekka + thisWeekDates[1].format('DD/MM/YYYY') ? <div><div className="btnDownFall"><Button className="pdfBtnDoc" onClick={() => this.pushPDF(doc, i = 1)}></Button> <Button className="qaInfoBtn" onClick={() => this.stateChangesGet(doc, thisWeekDates, i = 1)}></Button> <Button className="orderBtnOrders" onClick={() => this.startOrdering(doc, i = 1)}></Button></div><CardText>{this.sumRullakot(doc)}</CardText></div> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val2 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[2].sort((a, b) => { return a.position - b.position }).sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val3 ? <li className="headerRekat"><CardText onClick={() => this.openOptions(doc, thisWeekDates, i = 2)}>Rekka: {doc.rekka}</CardText> {doc.rullakot !== undefined ? showRullakot === doc.rekka + thisWeekDates[2].format('DD/MM/YYYY') ? <div><div className="btnDownFall"><Button className="pdfBtnDoc" onClick={() => this.pushPDF(doc, i = 2)}></Button> <Button className="qaInfoBtn" onClick={() => this.stateChangesGet(doc, thisWeekDates, i = 2)}></Button> <Button className="orderBtnOrders" onClick={() => this.startOrdering(doc, i = 2)}></Button></div><CardText>{this.sumRullakot(doc)}</CardText></div> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val3 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[3].sort((a, b) => { return a.position - b.position }).sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val4 ? <li className="headerRekat"><CardText onClick={() => this.openOptions(doc, thisWeekDates, i = 3)}>Rekka: {doc.rekka}</CardText> {doc.rullakot !== undefined ? showRullakot === doc.rekka + thisWeekDates[3].format('DD/MM/YYYY') ? <div><div className="btnDownFall"><Button className="pdfBtnDoc" onClick={() => this.pushPDF(doc, i = 3)}></Button> <Button className="qaInfoBtn" onClick={() => this.stateChangesGet(doc, thisWeekDates, i = 3)}></Button> <Button className="orderBtnOrders" onClick={() => this.startOrdering(doc, i = 3)}></Button></div><CardText>{this.sumRullakot(doc)}</CardText></div> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val4 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[4].sort((a, b) => { return a.position - b.position }).sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val5 ? <li className="headerRekat"><CardText onClick={() => this.openOptions(doc, thisWeekDates, i = 4)}>Rekka: {doc.rekka}</CardText> {doc.rullakot !== undefined ? showRullakot === doc.rekka + thisWeekDates[4].format('DD/MM/YYYY') ? <div><div className="btnDownFall"><Button className="pdfBtnDoc" onClick={() => this.pushPDF(doc, i = 4)}></Button> <Button className="qaInfoBtn" onClick={() => this.stateChangesGet(doc, thisWeekDates, i = 4)}></Button> <Button className="orderBtnOrders" onClick={() => this.startOrdering(doc, i = 4)}></Button></div><CardText>{this.sumRullakot(doc)}</CardText></div> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val5 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[5].sort((a, b) => { return a.position - b.position }).sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val6 ? <li className="headerRekat"><CardText onClick={() => this.openOptions(doc, thisWeekDates, i = 5)}>Rekka: {doc.rekka}</CardText> {doc.rullakot !== undefined ? showRullakot === doc.rekka + thisWeekDates[5].format('DD/MM/YYYY') ? <div><div className="btnDownFall"><Button className="pdfBtnDoc" onClick={() => this.pushPDF(doc, i = 5)}></Button> <Button className="qaInfoBtn" onClick={() => this.stateChangesGet(doc, thisWeekDates, i = 5)}></Button> <Button className="orderBtnOrders" onClick={() => this.startOrdering(doc, i = 5)}></Button></div><CardText>{this.sumRullakot(doc)}</CardText></div> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val6 = doc.rekka}</CardText></li></div>)
                                        })}
                                    </Td>
                                    <Td>
                                        {array2[6].sort((a, b) => { return a.position - b.position }).sort((a, b) => { return a.rekka.localeCompare(b.rekka) }).map(doc => {
                                            return (<div>{doc.rekka !== lastVals.val7 ? <li className="headerRekat"><CardText onClick={() => this.openOptions(doc, thisWeekDates, i = 6)}>Rekka: {doc.rekka}</CardText> {doc.rullakot !== undefined ? showRullakot === doc.rekka + thisWeekDates[6].format('DD/MM/YYYY') ? <div><div className="btnDownFall"><Button className="pdfBtnDoc" onClick={() => this.pushPDF(doc, i = 6)}></Button> <Button className="qaInfoBtn" onClick={() => this.stateChangesGet(doc, thisWeekDates, i = 6)}></Button> <Button className="orderBtnOrders" onClick={() => this.startOrdering(doc, i = 6)}></Button></div><CardText>{this.sumRullakot(doc)}</CardText></div> : undefined : undefined}</li> : undefined}<li onClick={() => this.setState({ isOpen: true, id: doc._id, kauppa: doc.kauppa, rekka: doc.rekka })} className={doc.ryona === "Kyllä" ? "kauppaValmisRow" : doc.ryona === "Arkistoitu" ? "kauppaArkistoRow" : doc.tuusjarvi === "Kyllä" ? "kauppaValmisRow" : doc.tuusjarvi === "Arkistoitu" ? "kauppaArkistoRow" : "kauppaLists"}>{doc.kauppa}<CardText style={{ position: "absolute", visibility: "hidden" }}>{lastVals.val7 = doc.rekka}</CardText></li></div>)
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