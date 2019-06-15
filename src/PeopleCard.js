import React, { Component } from 'react';
import { Card, CardText, CardBlock, CardTitle, CardSubtitle, Button, Input } from 'reactstrap';
import Dialog from './components/editDialog';
import './flowers.css';



class PeopleCard extends Component {

  state = {
    isOpen: false
  };

  render() {
    let { _id, name, kukat } = this.props.person;
    return (
      <div className="myDiv">

        <Card>
          <CardBlock>
            <CardTitle>{name}</CardTitle>
            <CardText>{_id}</CardText>
            <CardText> <CardText className="label">Tuote</CardText><CardText className="label">tilattu määrä yht.</CardText><CardText className="label">toimitetaan</CardText><CardText className="label">lisätieto</CardText><CardText className="label">jäljellä</CardText><CardText className="label">keräyspiste</CardText></CardText>
            {kukat.orvokki.orvtilattu !== 0 ? <CardText><CardText className="label">{kukat.orvokki.orvokkinimi}</CardText><CardText className="label">{kukat.orvokki.orvtilattu}</CardText><CardText className="label">{kukat.orvokki.orvtoimitetaan}</CardText><CardText className="label">{kukat.orvokki.orvlisatieto}</CardText><CardText className="label">{kukat.orvokki.orvjaljella}</CardText><CardText className="label">{kukat.orvokki.orvkerays}</CardText></CardText> : undefined}
            {kukat.pelargonia.orvtilattu !== 0 ? <CardText><CardText className="label">{kukat.pelargonia.orvokkinimi}</CardText><CardText className="label">{kukat.pelargonia.orvtilattu}</CardText><CardText className="label">{kukat.pelargonia.orvtoimitetaan}</CardText><CardText className="label">{kukat.pelargonia.orvlisatieto}</CardText><CardText className="label">{kukat.pelargonia.orvjaljella}</CardText><CardText className="label">{kukat.pelargonia.orvkerays}</CardText></CardText> : undefined}
            <Button className="buttonC" color="warning" onClick={() => this.props.removePerson(_id)}>Poista</Button> <Button color="primary" onClick={(e) => this.setState({ isOpen: true })}>Muokkaa</Button>

            <Dialog isOpen={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })}>
              <Card>
                <CardBlock>
                  <CardTitle>{name}</CardTitle>
                  <CardText>{_id}</CardText>
                  <CardText> <CardText className="label">Tuote</CardText><CardText className="label">tilattu määrä yht.</CardText><CardText className="label">toimitetaan</CardText><CardText className="label">lisätieto</CardText><CardText className="label">jäljellä</CardText><CardText className="label">keräyspiste</CardText></CardText>
                  {kukat.orvokki.orvtilattu !== 0 ? <CardText><Input className="inputlabel" placeholder={kukat.orvokki.orvokkinimi}></Input><Input className="inputlabel" placeholder={kukat.orvokki.orvtilattu}></Input><Input className="inputlabel" placeholder={kukat.orvokki.orvtoimitetaan}></Input><Input className="inputlabel" placeholder={kukat.orvokki.orvlisatieto}></Input><Input className="inputlabel" placeholder={kukat.orvokki.orvjaljella}></Input><Input className="inputlabel" placeholder={kukat.orvokki.orvkerays}></Input></CardText> : undefined}
                  {kukat.pelargonia.orvtilattu !== 0 ? <CardText><Input className="inputlabel" placeholder={kukat.pelargonia.orvokkinimi}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtilattu}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtoimitetaan}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvlisatieto}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvjaljella}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvkerays}></Input></CardText> : undefined}
                  {kukat.pelargonia.orvtilattu !== 0 ? <CardText><Input className="inputlabel" placeholder={kukat.pelargonia.orvokkinimi}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtilattu}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtoimitetaan}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvlisatieto}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvjaljella}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvkerays}></Input></CardText> : undefined}
                  {kukat.pelargonia.orvtilattu !== 0 ? <CardText><Input className="inputlabel" placeholder={kukat.pelargonia.orvokkinimi}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtilattu}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtoimitetaan}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvlisatieto}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvjaljella}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvkerays}></Input></CardText> : undefined}
                  {kukat.pelargonia.orvtilattu !== 0 ? <CardText><Input className="inputlabel" placeholder={kukat.pelargonia.orvokkinimi}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtilattu}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtoimitetaan}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvlisatieto}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvjaljella}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvkerays}></Input></CardText> : undefined}
                  {kukat.pelargonia.orvtilattu !== 0 ? <CardText><Input className="inputlabel" placeholder={kukat.pelargonia.orvokkinimi}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtilattu}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtoimitetaan}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvlisatieto}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvjaljella}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvkerays}></Input></CardText> : undefined}
                  {kukat.pelargonia.orvtilattu !== 0 ? <CardText><Input className="inputlabel" placeholder={kukat.pelargonia.orvokkinimi}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtilattu}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtoimitetaan}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvlisatieto}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvjaljella}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvkerays}></Input></CardText> : undefined}
                  {kukat.pelargonia.orvtilattu !== 0 ? <CardText><Input className="inputlabel" placeholder={kukat.pelargonia.orvokkinimi}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtilattu}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvtoimitetaan}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvlisatieto}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvjaljella}></Input><Input className="inputlabel" placeholder={kukat.pelargonia.orvkerays}></Input></CardText> : undefined}
                 <Button>Päivitä tiedot</Button>
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
