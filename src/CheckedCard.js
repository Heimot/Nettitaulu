import React, { Component } from 'react';
import { Card, CardText, CardBlock, CardTitle, Button, Input } from 'reactstrap';
import Dialog from './components/editDialog';
import "./Styles/Table.css";

import "react-datepicker/dist/react-datepicker.css";



class CheckedCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kauppa: '',

      nimi1: '',
      maara1: '',
      kerays1: '',
      keratty1: '',
      kerattymaara1: '',

      nimi2: '',
      maara2: '',
      kerays2: '',
      keratty2: '',
      kerattymaara2: '',

      nimi3: '',
      maara3: '',
      kerays3: '',
      keratty3: '',
      kerattymaara3: '',

      nimi4: '',
      maara4: '',
      kerays4: '',
      keratty4: '',
      kerattymaara4: '',

      nimi5: '',
      maara5: '',
      kerays5: '',
      keratty5: '',
      kerattymaara5: '',

      isOpen: false,
      isOpen2: false,

      location: '',
      date: sessionStorage.getItem('userDate')
    }
  }

  btnHandleChange = (event) => {
    if (event.target.value === 'Ei' || (event.target.placeholder === 'Ei' && event.target.value === '')) {
      this.setState({
        [event.target.name.split(' ERASE ')[0]]: 'Keräämässä',
      });
      console.log(this.state)
      this.patchData(event)
      
    } else if (event.target.value === 'Keräämässä' || (event.target.placeholder === 'Keräämässä'  && event.target.value === '')) {
      this.setState({
        [event.target.name.split(' ERASE ')[0]]: 'Kerätty',
      });
      console.log(this.state)
      this.patchData(event)

    } else if (event.target.value === 'Kerätty' || (event.target.placeholder === 'Kerätty'  && event.target.value === '')) {
      this.setState({
        [event.target.name.split(' ERASE ')[0]]: 'Ei',
      });
      console.log(this.state)
      this.patchData(event)
    }
  }

  muokkaa(_id, kauppa, kukka) {
    this.setState({
      isOpen2: true,
      kauppa: kauppa,

      nimi1: kukka.kukka1.name,
      maara1: kukka.kukka1.toimi,
      kerays1: kukka.kukka1.kerays,
      keratty1: kukka.kukka1.keratty,
      kerattymaara1: kukka.kukka1.kerattymaara,

      nimi2: kukka.kukka2.name,
      maara2: kukka.kukka2.toimi,
      kerays2: kukka.kukka2.kerays,
      keratty2: kukka.kukka2.keratty,
      kerattymaara2: kukka.kukka2.kerattymaara,

      nimi3: kukka.kukka3.name,
      maara3: kukka.kukka3.toimi,
      kerays3: kukka.kukka3.kerays,
      keratty3: kukka.kukka3.keratty,
      kerattymaara3: kukka.kukka3.kerattymaara,

      nimi4: kukka.kukka4.name,
      maara4: kukka.kukka4.toimi,
      kerays4: kukka.kukka4.kerays,
      keratty4: kukka.kukka4.keratty,
      kerattymaara4: kukka.kukka4.kerattymaara,

      nimi5: kukka.kukka5.name,
      maara5: kukka.kukka5.toimi,
      kerays5: kukka.kukka5.kerays,
      keratty5: kukka.kukka5.keratty,
      kerattymaara5: kukka.kukka5.kerattymaara,
    })
  }

  patchData(event) {
    if(event.target.value === 'Ei' || (event.target.placeholder === 'Ei' && event.target.value === '')) {
      fetch('http://localhost:3002/products/' + event.target.name.split(' ERASE ')[1], {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify([
        {
        propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".keratty", 
        value: "Keräämässä",
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

    if(event.target.value === "Keräämässä" || (event.target.placeholder === 'Keräämässä' && event.target.value === '')) {
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

    if(event.target.value === "Kerätty" || (event.target.placeholder === 'Kerätty' && event.target.value === '')) {
      fetch('http://localhost:3002/products/' + event.target.name.split(' ERASE ')[1], {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify([
        {
        propName: "kukka.kukka" + event.target.name.split('keratty').pop()[0] + ".keratty", 
        value: "Ei",
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
        kukka: {
          kukka1: {
            name: this.state.nimi1,
            toimi: this.state.maara1,
            kerays: this.state.kerays1,
            keratty: this.state.keratty1,
            kerattymaara: this.state.kerattymaara1,
          },
          kukka2: {
            name: this.state.nimi2,
            toimi: this.state.maara2,
            kerays: this.state.kerays2,
            keratty: this.state.keratty2,
            kerattymaara: this.state.kerattymaara2,
          },
          kukka3: {
            name: this.state.nimi3,
            toimi: this.state.maara3,
            kerays: this.state.kerays3,
            kerattymaara: this.state.kerattymaara3,
          },
          kukka4: {
            name: this.state.nimi4,
            toimi: this.state.maara4,
            kerays: this.state.kerays4,
            kerattymaara: this.state.kerattymaara4,
          },
          kukka5: {
            name: this.state.nimi5,
            toimi: this.state.maara5,
            kerays: this.state.kerays5,
            kerattymaara: this.state.kerattymaara5,
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
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  componentDidMount() {
    this.setState({
      location: localStorage.getItem("userLocation")
    });
  }

  render() {
    let { _id, kukka, kauppa, date } = this.props.person;
    return (
      <div className="myDiv">
        <Card>
          {date === this.state.date ?
            <CardBlock>
              <CardTitle>{date}</CardTitle>
              <CardTitle>{kauppa}</CardTitle>
              <CardText>{_id}</CardText>
              <CardText>
                <CardText className="label">
                  Tuote
              </CardText>
                <CardText className="label">
                  Kerätään
                </CardText>
                <CardText className="label">
                  Keräyspiste
                  </CardText>
                <CardText className="label">
                  Keräämässä
                </CardText>
                <CardText className="label">
                  Kerättymäärä
                  </CardText>
              </CardText>

              {kukka.kukka1.toimi !== 0 ? kukka.kukka1.kerays !== this.state.location ?
                <CardText>

                  <CardText className="label">
                    {kukka.kukka1.name}
                  </CardText>

                  <CardText className="label"
                  >{kukka.kukka1.toimi}
                  </CardText>

                  <CardText className="label">
                    {kukka.kukka1.kerays}
                  </CardText>

                  <Input className="label"
                    name={"keratty1 ERASE " + _id + " ERASE " + this.state.kerattymaara1}
                    value={this.state.keratty1}
                    placeholder={kukka.kukka1.keratty}
                    onDoubleClick={this.btnHandleChange}>
                  </Input>

                  <Input className="label"
                    type="number"
                    placeholder={kukka.kukka1.kerattymaara}
                    name="kerattymaara1"
                    onChange={this.handleChange}>
                  </Input>

                </CardText>
                : undefined : undefined}

              {kukka.kukka2.toimi !== 0 ? kukka.kukka2.kerays !== this.state.location ?
                <CardText>

                  <CardText className="label">
                    {kukka.kukka2.name}
                  </CardText>

                  <CardText className="label"
                  >{kukka.kukka2.toimi}
                  </CardText>

                  <CardText className="label">
                    {kukka.kukka2.kerays}
                  </CardText>

                  <Input className="label"
                    name={"keratty2 ERASE " + _id + " ERASE " + this.state.kerattymaara2}
                    value={this.state.keratty2}
                    placeholder={kukka.kukka2.keratty}
                    onDoubleClick={this.btnHandleChange}>
                  </Input>

                  <Input className="label"
                    type="number"
                    placeholder={kukka.kukka2.kerattymaara}
                    name="kerattymaara2"
                    onChange={this.handleChange}>
                  </Input>
                  
                </CardText>
                : undefined : undefined}

              {kukka.kukka3.toimi !== 0 ? kukka.kukka3.kerays !== this.state.location ?
                <CardText>

                  <CardText className="label">
                    {kukka.kukka3.name}
                  </CardText>

                  <CardText className="label"
                  >{kukka.kukka3.toimi}
                  </CardText>

                  <CardText className="label">
                    {kukka.kukka3.kerays}
                  </CardText>

                  <Input className="label"
                    name={"keratty3 ERASE " + _id + " ERASE " + this.state.kerattymaara3}
                    value={this.state.keratty3}
                    placeholder={kukka.kukka3.keratty}
                    onDoubleClick={this.btnHandleChange}>
                  </Input>

                  <Input className="label"
                    type="number"
                    placeholder={kukka.kukka3.kerattymaara}
                    name="kerattymaara3"
                    onChange={this.handleChange}>
                  </Input>

                </CardText>
                : undefined : undefined}

              {kukka.kukka4.toimi !== 0 ? kukka.kukka4.kerays !== this.state.location ?
                <CardText>

                  <CardText className="label">
                    {kukka.kukka4.name}
                  </CardText>

                  <CardText className="label"
                  >{kukka.kukka4.toimi}
                  </CardText>

                  <CardText className="label">
                    {kukka.kukka4.kerays}
                  </CardText>

                  <Input className="label"
                    name={"keratty4 ERASE " + _id + " ERASE " + this.state.kerattymaara4}
                    value={this.state.keratty4}
                    placeholder={kukka.kukka4.keratty}
                    onDoubleClick={this.btnHandleChange}>
                  </Input>

                  <Input className="label"
                    type="number"
                    placeholder={kukka.kukka4.kerattymaara}
                    name="kerattymaara4"
                    onChange={this.handleChange}>
                  </Input>

                </CardText>
                : undefined : undefined}

              {kukka.kukka5.toimi !== 0 ? kukka.kukka5.kerays !== this.state.location ?
                <CardText>
                  <CardText className="label">
                    {kukka.kukka5.name}
                  </CardText>
                  <CardText className="label"
                  >{kukka.kukka5.toimi}
                  </CardText>
                  <CardText className="label">
                    {kukka.kukka5.kerays}
                  </CardText>

                  <Input className="label"
                    name={"keratty5 ERASE " + _id + " ERASE " + this.state.kerattymaara5}
                    value={this.state.keratty5}
                    placeholder={kukka.kukka5.keratty}
                    onDoubleClick={this.btnHandleChange}>
                  </Input>

                  <Input className="label"
                    type="number"
                    placeholder={kukka.kukka5.kerattymaara}
                    name="kerattymaara5"
                    onChange={this.handleChange}>
                  </Input>

                </CardText>
                : undefined : undefined}

              <Button className="buttonC" color="danger" onClick={() => this.props.removePerson(_id)}>Poista</Button>
              <Button color="primary" onClick={() => this.muokkaa(_id, kauppa, kukka)}>Muokkaa</Button>
              <Button onClick={() => this.patchData(_id)}>nimi1</Button>

              <Dialog isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
                <Card>
                  <CardBlock>

                    <CardTitle><Input type="text"
                      name="kauppa"
                      onChange={this.handleChange}
                      className="inputlabel"
                      placeholder={kauppa}></Input></CardTitle>

                    <CardText>{_id}</CardText>

                    <CardText>

                      <CardText className="label">
                        Tuote
                      </CardText>

                      <CardText className="label">
                        Kerätään
                        </CardText>

                      <CardText className="label">
                        Keräyspiste
                          </CardText>

                    </CardText>

                    <CardText>

                      <Input type="text"
                        name="nimi1"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka1.name}>
                      </Input>

                      <Input type="number"
                        name="maara1"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka1.toimi}>
                      </Input>

                      <Input type="text"
                        name="kerays1"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka1.kerays}>
                      </Input>

                    </CardText>

                    <CardText>

                      <Input type="text"
                        name="nimi2"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka2.name}>
                      </Input>

                      <Input type="number"
                        name="maara2"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka2.toimi}>
                      </Input>

                      <Input type="text"
                        name="kerays2"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka2.kerays}>
                      </Input>

                    </CardText>

                    <CardText>

                      <Input type="text"
                        name="nimi3"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka3.name}>
                      </Input>

                      <Input type="number"
                        name="maara3"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka3.toimi}>
                      </Input>

                      <Input type="text"
                        name="kerays3"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka3.kerays}>
                      </Input>

                    </CardText>

                    <CardText>

                      <Input type="text"
                        name="nimi4"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka4.name}>
                      </Input>

                      <Input type="number"
                        name="maara4"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka4.toimi}>
                      </Input>

                      <Input type="text"
                        name="kerays4"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka4.kerays}>
                      </Input>

                    </CardText>

                    <CardText>

                      <Input type="text"
                        name="nimi5"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka5.name}>
                      </Input>

                      <Input type="number"
                        name="maara5"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka5.toimi}>
                      </Input>

                      <Input type="text"
                        name="kerays5"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka5.kerays}>
                      </Input>

                    </CardText>

                    <Button onClick={() => this.putData(_id)}>Päivitä</Button>
                  </CardBlock>
                </Card>
              </Dialog>

            </CardBlock>
            : undefined}
        </Card>
      </div>
    )
  }
}

export default CheckedCard;
