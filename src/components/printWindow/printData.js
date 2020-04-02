import React, { Component } from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import { Button } from 'reactstrap';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import * as jsPDF from 'jspdf';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';

//CSS
import '../../Styles/print.css'

let printTF = true;




class Printer extends Component {
    printOrder = async (newData) => {
        try {
            var doc = new jsPDF('l', 'mm', [82.20, 175.74]);
            let size = newData.length;

            await newData.map(data => {
                doc.setFontSize(8)
                doc.text(`Kauppa: ${data.kauppa.toString()}`, 2, 3)
                doc.text(`Tuote: ${data.tuote.toString()}`, 2, 8)
                doc.text(`Määrä: ${data.maara.toString()}`, 2, 13)
                doc.text(`Lisätietoa: ${data.lisatieto.toString()}`, 2, 18)
                doc.text(`${data.id.toString()}`, 2, 23)
                if (size >= 1) {
                    doc.addPage()
                    size--;
                } else {
                    return null;
                }
            })
            doc.save('tarrat.pdf')
            this.props.emptyData();
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        let { newData } = this.props;

        return (
            <ErrorBoundary>
                <div>
                    <div className="blockerMobile"></div>
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
                                        <Tr className="fontSize">
                                            <Td className>{data.tuote}</Td>
                                            <Td>{data.maara}</Td>
                                            <Td>{data.lisatieto}</Td>
                                            <Td>{data.kauppa}</Td>
                                        </Tr>
                                    </Tbody>
                                )
                            })}
                        </Table>
                    </div>
                    <Button className="printingBtn" color="success" onClick={() => this.printOrder(newData)}>Tulosta</Button>
                    <Button className="printBtn2" onClick={() => this.props.printData(printTF)}></Button>
                </div >
            </ErrorBoundary>
        )
    }
}

export default Printer;