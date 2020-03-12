import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import { Card, CardText, CardTitle, Button, Input, CardBlock, CardSubtitle } from 'reactstrap';
import Dialog from './components/editDialog';
import "./Styles/Table.css";
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import { deleteFlowerData, updateFlower, patchKeraysData, putFlowersOrderData } from './components/fetch/apiFetch';

class PeopleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kauppa: '',
      customerInfo: '',
      ToimitusPVM: '',
      idArray: [],

      isOpen: false,
      isOpen2: false,

      location: '',
      date: sessionStorage.getItem('userDate'),
      startDate: new Date(),
      startDate2: new Date(),
      createdID: '',
      idf: [],
      addFlowersValue: 1,

      openWarning: false,
      valmisWarning: false,
      alreadyLoaded: false,
    }
  }

  muokkaa(_id, products, kauppa, date, alisatieto, toimituspvm) {
    this.setState({
      isOpen2: true,
    })
  }

  warning() {
    this.setState({
      openWarning: true,
    })
  }

  valmis() {
    this.setState({
      valmisWarning: true,
    })
  }

  async addFlowers(_id, products) {
    if (!this.state.alreadyLoaded) {
      this.state.idArray.push(
        products.map(product => {
          return product._id
        })
      )
    }

    let i = 0;
    while (i < this.state.addFlowersValue) {

      await fetch('http://localhost:3002/products/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);

          let jsonID = json.createdProduct._id;
          this.state.idArray.push(jsonID)

          this.setState({
            idArray: this.state.idArray.toString().split(",")
          })
        })
        .catch((error) => {
          console.log(error);
        });
      i++;
    }
    this.setState({
      alreadyLoaded: true
    })
    this.addToIDS(_id);
  }

  addToIDS(_id) {
    var filteredProducts = this.state.idArray.filter(Boolean);
    fetch('http://localhost:3002/orders/put/id/' + _id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        products: filteredProducts
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
    sessionStorage.removeItem('userDate2');
    this.props.getTables();
  }

  patchData(product) {
    const idvalues = document.getElementById(`keratty/${product._id}`).value;
    var maara = document.getElementById(product._id).value;

    patchKeraysData(product, idvalues, maara);
    this.props.getTables();
  }

  putData(product) {
    var kukka = document.getElementById(`kukka/${product._id}`).value;
    var toimi = document.getElementById(`toimi/${product._id}`).value;
    var kerays = document.getElementById(`kerays/${product._id}`).value;
    var lisatieto = document.getElementById(`lisatieto/${product._id}`).value;

    updateFlower(product, kukka, toimi, kerays, lisatieto);
    this.props.getTables();
  }

  putOrderData(_id, kauppa, alisatieto, toimituspvm) {
    var asiakas = this.state.kauppa;
    var asiakaslisatieto = this.state.customerInfo;
    var toimitusaika = this.state.ToimitusPVM;

    putFlowersOrderData(asiakas, asiakaslisatieto, toimitusaika, kauppa, alisatieto, toimituspvm, _id);
    this.props.getTables();
  }

  deleteData(product) {
    //product.filter(products => products._id !== product._id);
    deleteFlowerData(product);
    this.props.getTables();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  pvmMuutos = (date) => {
    this.setState({
      startDate: date
    });
  }

  toimituspvmMuutos = (date) => {
    this.setState({
      startDate2: date,
      ToimitusPVM: format(date, 'dd/MM/yyyy')
    });
  }

  parseJwt() {
    var base64Url = sessionStorage.getItem('userData').split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    sessionStorage.setItem('userRole', JSON.parse(jsonPayload).roles)
  };

  componentDidMount() {
    this.parseJwt();
    var result = this.state.startDate2;
    result.setDate(result.getDate() + 1);
    this.setState({
      startDate2: result
    });

    this.setState({
      location: localStorage.getItem("userLocation"),
    });
    if (this.state.date) {
    } else {
      this.setState({
        date: this.state.startDate
      })
      sessionStorage.setItem("userDate", format(new Date(), 'dd/MM/yyyy'));
      window.location.reload();
    }
  }

  render() {
    let { _id, products, kauppa, date, alisatieto, toimituspvm } = this.props.person;

    return (
      <div className="myDiv">
        <div className="NavBlock"></div>

        <div>
          <Card className="Cards">
            <CardTitle>{date}</CardTitle>
            <CardTitle>{kauppa}</CardTitle>
            <CardText>{_id}</CardText>
            <CardText className="lisatieto">{alisatieto}</CardText>
            <Table className="Tables">

              <Thead>
                <Tr>
                  <Th>Tuote</Th>
                  <Th>Kerätään</Th>
                  <Th>Keräyspiste</Th>
                  <Th>Lisätietoa</Th>
                  <Th>Keräämässä</Th>
                  <Th>Kerättymäärä</Th>
                </Tr>
              </Thead>


              <Tbody>
                {products.map(product =>
                  <Tr>
                    <Td>{product.kukka}</Td>
                    <Td>{product.toimi}</Td>
                    <Td>{product.kerays}</Td>
                    <Td className="Lisatieto">{product.lisatieto}</Td>
                    <Td>
                      <Input className="label"
                        id={`keratty/${product._id}`}
                        value={product.keratty}
                        placeholder={product.keratty}
                        onDoubleClick={() => { this.patchData(product) }}>
                      </Input>
                    </Td>
                    <Td>
                      <Input className="label"
                        type="number"
                        id={product._id}
                        placeholder={product.kerattymaara}
                        name="kerattymaara">
                      </Input>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            <Button disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="success" onClick={() => this.valmis()}>Valmis</Button>
            <Button disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="primary" onClick={() => this.muokkaa(_id, products, kauppa, date, alisatieto, toimituspvm)}>Muokkaa</Button>
            <Button disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="danger" onClick={() => this.warning()}>Poista</Button>
          </Card>

          <Dialog className="DelWarn" isOpen2={this.state.openWarning} onClose={(e) => this.setState({ openWarning: false })}>

            <Card className="Cards">

              <CardTitle className="warningBox">Haluatko poistaa tämän taulun?</CardTitle>
              <CardText className="warningBox">ID: {_id}</CardText>
              <CardText className="warningBox">KAUPPA: {kauppa}</CardText>
              <CardText className="warningBox">KERÄYSPÄIVÄMÄÄRÄ: {date}</CardText>
              <CardText className="warningBox">TOIMITUSPÄIVÄMÄÄRÄ: {toimituspvm}</CardText>

              <Button className="btn" onClick={() => this.props.removePerson(_id)}>Kyllä</Button>
              <Button className="btn" onClick={() => this.setState({ openWarning: false })}>Ei</Button>

            </Card>
          </Dialog>


          <Dialog className="DelWarn" isOpen2={this.state.valmisWarning} onClose={(e) => this.setState({ valmisWarning: false })}>

            <Card className="Cards">

              <CardTitle className="warningBox">Haluatko viedä tämän taulu valmiina oleviin?</CardTitle>
              <CardTitle className="warningBox">Onko kaikki jo kerätty?</CardTitle>
              <CardText className="warningBox">ID: {_id}</CardText>
              <CardText className="warningBox">KAUPPA: {kauppa}</CardText>
              <CardText className="warningBox">KERÄYSPÄIVÄMÄÄRÄ: {date}</CardText>
              <CardText className="warningBox">TOIMITUSPÄIVÄMÄÄRÄ: {toimituspvm}</CardText>

              <Button className="btn" onClick={() => this.props.removePerson(_id)}>Kyllä</Button>
              <Button className="btn" onClick={() => this.setState({ openWarning: false })}>Ei</Button>

            </Card>
          </Dialog>

          <Dialog className="Muokkaus" isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
            <Card className="UpdateCards">
              <div>
                <CardTitle className="KeraysPVM">Keräyspäivämäärä</CardTitle>
                <DatePicker className="DateUpdate"
                  selected={this.state.startDate}
                  onChange={this.pvmMuutos}
                  dateFormat="d/MM/yyyy"
                  onCalendarClose={() => sessionStorage.setItem('userDate2', format(this.state.startDate, "dd/MM/yyyy"))}
                />

                <CardTitle className="ToimitusPVMText">Toimituspäivämäärä</CardTitle>
                <DatePicker className="ToimitusPVM"
                  selected={this.state.startDate2}
                  onChange={this.toimituspvmMuutos}
                  dateFormat="dd/MM/yyyy"
                />

                <Input
                  className="CustomerInfo"
                  type="textarea"
                  name="customerInfo"
                  placeholder={alisatieto}
                  onChange={this.handleChange}>
                </Input>
              </div>

              <CardTitle>
                <Input type="text"
                  name="kauppa"
                  onChange={this.handleChange}
                  className="inputlabel"
                  placeholder={kauppa}>
                </Input>
              </CardTitle>

              <CardText>{_id}</CardText>
              <Table className="Tables">

                <Thead>
                  <Tr>
                    <Th>Tuote</Th>
                    <Th>Kerätään</Th>
                    <Th>Keräyspiste</Th>
                    <Th>Lisätietoa</Th>
                  </Tr>
                </Thead>

                {products.map(product =>
                  <Tbody>
                    <Tr>
                      <Td >
                        <Input type="text"
                          name="kukka"
                          id={`kukka/${product._id}`}
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={product.kukka}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="number"
                          name="toimi"
                          id={`toimi/${product._id}`}
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={product.toimi}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="kerays"
                          id={`kerays/${product._id}`}
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={product.kerays}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="lisatieto"
                          id={`lisatieto/${product._id}`}
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={product.lisatieto}>
                        </Input>
                      </Td>
                    </Tr>
                    <Button color="success" onClick={() => this.putData(product)}>Päivitä kukan tiedot</Button>
                    <Button color="danger" onClick={() => this.deleteData(product)}>Poista kukka</Button>
                  </Tbody>
                )}
              </Table>
              <div>
                <Button className="addFlower" onClick={() => this.addFlowers(_id, products)}>Lisää kukka</Button>
                <Input type="number"
                  name="addFlowersValue"
                  className="addFlowerInput"
                  max={10}
                  min={1}
                  value={this.state.addFlowersValue}
                  onChange={this.handleChange}>
                </Input>
              </div>
              <div className="taulukkoDivider"></div>
              <Button color="success" onClick={() => this.putOrderData(_id, kauppa, alisatieto, toimituspvm)}>Päivitä taulukon tiedot</Button>
            </Card>
          </Dialog>
        </div>
      </div>
    )
  }
}

export default PeopleCard;
