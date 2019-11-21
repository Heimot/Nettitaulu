import React, { Component } from 'react';
import { Card, CardText, CardBlock, CardTitle, CardSubtitle, Button, Input } from 'reactstrap';
import Dialog from './components/editDialog';
import "./Styles/flowers.css";



class PeopleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kukka1name: 'default',
      kukka1toimi: 0,
      username: "",
      password: "",
      isOpen: false,
      isOpen2: true
    }
    this.login = this.login.bind(this);
  }

  login() {
    console.log(this.username + this.password);
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

            <Button className="buttonC" color="warning" onClick={() => this.props.removePerson(_id)}>Poista</Button> <Button color="primary" onClick={(e) => this.setState({ isOpen: true })}>Muokkaa</Button>

            <Dialog isOpen={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })} onUpdate={(e) => alert(JSON.stringify({ kukat: { orvokki: { orvokkinimi: this.state.kukka1name, orvtilattu: this.state.kukka1toimi, orvtoimitetaan: 1002, orvlisatieto: "kg", orvjaljella: 1020, orvkerays: "Ryögnä" }, pelargonia: { orvokkinimi: "PgEl", orvtilattu: 120, orvtoimitetaan: 120, orvlisatieto: "kf", orvjaljella: 10, orvkerays: "Tuusjgärvi" } }, name: "Prisma Kguopio" }))}>
              <Card>
                <CardBlock>
                  <CardTitle>{kauppa}</CardTitle>
                  <CardText>{_id}</CardText>
                  <CardText> <CardText className="label">Tuote</CardText><CardText className="label">Kerätään</CardText><CardText className="label">Keräyspiste</CardText></CardText>
                  {kukka.kukka1.toimi !== 0 ? <CardText><Input type="text" name="kukka1name" onChange={this.handleChange} className="inputlabel" placeholder={kukka.kukka1.name}></Input><Input type="number" name="kukka1toimi" value={this.state.kukanmaara} onChange={this.handleChange} className="inputlabel" placeholder={kukka.kukka1.toimi}></Input><Input className="inputlabel" placeholder={kukka.kukka1.kerays}></Input></CardText> : undefined}
                  <Button onClick={() => this.props.updatePerson(_id)}>Päivitä</Button>
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
