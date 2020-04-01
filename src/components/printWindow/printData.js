import React, { Component } from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import { Button } from 'reactstrap';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

//CSS
import '../../Styles/print.css'

let printTF = true;

class Printer extends Component {
    printOrder = async () => {
        const printableElements = document.getElementById('printDiv').innerHTML;
        const orderHtml = '<html><head><title></title></head><body>' + printableElements + '</body></html>';
        const oldPage = document.body.innerHTML;
        window.onbeforeprint = () => {
            document.body.innerHTML = orderHtml;
        }
        window.print();
        window.onafterprint = () => {
            document.body.innerHTML = oldPage;
            window.location.reload();
        }
        document.body.innerHTML = oldPage;
        window.location.reload();

    }

    render() {
        let { newData } = this.props;

        return (
            <div>
                <div id="printDiv" className="printDiv">
                    <Table id="printTables" className="printTable">
                        <Thead>
                            <Tr>
                                <Th>Tuote</Th>
                                <Th>Kerätään</Th>
                                <Th>Lisätietoa</Th>
                                <Th>Kauppa</Th>
                            </Tr>
                        </Thead>
                        {newData.map(data => {
                            return (
                                <Tbody key={data.id}>
                                    <Tr>
                                        <Td>{data.tuote}</Td>
                                        <Td>{data.maara}</Td>
                                        <Td>{data.lisatieto}</Td>
                                        <Td>{data.kauppa}</Td>
                                    </Tr>
                                </Tbody>
                            )
                        })}
                    </Table>
                    <Button onClick={() => this.printOrder()}>Tulosta</Button>
                </div>
                <Button className="printBtn2" onClick={() => this.props.printData(printTF)}></Button>
            </div >
        )
    }
}

export default Printer;