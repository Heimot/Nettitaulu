import React, { Component } from 'react';
import { CardText } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import format from "date-fns/format";
import { FETCH_URL } from '../fetch/url';

// CSS
import '../../Styles/calendar.css';

var curr = new Date();
var first = curr.getDate() - curr.getDay() + 1;
var last = first + 6;
let i = 0;
let array = [[{}], [{}], [{}], [{}], [{}], [{}], [{}]];


class Calendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            array: [[{}], [{}], [{}], [{}], [{}], [{}], [{}]],
            counter: 0,
        }
    }

    componentDidMount() {
        try {
            this.testData();
        } catch (err) {
            console.log(err);
        }
    }

    async testData() {
        try {
            array = [];
            while (this.state.counter < 7) {
                let calendarData = await this.testGet();
                array.push(calendarData.product);
                this.setState((prevState, props) => ({
                    counter: prevState.counter + 1
                }));
            }
            this.setState({
                array: array
            })
        } catch (err) {
            console.log(err);
        }
    }

    testGet() {
        try {
            var GETwAuth = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                }
            }
            return fetch(FETCH_URL + 'orders/get/calendar?date=' + format(new Date(curr.setDate(first + this.state.counter)), "dd/MM/yyyy") + '&valmis=Ei', GETwAuth)
                .then(res => res.json())
                .catch((error) => {
                    console.log(error);
                });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        let { array } = this.state;
        return (
            <ErrorBoundary>
                <div className="calendarDiv">
                    <CardText className="kerattavatKaupat">Tuusjärven ja Ryönän kerättävät kaupat tällä viikolla</CardText>
                    <Table className="tableCalendar">
                        <Thead>
                            <Tr>
                                <Th>{format(new Date(curr.setDate(first)), "dd/MM/yyyy")}</Th>
                                <Th>{format(new Date(curr.setDate(first + 1)), "dd/MM/yyyy")}</Th>
                                <Th>{format(new Date(curr.setDate(first + 2)), "dd/MM/yyyy")}</Th>
                                <Th>{format(new Date(curr.setDate(first + 3)), "dd/MM/yyyy")}</Th>
                                <Th>{format(new Date(curr.setDate(first + 4)), "dd/MM/yyyy")}</Th>
                                <Th>{format(new Date(curr.setDate(first + 5)), "dd/MM/yyyy")}</Th>
                                <Th>{format(new Date(curr.setDate(last)), "dd/MM/yyyy")}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>
                                    {array[0].map(doc => {
                                        return (<li className="kauppaLists">{doc.kauppa}</li>)
                                    })}
                                </Td>
                                <Td>
                                    {array[1].map(doc => {
                                        return (<li className="kauppaLists">{doc.kauppa}</li>)
                                    })}
                                </Td>
                                <Td>
                                    {array[2].map(doc => {
                                        return (<li className="kauppaLists">{doc.kauppa}</li>)
                                    })}
                                </Td>
                                <Td>
                                    {array[3].map(doc => {
                                        return (<li className="kauppaLists">{doc.kauppa}</li>)
                                    })}
                                </Td>
                                <Td>
                                    {array[4].map(doc => {
                                        return (<li className="kauppaLists">{doc.kauppa}</li>)
                                    })}
                                </Td>
                                <Td>
                                    {array[5].map(doc => {
                                        return (<li className="kauppaLists">{doc.kauppa}</li>)
                                    })}
                                </Td>
                                <Td>
                                    {array[6].map(doc => {
                                        return (<li className="kauppaLists">{doc.kauppa}</li>)
                                    })}
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </div>
            </ErrorBoundary>
        )
    }
}

export default Calendar;