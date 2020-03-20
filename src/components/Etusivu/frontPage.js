import React, { Component } from "react";
import { Input, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import XLSX from 'xlsx';

//CSS
import "../../Styles/frontPage.css";


class frontPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
            saved: "",
        }
    }            

    sendData(result) {
        this.setState({
            saved: result
        });

        fetch('http://localhost:3002/items/put/id/5e71e2d16f0335253c8374e5/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
            },
            body: JSON.stringify({
                flowers: this.state.saved
            }),
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    handleFile = (e) => {
        console.log(Object.keys(XLSX.utils))
        var file = e.target.files[0];
        // input canceled, return
        if (!file) return;

        var FR = new FileReader();
        FR.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: "array" });
            var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

            // header: 1 instructs xlsx to create an 'array of arrays'
            var result = XLSX.utils.sheet_to_csv(firstSheet, { header: 1 });

            console.log(result)

            fetch('http://localhost:3002/items/put/id/5e71e2d16f0335253c8374e5', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                },
                body: JSON.stringify({
                  flowers: result.split("\n")
                }),
              })
                .then(response => response.json())
                .then(json => {
                  console.log(json);
                })
                .catch((error) => {
                  console.log(error);
                });

        };
        FR.readAsArrayBuffer(file);
    };

    handleFile2 = (e) => {
        console.log(Object.keys(XLSX.utils))
        var file = e.target.files[0];
        // input canceled, return
        if (!file) return;

        var FR = new FileReader();
        FR.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: "array" });
            var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

            // header: 1 instructs xlsx to create an 'array of arrays'
            var result = XLSX.utils.sheet_to_csv(firstSheet, { header: 1 });

            console.log(result)

            fetch('http://localhost:3002/items/put/id/5e748700bee89f3d5c27ae55', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
                },
                body: JSON.stringify({
                  kaupat: result.split("\n")
                }),
              })
                .then(response => response.json())
                .then(json => {
                  console.log(json);
                })
                .catch((error) => {
                  console.log(error);
                });

        };
        FR.readAsArrayBuffer(file);
    };

    render() {

        if (this.state.redirect) {
            return (<Redirect to={'/main/tables'} />)
        }

        return (
            <div className="frontPage">
                <div className="frontPageMenu">
                    <Button className="frontPageSettings"></Button>
                    <div className="frontMainBtn">
                        <Button className="redirect" onClick={() => this.setState({ redirect: true })}>Kerättävät</Button>
                        <Button className="redirect2" onClick={() => this.setState({ redirect: true })}>Valmiit</Button>
                        <Button className="redirect3" onClick={() => this.setState({ redirect: true })}>?????</Button>
                        <Button className="redirect4" onClick={() => this.setState({ redirect: true })}>????</Button>
                        <Input type="file" name="file" id="exampleFile" accept=".xls,.xlsx,.ods" onChange={(e) => this.handleFile(e)}></Input>
                        <Input type="file" name="file2" id="exampleFile2" accept=".xls,.xlsx,.ods" onChange={(e) => this.handleFile2(e)}></Input>
                    </div>
                    <div className="pictureDot"></div>
                </div>
                <h1 className="frontText">Ohjelma</h1>
                <div className="frontPagePictureDiv">
                </div>
            </div>
        )
    }
}

export default frontPage;