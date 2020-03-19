import React from "react";
import "../../Styles/Autocomplete.css"
import { Input } from "reactstrap";


class MyAutosuggest extends React.Component {
  constructor() {
    super();
    this.state = {
      suggestions: [],
      items: ["FFF", "OOO", "KKK"]
    };
  }

  onTextChange = (e) => {
    console.log(e.target.id)
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

  suggestionSelected(value, id) {
    console.log(value)
    document.getElementById(`${id}`).value = value;
    console.log(document.getElementById(`${id}`).value)
    this.setState(() => ({
      suggestions: [],
    }))

  }

  renderSuggestions(id) {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul className="AutoCompleteUl">
        {suggestions.map((item) => <li className="AutoCompleteLi" onClick={() => this.suggestionSelected(item, id)}>{item}</li>)}
      </ul>)
  }

  render() {
    let { id, placeholder } = this.props;
    return (
      <div className="AutoCompleteText">
        <Input type="text"
          name="kukka"
          id={`${id}`}
          placeholder={placeholder}
          className="AutoCompleteInput"
          onChange={this.onTextChange} 
          />
        {this.renderSuggestions(id)}
      </div>
    );
  }
}

export default MyAutosuggest;
