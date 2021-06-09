import React, { Component } from "react";
import { Input, Button, Card, CardText, CardTitle } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import XLSX from 'xlsx';
import { FETCH_URL } from "../fetch/url";
import Dialog from "../dialog/editDialog";
import { getUserData, delUserData, getFlowersToAutocomplete } from '../fetch/apiFetch';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import language from '../language/language';
import LanguageBtn from '../language/languageBtn';
import mainPicture from '../../pictures/main_picture.jpg';

//CSS
import "../../Styles/frontPage.css";

let Data = [{ "email": "f", "_id": "123", "roles": "user" }, { "email": "f", "_id": "123", "roles": "user" }];
let Datas = [];

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
      kaupatExcel: false,
      kukatExcel: false,
      kaupatError: false,
      kukatError: false,
      settingsOpen: false,
      reRender: false,
      redirectRullakko: false,
      redirectKalenteri: false,
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleFile2 = this.handleFile2.bind(this);
    this.reRender = this.reRender.bind(this);
  }

  componentDidMount() {
    try {
      sessionStorage.removeItem("delID");
      this.getAndPost();
    } catch (err) {
      console.log(err);
    }
  }

  async getAndPost() {
    try {
      Datas = await getFlowersToAutocomplete();
      if (Datas.message) {
        fetch(FETCH_URL + 'items/flowers/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
          },
          body: JSON.stringify({
            flowers: ["Empty", "Empty", "Empty"],
            kaupat: ["Empty", "Empty", "Empty"]
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
    } catch (err) {
      console.log(err)
    }
  }

  handleFile = (e) => {
    try {
      var file = e.target.files[0];
      // input canceled, return
      if (!file) return;

      var FR = new FileReader();
      FR.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // header: 1 instructs xlsx to create an 'array of arrays'
        var result = XLSX.utils.sheet_to_csv(firstSheet, { header: 1 });

        fetch(FETCH_URL + 'items/patch/id/items', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
          },
          body: JSON.stringify([
            {
              propName: "flowers",
              value: result.split("\n")
            }
          ])
        })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            this.setState({
              kukatExcel: true,
              kukatError: false
            })
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              kukatError: true,
              kukatExcel: false
            })
          });
      };
      FR.readAsArrayBuffer(file);
    } catch (error) {
      console.log(error);
    };
  };

  handleFile2 = (e) => {
    try {
      var file = e.target.files[0];
      // input canceled, return
      if (!file) return;

      var FR = new FileReader();
      FR.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // header: 1 instructs xlsx to create an 'array of arrays'
        var result = XLSX.utils.sheet_to_csv(firstSheet, { header: 1 });

        fetch(FETCH_URL + 'items/patch/id/items', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
          },
          body: JSON.stringify([
            {
              propName: "kaupat",
              value: result.split("\n")
            }
          ])
        })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            this.setState({
              kaupatExcel: true,
              kaupatError: false
            })
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              kaupatError: true,
              kaupatExcel: false
            })
          });
      };
      FR.readAsArrayBuffer(file);
    } catch (error) {
      console.log(error);
    };
  }

  reRender() {
    this.setState({
      reRender: true
    })
  }

  async delID() {
    try {
      await delUserData();
      this.setState({ isOpen2: false });
      sessionStorage.removeItem("delID");
      this.adminRoles()
    } catch (error) {
      console.log(error);
    };
  }

  async adminRoles() {
    try {
      Data = await getUserData();
      await this.setState({ isOpen: true, Data: Data });
    } catch (error) {
      console.log(error);
    };
  }

  async addProfile() {
    try {
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
    } catch (error) {
      console.log(error);
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    let { kukatExcel, kaupatExcel, kukatError, kaupatError, redirect, redirectRullakko, redirectKalenteri } = this.state;

    if (sessionStorage.getItem("userData") === null) {
      return <Redirect to="/" />
    }

    if (redirectKalenteri) {
      return (<Redirect to={'/main/calendar'} />)
    }

    if (redirect) {
      return (<Redirect to={'/main/tables'} />)
    }

    if (redirectRullakko) {
      return (<Redirect to={'/main/tables/rullakot'} />)
    }

    return (
      <ErrorBoundary>
        <div className="frontPage">
          <div className="frontPageMenu">

            <Button name="settings" className="frontPageSettings" onClick={() => this.setState({ settingsOpen: true })}></Button>
            <div className="frontMainBtn">
              <ol className="noList">
                <li>
                  {sessionStorage.getItem("userRole") !== "Kuski" ? <Button name="kerattavat" className="redirect"
                    onClick={() =>
                      this.setState({ redirect: true }) +
                      sessionStorage.setItem("userValmis", "Ei") +
                      sessionStorage.setItem("siteName", "Kerättävät") +
                      sessionStorage.setItem("btnName", "Kerättävät")}>
                    {language[localStorage.getItem('language')].collect}
                  </Button> : undefined}
                </li>
                <li>
                  {sessionStorage.getItem("userRole") === "Admin" ?
                    <Button name="valmiit" className="redirect2"
                      onClick={() =>
                        this.setState({ redirect: true }) +
                        sessionStorage.setItem("userValmis", "Kerätty") +
                        sessionStorage.setItem("siteName", "Valmiit") +
                        sessionStorage.setItem("btnName", "Valmiit")}>
                      {language[localStorage.getItem('language')].ready}
                    </Button>
                    : undefined}
                </li>
                <li>
                  {sessionStorage.getItem("userRole") !== "User" ?
                    <Button
                      name="rullakot"
                      className="redirect4"
                      onClick={() => this.setState({
                        redirectRullakko: true
                      })}>
                      {language[localStorage.getItem('language')].fpRullakot}
                    </Button>
                    : undefined}
                </li>
                <li>
                    <Button
                      name="rullakot"
                      className="redirect4"
                      onClick={() => this.setState({
                        redirectKalenteri: true
                      })}>
                      {language[localStorage.getItem('language')].fpKalenteri}
                    </Button>
                </li>
                <li>
                  {sessionStorage.getItem("userRole") === "Admin" ? <Button name="adminpanel" className="redirect3" onClick={() => this.adminRoles()}>Admin</Button> : undefined}
                </li>
              </ol>
            </div>
            <div className="pictureDot"></div>
          </div>
          <h1 className="frontText">Ohjelma</h1>
          <img src={mainPicture} className="frontPagePictureDiv">
          </img>

          <Dialog className="adminDialog" isOpen2={this.state.settingsOpen} onClose={(e) => this.setState({ settingsOpen: false })}>
            <LanguageBtn reRender={this.reRender} />
          </Dialog>

          <Dialog className="adminDialog" isOpen2={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })}>
            <Card className="Cards">
              <div className="containDiv">
                <div className="adminSettings">
                  <CardText>{language[localStorage.getItem('language')].fpAutoKukka}</CardText>
                  <Input type="file" name="file" id="exampleFile" accept=".xls,.xlsx,.ods" onChange={(e) => this.handleFile(e)}></Input>
                  {kukatExcel === true ? <CardText>{language[localStorage.getItem('language')].fpKukkaWork}</CardText> : undefined}
                  {kukatError === true ? <CardText>{language[localStorage.getItem('language')].fpKukkaFail}</CardText> : undefined}
                  <CardText>{language[localStorage.getItem('language')].fpAutoAsiakas}</CardText>
                  <Input type="file" name="file2" id="exampleFile2" accept=".xls,.xlsx,.ods" onChange={(e) => this.handleFile2(e)}></Input>
                  {kaupatExcel === true ? <CardText>{language[localStorage.getItem('language')].fpKauppaWork}</CardText> : undefined}
                  {kaupatError === true ? <CardText>{language[localStorage.getItem('language')].fpKauppaFail}</CardText> : undefined}
                </div>
                <div className="accountCreate">
                  <CardTitle>{language[localStorage.getItem('language')].fpUserAdd}</CardTitle>
                  <Table className="Tables">

                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>{language[localStorage.getItem('language')].fpUser}</Th>
                        <Th>{language[localStorage.getItem('language')].fpRole}</Th>
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
                  <CardText>{language[localStorage.getItem('language')].fpUser}</CardText>
                  <Input name="userName" type="text" placeholder={language[localStorage.getItem('language')].fpUser} onChange={this.handleChange}></Input>
                  <CardText>{language[localStorage.getItem('language')].fpPassword}</CardText>
                  <Input name="passWord" type="password" placeholder={language[localStorage.getItem('language')].fpPassword} onChange={this.handleChange}></Input>
                  <CardText>{language[localStorage.getItem('language')].fpRole}</CardText>
                  <Input name="Roles" type="select" placeholder={language[localStorage.getItem('language')].fpRole} onChange={this.handleChange}><option>User</option><option>Admin</option><option>Kuski</option></Input>
                  <CardText></CardText>
                  <Button onClick={() => this.addProfile()}>{language[localStorage.getItem('language')].fpCreate}</Button>
                </div>
              </div>
            </Card>
          </Dialog>
          <Dialog className="adminDialog" isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
            <Card>
              <CardText className="deleteUser">{language[localStorage.getItem('language')].fpDelete}</CardText>
              <Button name="delKylla" onClick={() => this.delID()}>{language[localStorage.getItem('language')].yes}</Button>
              <Button name="delEi" onClick={() => this.setState({ isOpen2: false }) + sessionStorage.removeItem("delID")}>{language[localStorage.getItem('language')].no}</Button>
            </Card>
          </Dialog>
        </div>
      </ErrorBoundary>
    )
  }
}

export default frontPage;