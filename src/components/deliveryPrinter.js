import React, { Component } from "react";
import { Table, Thead, Tbody, Tr, Td, Th } from "react-super-responsive-table";
import { Button, Input } from "reactstrap";
import { Redirect } from "react-router-dom";
import XLSX from "xlsx";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import * as jsPDF from "jspdf";
import ErrorBoundary from "./errorCatcher/ErrorBoundary";
import language from "./language/language";
import JsBarcode from "jsbarcode";
import Dialog from "./dialog/editDialog";
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
      Back: false,
      isLoading: false,
      loadingAmount: 0,
      loadedAmount: 0,
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
        doc.text(`Kauppa: ${this.state.kauppa}`, 5, 7);
        doc.text(`KauppaID: ${this.state.kauppaId}`, 5, 12);
        doc.addImage(bar, "png", 5, 13, 60, 20);
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

  addIDS = (data) => {
    let newID;
    if (data) {
      newID = data;
    } else {
      newID = this.state.newID;
    }
    if (newID.length === 17) {
      let i;
      let sum = 0;
      for (i = 0; i < 17; i++) {
        if (i % 2 == 0) {
          sum = sum + parseInt(newID.charAt(i)) * 3;
        } else {
          sum = sum + parseInt(newID.charAt(i));
        }
      }
      let lastNumber = Math.ceil(sum / 10) * 10 - sum;
      fetch(FETCH_URL + "delivery/post/delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("userData"),
        },
        body: JSON.stringify({
          deliveryId: newID + lastNumber,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState((prevState) => ({
            loadedAmount: prevState.loadedAmount + 1,
          }));
          if (json.message) {
            if (data) {
              console.log(json.message);
            } else {
              alert(json.message);
            }
          } else {
            if (data) {
              console.log(
                "Failed to add. Might be a duplicate. Please try again if its not a duplicate."
              );
            } else {
              alert(
                "Failed to add. Might be a duplicate. Please try again if its not a duplicate."
              );
            }
          }
        })
        .catch((error) => {
          this.setState((prevState) => ({
            loadedAmount: prevState.loadedAmount + 1,
          }));
          console.log(error);
        });
    } else {
      this.setState((prevState) => ({
        loadedAmount: prevState.loadedAmount + 1,
      }));
      if (data) {
        console.log("HEI ID ON LYHYEMPI TAI PIDEMPI KUIN 17 KIRJAINTA!!");
      } else {
        alert("HEI ID ON LYHYEMPI TAI PIDEMPI KUIN 17 KIRJAINTA!!");
      }
    }
  };

  handleFile = (e) => {
    try {
      var file = e.target.files[0];
      // input canceled, return
      if (!file) return;

      var FR = new FileReader();
      FR.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        var result = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          blankrows: false,
        });
        let i;
        for (i = 0; i < result.length; i++) {
          this.setState({
            loadingAmount: result.length,
            isLoading: true,
          });
          let id = result[i][0];
          if (!isNaN(id) && id.length === 17) {
            this.addIDS(id);
          }
        }
      };
      FR.readAsArrayBuffer(file);
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate() {
    let { loadedAmount, loadingAmount } = this.state;
    if (
      loadedAmount !== 0 &&
      loadingAmount !== 0 &&
      loadedAmount === loadingAmount
    ) {
      setTimeout(() => {
        this.setState({
          isLoading: false,
          loadingAmount: 0,
          loadedAmount: 0,
        });
      }, 1000);
    }
  }

  render() {
    if (this.state.Back) {
      return <Redirect to="/main" />;
    }

    return (
      <ErrorBoundary>
        <div>
          <div className="blockerMobile"></div>
          <Button onClick={() => this.setState({ Back: true })}>
            Takaisin
          </Button>
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
            <h5>Tai</h5>
            Lisää excel tiedostoja
            <input type="file" onChange={this.handleFile} />
          </div>
          <Dialog isOpen2={this.state.isLoading}>
            <h1>Loading...</h1>
            <h3>{`${this.state.loadedAmount}/${this.state.loadingAmount}`}</h3>
          </Dialog>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Delivery;
