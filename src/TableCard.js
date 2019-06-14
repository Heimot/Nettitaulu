import React, { Component } from 'react';
import { Card, CardText, CardBlock,
  CardTitle, CardSubtitle, Button } from 'reactstrap';

class TableCard extends Component {
  render () {
    let { _id, name, kukat} = this.props.person;
    return (
      <div>
        <Card>
          <CardBlock>
            <CardTitle>{name}</CardTitle>
            <CardSubtitle>{kukat}</CardSubtitle>
            <CardText>{_id}</CardText>
            <Button color="success" onClick={() => this.props.removePerson(_id)}>View table</Button>
          </CardBlock>
        </Card>
      </div>
    )
  }
}

export default TableCard;
