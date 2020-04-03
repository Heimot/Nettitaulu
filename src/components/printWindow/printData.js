import React, { Component, useCallback } from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import { Button } from 'reactstrap';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import * as jsPDF from 'jspdf';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import EU from '../../pictures/Eu-lippuMV.JPG';
import logo from '../../pictures/Heimosen_Puutarha_logo.png';

//CSS
import '../../Styles/print.css'

let printTF = true;

// 68 38

var img = new Image();
img.src = EU;

var img2 = new Image();
img2.src = logo;

// 613 404

class Printer extends Component {
    printOrder = async (newData) => {
        try {
            var doc = new jsPDF('l', 'mm', [107.716, 197.755]);
            let size = newData.length;
            await newData.map(data => {
                doc.addImage(img, "JPEG", 4, 2, 10, 7)
                doc.addImage(img2, "png", 45, 2, 24, 10)
                doc.setFontSize(10)
                doc.text('Kasvipassi / Plant passport', 15, 5)
                doc.setFontSize(10)
                doc.text(`A. ${data.tuote.toString()}`, 5, 16)
                doc.setFontSize(8)
                doc.text(`B. FI-56466    C. ${data.kerays === "Ryönä" ? "RII1" : "TUU2"}    D. FI`, 5, 20)
                doc.setFontSize(10)
                doc.text(`Kauppa: ${data.kauppa.toString()}`, 5, 25)
                doc.text(`Määrä: ${data.maara.toString()}`, 5, 30)
                doc.text(`Lisätietoa: ${data.lisatieto.toString()}`, 5, 35)
                //doc.text(`${data.id.toString()}`, 5, 23)
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