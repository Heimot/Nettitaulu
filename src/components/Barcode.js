import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import language from './language/language';

class Barcode extends Component {
    constructor() {
        super();
        this.state = {
            flowerStatus: null
        }
    }

    async connScanner() {
        try {
            const filters = [{
                vendorId: 0x1A86
            }];
            const device = await navigator.usb.requestDevice({ filters })

            const configuration_number = 1  // device.configuration.configurationValue
            const interface_number = 0      // device.configuration.interfaces[1].interfaceNumber
            const interface_class = 255      // device.configuration.interfaces[1].alternates[0].interfaceClass
            console.log(device);
            console.log(`configuration number :  ${configuration_number}`);
            console.log(`interface number : ${interface_number} `);
            console.log(`interface class : ${interface_class} `);

            await device.open();
            await device.selectConfiguration(configuration_number);
            await device.claimInterface(interface_number);
            await device.controlTransferOut({
                requestType: 'class',
                recipient: 'interface',
                request: 0x22,
                value: 0x10,
                index: interface_number
            });

            const read = async (device) => {
                const result = await device.transferIn(2, 64);
                const decoder = new TextDecoder();
                const message = decoder.decode(result.data);
                return message
            }

            var m
            do {
                m = await read(device)
                this.getScannedData(m)
            } while (m.charCodeAt(0) !== 13)

        } catch (error) {
            console.log(error);
        }
    }

    getScannedData(id) {
        fetch('http://localhost:3002/products/get/id/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
            }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    flowerStatus: json.product
                })
                console.log(json.product)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    tarkastettu() {
        fetch('http://localhost:3002/products/patch/id/' + this.state.flowerStatus._id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
            },
            body: JSON.stringify([
              {
                propName: "tarkastettu",
                value: "Kyllä",
              },
            ])
          })
            .then(response => response.json())
            .then(json => {
              console.log(json);
              this.setState({ flowerStatus: null })
            })
            .catch((error) => {
              console.log(error);
              alert("Sending to ready ones failed for some reason?")
            });
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", padding: "20px", flexDirection: "column" }}>
                <div style={{ marginBottom: "20px" }}>
                    <Button onClick={() => this.connScanner()}>Connect scanner</Button>
                </div>
                {this.state.flowerStatus !== null ?
                    <div>
{this.state.flowerStatus.tarkastettu === "Ei" ?
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>{language[localStorage.getItem('language')].tuote}</Th>
                                    <Th>{language[localStorage.getItem('language')].kerataan}</Th>
                                    <Th>{language[localStorage.getItem('language')].kerayspiste}</Th>
                                    <Th>{language[localStorage.getItem('language')].lisatietoa}</Th>
                                    <Th>{language[localStorage.getItem('language')].keraamassa}</Th>
                                    <Th>{language[localStorage.getItem('language')].kerattymaara}</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>{this.state.flowerStatus.kukka}</Td>
                                    <Td>{this.state.flowerStatus.toimi}</Td>
                                    <Td>{this.state.flowerStatus.kerays}</Td>
                                    <Td>{this.state.flowerStatus.lisatieto}</Td>
                                    <Td><Button>{this.state.flowerStatus.keratty}</Button></Td>
                                    <Td><Input placeholder={this.state.flowerStatus.kerattymaara}></Input></Td>
                                </Tr>
                            </Tbody>
                        </Table>
    : <div>This has already been checked!</div>}
                        <div>
                        <Button onClick={() => this.tarkastettu()}>Valmis</Button>
                        <Button onClick={() => this.setState({ flowerStatus: null })}>Ei ole valmis</Button>
                        </div>
                    </div>
                    : null}
            </div>
        )
    }
}

export default Barcode;