import React, { Component } from 'react';
import {
  Card, CardText, CardBlock,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import './flowers.css';



class PeopleCard extends Component {
  render() {
    let { _id, name, kukat, pelargonia } = this.props.person;
    return (
      <div className="myDiv">
        <Card>
          <CardBlock>
            <CardTitle>{name}</CardTitle>
            <CardText>{_id}</CardText>
            <CardText> <CardText className="label">Tuote</CardText><CardText className="label">tilattu määrä yht.</CardText><CardText className="label">toimitetaan</CardText><CardText className="label">lisätieto</CardText><CardText className="label">jäljellä</CardText><CardText className="label">keräyspiste</CardText></CardText>
            <CardText><CardText className="label">{kukat.orvokki.orvokkinimi}</CardText><CardText className="label">{kukat.orvokki.orvtilattu}</CardText><CardText className="label">{kukat.orvokki.orvtoimitetaan}</CardText><CardText className="label">{kukat.orvokki.orvlisatieto}</CardText><CardText className="label">{kukat.orvokki.orvjaljella}</CardText><CardText className="label">{kukat.orvokki.orvkerays}</CardText></CardText>
            <CardText><CardText className="label">{kukat.pelargonia.orvokkinimi}</CardText><CardText className="label">{kukat.pelargonia.orvtilattu}</CardText><CardText className="label">{kukat.pelargonia.orvtoimitetaan}</CardText><CardText className="label">{kukat.pelargonia.orvlisatieto}</CardText><CardText className="label">{kukat.pelargonia.orvjaljella}</CardText><CardText className="label">{kukat.pelargonia.orvkerays}</CardText></CardText>
            <Button color="success" onClick={() => this.props.removePerson(_id)}>View table</Button>
          </CardBlock>
        </Card>
      </div>
    )
  }
}

export default PeopleCard;
