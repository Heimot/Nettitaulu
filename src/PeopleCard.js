import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import { Card, CardText, CardTitle, Button, Input, CardBlock, CardSubtitle } from 'reactstrap';
import Dialog from './components/fetch/dialog/editDialog';
import loaderDialog from './components/fetch/dialog/loaderDialog';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import { deleteFlowerData, updateFlower, patchKeraysData, putFlowersOrderData } from './components/fetch/apiFetch';


//CSS files
import "./Styles/Table.css";
import "./Styles/progressBar.css";
import "./Styles/Autocomplete.css";

let change = false;

function changeData() {
  change = true;
}

function changeNormal() {
  change = false;
}

const Progress = ({ done, count, counter }) => {
  let data = change === false ? done = done ? done + "%" : "" : count === undefined ? "" : count + "/" + counter;
  if (data.includes('.')) {
    data = data.substring(0, data.indexOf(".")) + "%";
  }
  const [style, setStyle] = React.useState({});


  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${done}`
    }
    setStyle(newStyle);
  }, 100);

  return (
    <div class="progress" onMouseEnter={() => changeData(done)} onMouseLeave={() => changeNormal()}>
      <div class="progress-done" style={style}>
        {data}
      </div>
    </div>
  )
}



class PeopleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      suggestions: [],

      kauppa: '',
      customerInfo: '',
      ToimitusPVM: '',
      idArray: [],

      isOpen: false,
      isOpen2: false,

      location: '',
      date: sessionStorage.getItem('userDate'),
      startDate: new Date(),
      startDate2: new Date(),
      createdID: '',
      idf: [],
      addFlowersValue: 1,

      openWarning: false,
      valmisWarning: false,
      alreadyLoaded: false,
    }
  }

  muokkaa(_id, products, kauppa, date, alisatieto, toimituspvm) {
    this.setState({
      isOpen2: true,
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

  async addFlowers(_id, products) {
    if (!this.state.alreadyLoaded) {
      this.state.idArray.push(
        products.map(product => {
          return product._id
        })
      )
    }

    let i = 0;
    while (i < this.state.addFlowersValue) {

      await fetch('http://localhost:3002/products/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
        body: JSON.stringify({
          kerays: localStorage.getItem("userLocation")
        }),
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);

          let jsonID = json.createdProduct._id;
          this.state.idArray.push(jsonID)

          this.setState({
            idArray: this.state.idArray.toString().split(",")
          })
        })
        .catch((error) => {
          console.log(error);
        });
      i++;
    }
    this.setState({
      alreadyLoaded: true
    })
    this.addToIDS(_id);
  }

  addToIDS(_id) {
    var filteredProducts = this.state.idArray.filter(Boolean);
    fetch('http://localhost:3002/orders/put/id/' + _id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        products: filteredProducts
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
    this.props.getTables();
  }

  patchData(product) {
    const idvalues = document.getElementById(`keratty/${product._id}`).value;
    var maara = document.getElementById(product._id).value;

    patchKeraysData(product, idvalues, maara);
    this.props.getTables();
  }

  putData(product) {
    console.log(product._id)
    var kukka = document.getElementById(`kukka/${product._id}`).value;
    var toimi = document.getElementById(`toimi/${product._id}`).value;
    var kerays = document.getElementById(`kerays/${product._id}`).value;
    var lisatieto = document.getElementById(`lisatieto/${product._id}`).value;

    updateFlower(product, kukka, toimi, kerays, lisatieto);
    this.props.getTables();
  }

  async putOrderData(_id, kauppa, alisatieto, toimituspvm, date) {
    var asiakas = this.state.kauppa;
    var asiakaslisatieto = this.state.customerInfo;
    var toimitusaika = this.state.ToimitusPVM;
    var keraysPVM = format(this.state.startDate, "dd/MM/yyyy");

    await putFlowersOrderData(asiakas, asiakaslisatieto, toimitusaika, kauppa, alisatieto, toimituspvm, _id, keraysPVM, date);
    await this.props.getTables();
    this.setState({
      isOpen2: false
    })
  }

  deleteData(product) {
    deleteFlowerData(product);
    this.props.getTables();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  pvmMuutos = (date) => {
    this.setState({
      startDate: date
    });
  }

  toimituspvmMuutos = (date) => {
    this.setState({
      startDate2: date,
      ToimitusPVM: format(date, 'dd/MM/yyyy')
    });
  }

  parseJwt() {
    var base64Url = sessionStorage.getItem('userData').split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    sessionStorage.setItem('userRole', JSON.parse(jsonPayload).roles)
  };

  componentDidMount() {
    this.parseJwt();
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

  onTextChange = (e) => {
    const { items } = this.props;
    const value = e.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = items.sort().filter(v => regex.test(v));
    }
    this.setState(() => ({ suggestions }));
    document.getElementById(e.target.id).value = value;
  }

  suggestionSelected(value, product) {
    console.log(value)
    document.getElementById(`kukka/${product._id}`).value = value;
    console.log(document.getElementById(`${product._id}`).value)
    this.setState(() => ({
      suggestions: [],
    }))

  }

  renderSuggestions(product) {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul className="AutoCompleteUl">
        {suggestions.map((item) => <li className="AutoCompleteLi" onClick={() => this.suggestionSelected(item, product)}>{item}</li>)}
      </ul>)
  }

  render() {
    const { search } = this.state;
    let { _id, products, kauppa, date, alisatieto, toimituspvm } = this.props.person;
    let array = [];
    let result = {};
    let counts = {};
    array.push(
      products.map(doc => {
        return doc.keratty;
      })
    )
    Object.keys(result).map(key => ({ [key]: result[key] }))
    for (let i = 0; i < array.length; i++) {
      result[array[i]] = (result[array[i]] || 0) + 1
    }
    Object.keys(result).map(str => str.replace(/\s/g, '')).toString().split(",").forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });



    return (
      <div className="myDiv">
        <div className="NavBlock"></div>

        <div>
          <Card className="Cards">
            <CardTitle>{date}</CardTitle>
            <CardTitle>{kauppa}</CardTitle>
            <CardText>{_id}</CardText>
            <CardText className="lisatieto">{alisatieto}</CardText>

            <div className="loaders" >
              <div className="loaderMargins">
                <CardText className="hover">Ei ole</CardText>
                <Progress done={100 * Math.abs(counts.Eiole / Object.keys(result).toString().split(",").length)} count={counts.Eiole} counter={products.length} />
              </div>

              <div className="loaderMargins">
                <CardText>Odottaa keräystä</CardText>
                <Progress done={100 * Math.abs(counts.Odottaakeräystä / Object.keys(result).toString().split(",").length)} count={counts.Odottaakeräystä} counter={products.length} />
              </div>

              <div className="loaderMargins">
                <CardText>Keräyksessä</CardText>
                <Progress done={100 * Math.abs(counts.Keräyksessä / Object.keys(result).toString().split(",").length)} count={counts.Keräyksessä} counter={products.length} />
              </div>

              <div className="loaderMargins">
                <CardText>Kerätty</CardText>
                <Progress done={100 * Math.abs(counts.Kerätty / Object.keys(result).toString().split(",").length)} count={counts.Kerätty} counter={products.length} />
              </div>
            </div>

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


              <Tbody>
                {products.map(product =>
                  <Tr>
                    <Td>{product.kukka}</Td>
                    <Td>{product.toimi}</Td>
                    <Td>{product.kerays}</Td>
                    <Td className="Lisatieto">{product.lisatieto}</Td>
                    <Td>
                      <Input className="label"
                        id={`keratty/${product._id}`}
                        value={product.keratty}
                        placeholder={product.keratty}
                        onDoubleClick={() => { this.patchData(product) }}>
                      </Input>
                    </Td>
                    <Td>
                      <Input className="label"
                        type="number"
                        id={product._id}
                        placeholder={product.kerattymaara}
                        name="kerattymaara">
                      </Input>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            <Button disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="success" onClick={() => this.valmis()}>Valmis</Button>
            <Button disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="primary" onClick={() => this.muokkaa(_id, products, kauppa, date, alisatieto, toimituspvm)}>Muokkaa</Button>
            <Button disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="danger" onClick={() => this.warning()}>Poista</Button>
          </Card>

          <Dialog className="DelWarn" isOpen2={this.state.openWarning} onClose={(e) => this.setState({ openWarning: false })}>

            <Card className="Cards">

              <CardTitle className="warningBox">Haluatko poistaa tämän taulun?</CardTitle>
              <CardText className="warningBox">ID: {_id}</CardText>
              <CardText className="warningBox">KAUPPA: {kauppa}</CardText>
              <CardText className="warningBox">KERÄYSPÄIVÄMÄÄRÄ: {date}</CardText>
              <CardText className="warningBox">TOIMITUSPÄIVÄMÄÄRÄ: {toimituspvm}</CardText>
              <CardText className="warningBox">KUKKIEN MÄÄRÄ: {products.length}</CardText>

              <Button className="btn" onClick={() => this.props.removePerson(_id, products) + this.setState({ openWarning: false })}>Kyllä</Button>
              <Button className="btn" onClick={() => this.setState({ openWarning: false })}>Ei</Button>

            </Card>
          </Dialog>


          <Dialog className="DelWarn" isOpen2={this.state.valmisWarning} onClose={(e) => this.setState({ valmisWarning: false })}>

            <Card className="Cards">

              <CardTitle className="warningBox">Haluatko viedä tämän taulu valmiina oleviin?</CardTitle>
              <CardTitle className="warningBox">Onko kaikki jo kerätty?</CardTitle>
              <CardText className="warningBox">ID: {_id}</CardText>
              <CardText className="warningBox">Kauppa: {kauppa}</CardText>
              <CardText className="warningBox">Keräyspäivämäärä: {date}</CardText>
              <CardText className="warningBox">Toimitus päivämäärä: {toimituspvm}</CardText>
              <CardText className="warningBox">Kerättävien kohteiden määrä: {products.length}</CardText>
                <CardText className="warningBox">Kerätty: {counts.Kerätty == undefined ? 0 : counts.Kerätty}/{products.length}</CardText>
              <CardText className="warningBox">Ei ole: {counts.Eiole == undefined ? 0 : counts.Eiole}/{products.length}</CardText>

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
                  onCalendarClose={() => sessionStorage.setItem('userDate2', format(this.state.startDate, "dd/MM/yyyy"))}
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

                {products.map(product =>
                  <Tbody>
                    <Tr>
                      <Td >
                        <div className="AutoCompleteText">
                          <Input type="text"
                            name="kukka"
                            id={`kukka/${product._id}`}
                            className="AutoCompleteInput"
                            onChange={this.onTextChange}
                            placeholder={product.kukka}>
                          </Input>
                          {this.renderSuggestions(product)}
                        </div>


                      </Td>

                      <Td>
                        <Input type="number"
                          name="toimi"
                          id={`toimi/${product._id}`}
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={product.toimi}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="kerays"
                          id={`kerays/${product._id}`}
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={product.kerays}>
                        </Input>
                      </Td>

                      <Td>
                        <Input type="text"
                          name="lisatieto"
                          id={`lisatieto/${product._id}`}
                          onChange={this.handleChange}
                          className="inputlabel"
                          placeholder={product.lisatieto}>
                        </Input>
                      </Td>
                    </Tr>
                    <Button color="success" onClick={() => this.putData(product)}>Päivitä kukan tiedot</Button>
                    <Button color="danger" onClick={() => this.deleteData(product)}>Poista kukka</Button>
                  </Tbody>
                )}
              </Table>
              <div>
                <Button className="addFlower" onClick={() => this.addFlowers(_id, products)}>Lisää kukka</Button>
                <Input type="number"
                  name="addFlowersValue"
                  className="addFlowerInput"
                  max={10}
                  min={1}
                  value={this.state.addFlowersValue}
                  onChange={this.handleChange}>
                </Input>
              </div>
              <div className="taulukkoDivider"></div>
              <Button color="success" onClick={() => this.putOrderData(_id, kauppa, alisatieto, toimituspvm, date)}>Päivitä taulukon tiedot</Button>
            </Card>
          </Dialog>
        </div>
      </div>
    )
  }
}

export default PeopleCard;
