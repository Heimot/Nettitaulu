import React, { Component } from "react";
import { Tbody, Tr, Td } from "react-super-responsive-table";
import { Input } from "reactstrap";

class DeliveryRow extends Component {
  constructor() {
    super();
    this.state = {
        kauppa: "",
        maara: 0,
    };
  }
  componentDidMount() {
      this.setState({
          kauppa: this.props.storeName.kauppa
      })
  }

  handleChange = async (e) => {
    await this.setState({
      [e.target.name]: e.target.value,
    });
    let arr ={_id: this.props.storeName._id, kauppa: this.state.kauppa, maara: this.state.maara};
    this.props.getValues(arr);
  };

  render() {
      return(
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
                      name="maara"
                      value={this.state.maara}
                      type="number"
                    ></Input>
                  </Td>
                </Tr>
              </Tbody>
      )
  }
}


export default DeliveryRow;
