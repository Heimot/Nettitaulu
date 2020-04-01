import React, { Component } from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import { Button } from 'reactstrap';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import * as jsPDF from 'jspdf'

//CSS
import '../../Styles/print.css'

let printTF = true;




class Printer extends Component {
    printOrder = async (newData) => {
        var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [78, 170]
        });
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
                console.log(size)
                size--;
            } else {
                return null;
            }
        })
        doc.save('tarrat.pdf')
        /*
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
*/
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
                <Button className="printingBtn" onClick={() => this.printOrder(newData)}>Tulosta</Button>
                <Button className="printBtn2" onClick={() => this.props.printData(printTF)}></Button>
            </div >
        )
    }
}

export default Printer;