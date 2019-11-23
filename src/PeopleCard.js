import React, { Component } from 'react';
import { Card, CardText, CardBlock, CardTitle, CardSubtitle, Button, Input } from 'reactstrap';
import Dialog from './components/editDialog';
import "./Styles/flowers.css";



class PeopleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      isOpen2: true
    }
  }

  patchData(_id) {
    fetch('http://localhost:3002/products' + _id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        
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
  render() {
    let { _id, kukka, kauppa } = this.props.person;
    return (
      <div className="myDiv">
        <Card>
          <CardBlock>
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

            {kukka.kukka1.toimi !== 0 ?
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
              : undefined}

            {kukka.kukka2.toimi !== 0 ?
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
              : undefined}

            {kukka.kukka3.toimi !== 0 ?
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
              : undefined}

            {kukka.kukka4.toimi !== 0 ?
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
              : undefined}

            {kukka.kukka5.toimi !== 0 ?
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
              : undefined}

            <Button className="buttonC" color="warning" onClick={() => this.props.removePerson(_id)}>Poista</Button> <Button color="primary" onClick={(e) => this.setState({ isOpen: true })}>Muokkaa</Button>

            <Dialog isOpen={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })}>
              <Card>
                <CardBlock>

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

                  {kukka.kukka1.toimi !== 0 ?
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

                      <Input className="inputlabel"
                        name="kerays1"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka1.kerays}>
                      </Input>

                    </CardText>

                    : undefined}

                  {kukka.kukka2.toimi !== 0 ?
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

                      <Input className="inputlabel"
                        name="kerays2"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka2.kerays}>
                      </Input>

                    </CardText>

                    : undefined}

                  {kukka.kukka3.toimi !== 0 ?
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

                      <Input className="inputlabel"
                        name="kerays3"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka3.kerays}>
                      </Input>

                    </CardText>

                    : undefined}

                  {kukka.kukka4.toimi !== 0 ?
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

                      <Input className="inputlabel"
                        name="kerays4"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka4.kerays}>
                      </Input>

                    </CardText>

                    : undefined}

                  {kukka.kukka5.toimi !== 0 ?
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

                      <Input className="inputlabel"
                        name="kerays5"
                        onChange={this.handleChange}
                        className="inputlabel"
                        placeholder={kukka.kukka5.kerays}>
                      </Input>

                    </CardText>

                    : undefined}

                  <Button onClick={() => this.patchData(_id)}>Päivitä</Button>
                </CardBlock>
              </Card>
            </Dialog>

          </CardBlock>
        </Card>
      </div>
    )
  }
}

export default PeopleCard;
