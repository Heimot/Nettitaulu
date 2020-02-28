import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import { Card, CardText, CardTitle, Button, Input } from 'reactstrap';
import Dialog from './components/editDialog';
import "./Styles/Table.css";
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";


class CheckedCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kauppa: '',
      customerInfo: '',

      nimi1: '',
      maara1: '',
      kerays1: '',
      keratty1: '',
      kerattymaara1: '',
      lisatieto1: '',

      nimi2: '',
      maara2: '',
      kerays2: '',
      keratty2: '',
      kerattymaara2: '',
      lisatieto2: '',

      nimi3: '',
      maara3: '',
      kerays3: '',
      keratty3: '',
      kerattymaara3: '',
      lisatieto3: '',

      nimi4: '',
      maara4: '',
      kerays4: '',
      keratty4: '',
      kerattymaara4: '',
      lisatieto4: '',

      nimi5: '',
      maara5: '',
      kerays5: '',
      keratty5: '',
      kerattymaara5: '',
      lisatieto5: '',

      isOpen: false,
      isOpen2: false,

      location: '',
      date: sessionStorage.getItem('userDate'),
      startDate: new Date(),
      startDate2: new Date(),
      f: '',

      openWarning: false,
      valmisWarning: false,
    }
  }

  btnHandleChange = (event) => {
    if (event.target.value === 'Odottaa keräystä' || (event.target.placeholder === 'Odottaa keräystä' && event.target.value === '')) {
      this.setState({
        [event.target.name.split(' ERASE ')[0]]: 'Keräyksessä',
      });
      this.patchData(event)

    } else if (event.target.value === 'Keräyksessä' || (event.target.placeholder === 'Keräyksessä' && event.target.value === '')) {
      this.setState({
        [event.target.name.split(' ERASE ')[0]]: 'Kerätty',
      });
      this.patchData(event)

    } else if (event.target.value === 'Kerätty' || (event.target.placeholder === 'Kerätty' && event.target.value === '')) {
      this.setState({
        [event.target.name.split(' ERASE ')[0]]: 'Ei ole',
      });
      this.patchData(event)
    } else if (event.target.value === 'Ei ole' || (event.target.placeholder === 'Ei ole' && event.target.value === '')) {
      this.setState({
        [event.target.name.split(' ERASE ')[0]]: 'Odottaa keräystä',
      });
      this.patchData(event)
    }
  }

  muokkaa(_id, kauppa, kukka, alisatieto, toimituspvm) {
    this.setState({
      isOpen2: true,
      kauppa: kauppa,
      customerInfo: alisatieto,
      f: toimituspvm,

      nimi1: kukka.kukka1.name,
      maara1: kukka.kukka1.toimi,
      kerays1: kukka.kukka1.kerays,
      lisatieto1: kukka.kukka1.lisatieto,

      nimi2: kukka.kukka2.name,
      maara2: kukka.kukka2.toimi,
      kerays2: kukka.kukka2.kerays,
      lisatieto2: kukka.kukka2.lisatieto,

      nimi3: kukka.kukka3.name,
      maara3: kukka.kukka3.toimi,
      kerays3: kukka.kukka3.kerays,
      lisatieto3: kukka.kukka3.lisatieto,

      nimi4: kukka.kukka4.name,
      maara4: kukka.kukka4.toimi,
      kerays4: kukka.kukka4.kerays,
      lisatieto4: kukka.kukka4.lisatieto,

      nimi5: kukka.kukka5.name,
      maara5: kukka.kukka5.toimi,
      kerays5: kukka.kukka5.kerays,
      lisatieto5: kukka.kukka5.lisatieto,
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

  patchData(event) {
    if (event.target.value === 'Odottaa keräystä' || (event.target.placeholder === 'Odottaa keräystä' && event.target.value === '')) {
      fetch('http://localhost:3002/products/' + event.target.name.split(' ERASE ')[1], {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
        body: JSON.stringify([
          {
            propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".keratty",
            value: "Keräyksessä",
          },
          {
            propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".kerattymaara",
            value: event.target.name.split(' ERASE ')[2]
          }
        ])
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (event.target.value === "Keräyksessä" || (event.target.placeholder === 'Keräyksessä' && event.target.value === '')) {
      fetch('http://localhost:3002/products/' + event.target.name.split(' ERASE ')[1], {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
        body: JSON.stringify([
          {
            propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".keratty",
            value: "Kerätty"
          },
          {
            propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".kerattymaara",
            value: event.target.name.split(' ERASE ')[2]
          }
        ])
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (event.target.value === "Kerätty" || (event.target.placeholder === 'Kerätty' && event.target.value === '')) {
      fetch('http://localhost:3002/products/' + event.target.name.split(' ERASE ')[1], {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
        body: JSON.stringify([
          {
            propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".keratty",
            value: "Ei ole",
          },
          {
            propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".kerattymaara",
            value: event.target.name.split(' ERASE ')[2]
          }
        ])
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (event.target.value === "Ei ole" || (event.target.placeholder === 'Ei ole' && event.target.value === '')) {
      fetch('http://localhost:3002/products/' + event.target.name.split(' ERASE ')[1], {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
        body: JSON.stringify([
          {
            propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".keratty",
            value: "Odottaa keräystä",
          },
          {
            propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".kerattymaara",
            value: event.target.name.split(' ERASE ')[2]
          }
        ])
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
    }

  }

  putData(_id) {
    fetch('http://localhost:3002/products/' + _id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        kauppa: this.state.kauppa,
        date: sessionStorage.getItem('userDate'),
        toimituspvm: this.state.f,
        alisatieto: this.state.customerInfo,
        kukka: {
          kukka1: {
            name: this.state.nimi1,
            toimi: this.state.maara1,
            kerays: this.state.kerays1,
            lisatieto: this.state.lisatieto1,
          },
          kukka2: {
            name: this.state.nimi2,
            toimi: this.state.maara2,
            kerays: this.state.kerays2,
            lisatieto: this.state.lisatieto2,
          },
          kukka3: {
            name: this.state.nimi3,
            toimi: this.state.maara3,
            kerays: this.state.kerays3,
            lisatieto: this.state.lisatieto3,
          },
          kukka4: {
            name: this.state.nimi4,
            toimi: this.state.maara4,
            kerays: this.state.kerays4,
            lisatieto: this.state.lisatieto4,
          },
          kukka5: {
            name: this.state.nimi5,
            toimi: this.state.maara5,
            kerays: this.state.kerays5,
            lisatieto: this.state.lisatieto5,
          },
        }
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
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  pvmMuutos = (date, event) => {
    this.setState({
      startDate: date
    });
  }

  toimituspvmMuutos = (date, event) => {
    this.setState({
      startDate2: date,
      f: format(date, 'dd/MM/yyyy')
    });
  }

  componentDidMount() {
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
    let { _id, kukka, kauppa, date, alisatieto, toimituspvm } = this.props.person;

    return (
      <div className="myDiv">
        <div className="NavBlock"></div>
        {date === this.state.date ?
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

                {/*1 taulukko*/}
                <Tbody>
                  {kukka.kukka1.toimi !== 0 ? kukka.kukka1.kerays !== this.state.location ?
                    <Tr>
                      <Td className="reTest">{kukka.kukka1.name}</Td>
                      <Td>{kukka.kukka1.toimi}</Td>
                      <Td>{kukka.kukka1.kerays}</Td>
                      <Td>{kukka.kukka1.lisatieto}</Td>
                      <Td>
                        <Input className="label"
                          name={"keratty1 ERASE " + _id + " ERASE " + this.state.kerattymaara1}
                          value={this.state.keratty1}
                          placeholder={kukka.kukka1.keratty}
                          onDoubleClick={this.btnHandleChange}>
                        </Input>
                      </Td>
                      <Td>
                        <Input className="label"
                          type="number"
                          placeholder={kukka.kukka1.kerattymaara}
                          name="kerattymaara1"
                          onChange={this.handleChange}>
                        </Input>
                      </Td>
                    </Tr>
                    : undefined : undefined}

                  {/*2 taulukko*/}

                  {kukka.kukka2.toimi !== 0 ? kukka.kukka2.kerays !== this.state.location ?
                    <Tr>
                      <Td >{kukka.kukka2.name}</Td>
                      <Td>{kukka.kukka2.toimi}</Td>
                      <Td>{kukka.kukka2.kerays}</Td>
                      <Td>{kukka.kukka2.lisatieto}</Td>
                      <Td>
                        <Input className="label"
                          name={"keratty2 ERASE " + _id + " ERASE " + this.state.kerattymaara2}
                          value={this.state.keratty2}
                          placeholder={kukka.kukka2.keratty}
                          onDoubleClick={this.btnHandleChange}>
                        </Input>
                      </Td>
                      <Td>
                        <Input className="label"
                          type="number"
                          placeholder={kukka.kukka2.kerattymaara}
                          name="kerattymaara2"
                          onChange={this.handleChange}>
                        </Input>
                      </Td>
                    </Tr>
                    : undefined : undefined}




                  {/*3 taulukko*/}

                  {kukka.kukka3.toimi !== 0 ? kukka.kukka3.kerays !== this.state.location ?
                    <Tr>
                      <Td>{kukka.kukka3.name}</Td>
                      <Td>{kukka.kukka3.toimi}</Td>
                      <Td>{kukka.kukka3.kerays}</Td>
                      <Td>{kukka.kukka3.lisatieto}</Td>
                      <Td>
                        <Input className="label"
                          name={"keratty3 ERASE " + _id + " ERASE " + this.state.kerattymaara3}
                          value={this.state.keratty3}
                          placeholder={kukka.kukka3.keratty}
                          onDoubleClick={this.btnHandleChange}>
                        </Input>
                      </Td>
                      <Td>
                        <Input className="label"
                          type="number"
                          placeholder={kukka.kukka3.kerattymaara}
                          name="kerattymaara3"
                          onChange={this.handleChange}>
                        </Input>
                      </Td>
                    </Tr>
                    : undefined : undefined}

                  {/*4 taulukko*/}

                  {kukka.kukka4.toimi !== 0 ? kukka.kukka4.kerays !== this.state.location ?
                    <Tr>
                      <Td >{kukka.kukka4.name}</Td>
                      <Td>{kukka.kukka4.toimi}</Td>
                      <Td>{kukka.kukka4.kerays}</Td>
                      <Td>{kukka.kukka4.lisatieto}</Td>
                      <Td>
                        <Input className="label"
                          name={"keratty4 ERASE " + _id + " ERASE " + this.state.kerattymaara4}
                          value={this.state.keratty4}
                          placeholder={kukka.kukka4.keratty}
                          onDoubleClick={this.btnHandleChange}>
                        </Input>
                      </Td>
                      <Td>
                        <Input className="label"
                          type="number"
                          placeholder={kukka.kukka4.kerattymaara}
                          name="kerattymaara4"
                          onChange={this.handleChange}>
                        </Input>
                      </Td>
                    </Tr>
                    : undefined : undefined}

                  {/*5 taulukko*/}

                  {kukka.kukka5.toimi !== 0 ? kukka.kukka5.kerays !== this.state.location ?
                    <Tr>
                      <Td >{kukka.kukka5.name}</Td>
                      <Td>{kukka.kukka5.toimi}</Td>
                      <Td>{kukka.kukka5.kerays}</Td>
                      <Td>{kukka.kukka5.lisatieto}</Td>
                      <Td>
                        <Input className="label"
                          name={"keratty5 ERASE " + _id + " ERASE " + this.state.kerattymaara5}
                          value={this.state.keratty5}
                          placeholder={kukka.kukka5.keratty}
                          onDoubleClick={this.btnHandleChange}>
                        </Input>
                      </Td>
                      <Td>
                        <Input className="label"
                          type="number"
                          placeholder={kukka.kukka5.kerattymaara}
                          name="kerattymaara5"
                          onChange={this.handleChange}>
                        </Input>
                      </Td>
                    </Tr>
                    : undefined : undefined}
                </Tbody>
              </Table>
              <Button color="success" onClick={() => this.valmis()}>Valmis</Button>
              <Button color="primary" onClick={() => this.muokkaa(_id, kauppa, kukka, alisatieto, toimituspvm)}>Muokkaa</Button>
              <Button className="buttonC" color="danger" onClick={() => this.warning()}>Poista</Button>
            </Card>

            {/*Warning dialog table when DELETING*/}
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

            {/*Warning when pushing data to be ready*/}
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
                    onCalendarClose={() => sessionStorage.setItem('userDate', format(this.state.startDate, "dd/MM/yyyy"))}
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

                  {/*1 taulukkomuokkaus*/}

                  <Tbody>
                    <Tr>
                      <Td >
                        <Input type="text"
                          name="nimi1"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka1.name}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="number"
                          name="maara1"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka1.toimi}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="kerays1"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka1.kerays}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="lisatieto1"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka1.lisatieto}>
                        </Input>
                      </Td>
                    </Tr>
                  </Tbody>

                  {/*2 taulukkomuokkaus*/}

                  <Tbody>
                    <Tr>
                      <Td >
                        <Input type="text"
                          name="nimi2"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka2.name}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="number"
                          name="maara2"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka2.toimi}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="kerays2"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka2.kerays}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="lisatieto2"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka2.lisatieto}>
                        </Input>
                      </Td>
                    </Tr>
                  </Tbody>

                  {/*3 taulukkomuokkaus*/}

                  <Tbody>
                    <Tr>
                      <Td >
                        <Input type="text"
                          name="nimi3"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka3.name}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="number"
                          name="maara3"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka3.toimi}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="kerays3"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka3.kerays}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="lisatieto3"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka3.lisatieto}>
                        </Input>
                      </Td>
                    </Tr>
                  </Tbody>

                  {/*4 taulukkomuokkaus*/}

                  <Tbody>
                    <Tr>
                      <Td >
                        <Input type="text"
                          name="nimi4"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka4.name}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="number"
                          name="maara4"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka4.toimi}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="kerays4"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka4.kerays}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="lisatieto4"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka4.lisatieto}>
                        </Input>
                      </Td>
                    </Tr>
                  </Tbody>

                  {/*5 taulukkomuokkaus*/}

                  <Tbody>
                    <Tr>
                      <Td >
                        <Input type="text"
                          name="nimi5"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka5.name}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="number"
                          name="maara5"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka5.toimi}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="kerays5"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka5.kerays}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="lisatieto5"
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={kukka.kukka5.lisatieto}>
                        </Input>
                      </Td>
                    </Tr>
                  </Tbody>

                </Table>

                <Button onClick={() => this.putData(_id, toimituspvm) + window.location.reload()}>Päivitä</Button>
              </Card>
            </Dialog>

          </div>
          : undefined}
      </div>

    )
  }
}

export default CheckedCard;
