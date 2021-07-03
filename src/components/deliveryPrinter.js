import React, { Component } from "react";
import { Table, Thead, Tbody, Tr, Td, Th } from "react-super-responsive-table";
import { Button, Input } from "reactstrap";
import { Redirect } from "react-router-dom";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import * as jsPDF from "jspdf";
import ErrorBoundary from "./errorCatcher/ErrorBoundary";
import language from "./language/language";
import JsBarcode from "jsbarcode";
import { FETCH_URL } from "./fetch/url";

//CSS
import "../Styles/print.css";

// 68 38

// 613 404

class Delivery extends Component {
  constructor() {
    super();
    this.state = {
      kauppa: "",
      kauppaId: "",
      maara: 1,
      newID: "",
      Back: false
    };
  }

  printOrder = async () => {
    try {
      let data = [];
      let i;
      for (i = 0; i < this.state.maara; i++) {
        await fetch(FETCH_URL + "delivery/get/delivery", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("userData"),
          },
        })
          .then((response) => response.json())
          .then(async (json) => {
            data.push(json);
            await this.updateCodeToUsed(json);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.printTheData(data);
    } catch (err) {
      console.log(err);
    }
  };

  printTheData = async (data) => {
    let size = data.length;
    var doc = new jsPDF("l", "mm", [107.716, 197.755]);
    var bar = await new Image();
    data.map(async (item) => {
      if (item) {
        JsBarcode(bar, item.deliveryId, {
          format: "CODE128",
        });
        doc.setFontSize(10);
        doc.setFontType("bold");
        doc.text(`Kauppa: ${this.state.kauppa}`, 5, 10);
        doc.text(`KauppaID: ${this.state.kauppaId}`, 5, 16);
        doc.addImage(bar, "png", 5, 18, 60, 20);
        if (size >= 1) {
          doc.addPage();
          size--;
        }
      }
    });
    doc.save("backup.pdf");
    doc.autoPrint();
    doc.output("dataurlnewwindow");
  };

  updateCodeToUsed = async (json) => {
    if (json) {
      await fetch(FETCH_URL + "delivery/patch/id/" + json._id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("userData"),
        },
        body: JSON.stringify([
          {
            propName: "isUsed",
            value: true,
          },
          {
            propName: "dateUsed",
            value: Date(),
          },
        ]),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  addIDS = () => {
    fetch(FETCH_URL + "delivery/post/delivery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("userData"),
      },
      body: JSON.stringify({
        deliveryId: this.state.newID,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
          if(json.message) {
            alert(json.message)
          } else {
              alert("Failed to add. Might be a duplicate. Please try again if its not a duplicate.")
          }
     
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if(this.state.Back) {
        return (
            <Redirect to="/main" />
        )
    }

    return (
      <ErrorBoundary>
        <div>
          <div className="blockerMobile"></div>
          <Button onClick={() => this.setState({ Back: true })}>Takaisin</Button>
          <h1>Vadelma tarrojen tulostaminen</h1>
          <div id="printDiv">
            <Table id="printTables" className="printTable">
              <Thead>
                <Tr>
                  <Th>Kauppa</Th>
                  <Th>Kauppa ID</Th>
                  <Th>Tarrojen määrä</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr className="fontSize">
                  <Td>
                    <Input
                      onChange={this.handleChange}
                      placeholder="Kaupan nimi"
                      name="kauppa"
                      value={this.state.kauppa}
                      type="text"
                    ></Input>
                  </Td>
                  <Td>
                    <Input
                      onChange={this.handleChange}
                      placeholder="Kaupan ID"
                      name="kauppaId"
                      value={this.state.kauppaId}
                      type="text"
                    ></Input>
                  </Td>
                  <Td>
                    <Input
                      onChange={this.handleChange}
                      name="maara"
                      value={this.state.maara}
                      type="number"
                    ></Input>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <div></div>
          </div>
          <Button
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              width: "150px",
              height: "50px",
            }}
            color="success"
            onClick={() => this.printOrder()}
          >
            {language[localStorage.getItem("language")].tulosta}
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "300px",
              border: "solid 1px black",
              borderRadius: "5px",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h3>Lisää kuljetus IDeitä</h3>
            <label>Kuljetus ID</label>
            <Input
              name="newID"
              onChange={this.handleChange}
              placeholder="ID"
              value={this.state.newID}
              style={{
                width: "250px",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            ></Input>
            <Button
              onClick={() => this.addIDS()}
              color="success"
              style={{ width: "200px", marginBottom: "10px" }}
            >
              Lisää
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Delivery;
