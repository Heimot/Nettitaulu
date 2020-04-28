import React, { Component } from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import { Button, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import * as jsPDF from 'jspdf';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import EU from '../../pictures/Eu-lippuMV.JPG';
import logo from '../../pictures/Heimosen_Puutarha_logo.png';
import language from '../language/language';

//CSS
import '../../Styles/print.css'

let printTF = true;
let arr = [];
let docArr = [];
let delPrint2 = false;

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

            if (docArr.length <= 0) {
                docArr = newData;
            }
            let size = docArr.length;

            await docArr.map(data => {
                doc.addImage(img, "JPEG", 4, 2, 10, 7)
                doc.addImage(img2, "png", 45, 2, 24, 10)
                doc.setFontSize(10)
                doc.text('Kasvipassi / Plant passport', 15, 5)
                doc.setFontSize(10)
                doc.setFontType("bold");
                doc.text(`A. ${data.tuote.toString()}`, 5, 16)
                doc.setFontType("");
                doc.setFontSize(8)
                doc.text(`B. FI-56466    C. ${data.kerays === "Ryönä" ? "RII1" : "TUU2"}    D. FI`, 5, 20)
                doc.setFontSize(10)
                doc.text(`Kauppa: ${data.kauppa.toString()}`, 5, 25)
                doc.text(`Määrä: ${data.maara.toString()}`, 5, 30)
                doc.text(`Lisätietoa: ${data.lisatieto.toString()}`, 5, 35)
                doc.setFontSize(7)
                doc.text(data.date.toString(), 15, 8)
                if (size >= 1) {
                    doc.addPage()
                    size--;
                } else {

                }
            })
            doc.save('tarrat.pdf')
            this.props.emptyData();
        } catch (err) {
            console.log(err);
        }
    }

    emptyData() {
        docArr = [];
        arr = [];
        delPrint2 = true;
        this.props.cleanUp(delPrint2);
    }

    handleChange = (data) => {
        let stickerAmount = document.getElementById(`kukka/${data.id}`).value;
        let i = 1;

        for (i = 1; i < stickerAmount; i++) {
            arr.push({
                kauppa: data.kauppa,
                tuote: data.tuote,
                maara: data.maara,
                lisatieto: data.lisatieto,
                id: data.id,
                kerays: data.kerays
            });
        }
        docArr = arr.concat(docArr)
    }

    render() {
        let { newData } = this.props;

        console.log(newData)

        if (sessionStorage.getItem("userData") === null) {
            return <Redirect to="/" />
        }

        if (newData) {
            docArr = newData
        }

        return (
            <ErrorBoundary>
                <div>
                    <div className="blockerMobile"></div>
                    <div id="printDiv" className="printDiv">
                        <Table id="printTables" className="printTable">
                            <Thead>
                                <Tr>
                                    <Th>{language[localStorage.getItem('language')].tuote}</Th>
                                    <Th>{language[localStorage.getItem('language')].kerataan}</Th>
                                    <Th>{language[localStorage.getItem('language')].lisatietoa}</Th>
                                    <Th>{language[localStorage.getItem('language')].kauppa}</Th>
                                    <Th>{language[localStorage.getItem('language')].tarrat}</Th>
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
                                            <Td className="buttonInputRow"><Input className="printInput" id={"kukka/" + data.id} min="0" type="number"></Input> <Button className="printButton" onClick={() => this.handleChange(data)}>X</Button></Td>
                                        </Tr>
                                    </Tbody>
                                )
                            })}
                        </Table>
                    </div>
                    <Button className="printingBtn" color="success" onClick={() => this.printOrder(newData) + this.emptyData()}>{language[localStorage.getItem('language')].tulosta}</Button>
                    <Button className="printBtn2" onClick={() => this.props.printData(printTF)}></Button>
                </div >
            </ErrorBoundary>
        )
    }
}

export default Printer;