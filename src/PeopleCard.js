import React, { Component } from 'react';
import { Card, CardText, CardBlock, CardTitle, Button, Input } from 'reactstrap';
import Dialog from './components/editDialog';
import DatePicker from "react-datepicker";
import "./Styles/flowers.css";
import moment from 'moment';
import 'moment/locale/fi';

import "react-datepicker/dist/react-datepicker.css";



class PeopleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kauppa: '',

      nimi1: '',
      maara1: '',
      kerays1: '',

      nimi2: '',
      maara2: '',
      kerays2: '',

      nimi3: '',
      maara3: '',
      kerays3: '',

      nimi4: '',
      maara4: '',
      kerays4: '',

      nimi5: '',
      maara5: '',
      kerays5: '',

      isOpen: false,
      isOpen2: false,

      location: '',
      date: sessionStorage.getItem('userDate')
    }
  }

  muokkaa(_id, kauppa, kukka) {
    this.setState({
      isOpen2: true,
      kauppa: kauppa,

      nimi1: kukka.kukka1.name,
      maara1: kukka.kukka1.toimi,
      kerays1: kukka.kukka1.kerays,

      nimi2: kukka.kukka2.name,
      maara2: kukka.kukka2.toimi,
      kerays2: kukka.kukka2.kerays,

      nimi3: kukka.kukka3.name,
      maara3: kukka.kukka3.toimi,
      kerays3: kukka.kukka3.kerays,

      nimi4: kukka.kukka4.name,
      maara4: kukka.kukka4.toimi,
      kerays4: kukka.kukka4.kerays,

      nimi5: kukka.kukka5.name,
      maara5: kukka.kukka5.toimi,
      kerays5: kukka.kukka5.kerays,
    })
  }

  patchData(_id) {
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
            kerays: this.state.kerays1
          },
          kukka2: {
            name: this.state.nimi2,
            toimi: this.state.maara2,
            kerays: this.state.kerays2
          },
          kukka3: {
            name: this.state.nimi3,
            toimi: this.state.maara3,
            kerays: this.state.kerays3
          },
          kukka4: {
            name: this.state.nimi4,
            toimi: this.state.maara4,
            kerays: this.state.kerays4
          },
          kukka5: {
            name: this.state.nimi5,
            toimi: this.state.maara5,
            kerays: this.state.kerays5
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
              </CardText>
              : undefined : undefined}

            <Button className="buttonC" color="danger" onClick={() => this.props.removePerson(_id)}>Poista</Button>
            <Button color="primary" onClick={() => this.muokkaa(_id, kauppa, kukka)}>Muokkaa</Button>

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

                  <Button onClick={() => this.patchData(_id)}>Päivitä</Button>
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

export default PeopleCard;
