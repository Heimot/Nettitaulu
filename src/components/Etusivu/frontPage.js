import React, { Component } from "react";
import { Input, Button, Card, CardText, CardTitle } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import XLSX from 'xlsx';
import { FETCH_URL } from "../fetch/url";
import Dialog from "../dialog/editDialog";
import { getUserData, delUserData } from '../fetch/apiFetch';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';

//CSS
import "../../Styles/frontPage.css";

let Data = [{ "email": "f", "_id": "123", "roles": "user" }, { "email": "f", "_id": "123", "roles": "user" }];

class frontPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      saved: "",
      isOpen: false,
      isOpen2: false,
      Data: [],
      userName: "",
      passWord: "",
      Roles: "User",
    }
  }

  componentDidMount() {
    sessionStorage.removeItem("delID");
  }

  sendData(result) {
    this.setState({
      saved: result
    });

    fetch(FETCH_URL + 'items/put/id/5e71e2d16f0335253c8374e5/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        flowers: this.state.saved
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleFile = (e) => {
    console.log(Object.keys(XLSX.utils))
    var file = e.target.files[0];
    // input canceled, return
    if (!file) return;

    var FR = new FileReader();
    FR.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      // header: 1 instructs xlsx to create an 'array of arrays'
      var result = XLSX.utils.sheet_to_csv(firstSheet, { header: 1 });

      console.log(result)

      fetch(FETCH_URL + 'items/put/id/5e71e2d16f0335253c8374e5', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
        body: JSON.stringify({
          flowers: result.split("\n")
        }),
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });

    };
    FR.readAsArrayBuffer(file);
  };

  handleFile2 = (e) => {
    console.log(Object.keys(XLSX.utils))
    var file = e.target.files[0];
    // input canceled, return
    if (!file) return;

    var FR = new FileReader();
    FR.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      // header: 1 instructs xlsx to create an 'array of arrays'
      var result = XLSX.utils.sheet_to_csv(firstSheet, { header: 1 });

      console.log(result)

      fetch(FETCH_URL + 'items/put/id/5e748700bee89f3d5c27ae55', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
        body: JSON.stringify({
          kaupat: result.split("\n")
        }),
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });

    };
    FR.readAsArrayBuffer(file);
  };

  async delID() {
    await delUserData();
    this.setState({ isOpen2: false });
    sessionStorage.removeItem("delID");
    this.adminRoles()
  }

  async adminRoles() {
    Data = await getUserData();
    await this.setState({ isOpen: true, Data: Data });
  }

  async addProfile() {
    await fetch(FETCH_URL + 'user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        email: this.state.userName,
        password: this.state.passWord,
        roles: this.state.Roles
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
      this.setState({
        userName: "",
        passWord: "",
        Roles: ""
      })
      await this.adminRoles()
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to={'/main/tables'} />)
    }

    return (
      <div className="frontPage">
        <div className="frontPageMenu">
          <Button className="frontPageSettings"></Button>
          <div className="frontMainBtn">

            <Button className="redirect"
              onClick={() =>
                this.setState({ redirect: true }) +
                sessionStorage.setItem("userValmis", "Ei") +
                sessionStorage.setItem("siteName", "Kerättävät") +
                sessionStorage.setItem("btnName", "Kerättävät")}>
              Kerättävät
            </Button>

            {sessionStorage.getItem("userRole") === "Admin" ?
              <Button className="redirect2"
                onClick={() =>
                  this.setState({ redirect: true }) +
                  sessionStorage.setItem("userValmis", "Kerätty") +
                  sessionStorage.setItem("siteName", "Valmiit") +
                  sessionStorage.setItem("btnName", "Valmiit")}>
                Valmiit
            </Button>
              : undefined}

            {sessionStorage.getItem("userRole") === "Admin" ? <Button className="redirect3" onClick={() => this.adminRoles()}>Admin</Button> : undefined}
          </div>
          <div className="pictureDot"></div>
        </div>
        <h1 className="frontText">Ohjelma</h1>
        <div className="frontPagePictureDiv">
        </div>
        <Dialog className="adminDialog" isOpen2={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })}>
          <Card className="Cards">
            <div className="containDiv">
              <div className="adminSettings">
                <CardText>Kukat auto täydentämiseen.</CardText>
                <Input type="file" name="file" id="exampleFile" accept=".xls,.xlsx,.ods" onChange={(e) => this.handleFile(e)}></Input>
                <CardText>Asiakkaat auto täydentämiseen.</CardText>
                <Input type="file" name="file2" id="exampleFile2" accept=".xls,.xlsx,.ods" onChange={(e) => this.handleFile2(e)}></Input>
              </div>
              <div className="accountCreate">
                <CardTitle>Käyttäjien lisääminen ja poistaminen.</CardTitle>
                <Table className="Tables">

                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Käyttäjänimi</Th>
                      <Th>Rooli</Th>
                    </Tr>
                  </Thead>

                  {this.state.Data.map(user =>
                    <Tbody key={user._id}>
                      <Tr>
                        <Td className="userID">{user._id}</Td>
                        <Td className="userEmail">{user.email}</Td>
                        <Td className="userRole">{user.roles} <Button onClick={() => sessionStorage.setItem("delID", user._id) + this.setState({ isOpen2: true })}>X</Button></Td>
                      </Tr>
                    </Tbody>
                  )}
                </Table>
                <CardText>Käyttäjänimi</CardText>
                <Input name="userName" type="text" placeholder="Käyttäjänimi" onChange={this.handleChange}></Input>
                <CardText>Salasana</CardText>
                <Input name="passWord" type="password" placeholder="Salasana" onChange={this.handleChange}></Input>
                <CardText>Rooli</CardText>
                <Input name="Roles" type="select" placeholder="Rooli" onChange={this.handleChange}><option>User</option><option>Admin</option></Input>
                <CardText></CardText>
                <Button onClick={() => this.addProfile()}>Luo käyttäjä</Button>
              </div>
            </div>
          </Card>
        </Dialog>
        <Dialog className="adminDialog" isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
          <Card>
            <CardText className="deleteUser">Poistetaanko käyttäjä?</CardText>
            <Button onClick={() => this.delID()}>Kyllä</Button>
            <Button onClick={() => this.setState({ isOpen2: false }) + sessionStorage.removeItem("delID")}>Ei</Button>
          </Card>
        </Dialog>
      </div>
    )
  }
}

export default frontPage;