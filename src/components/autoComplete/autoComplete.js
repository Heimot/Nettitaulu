import React from "react";
import "../../Styles/Autocomplete.css"
import { Input } from "reactstrap";


class MyAutosuggest extends React.Component {
  constructor() {
    super();
    this.state = {
      suggestions: [],
      items: ["FFF", "OOO", "KKK"],
      count: 1,
      id: "",
    };
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

  suggestionSelected(value, id) {
    document.getElementById(`${id}`).value = value;
    this.setState(() => ({
      suggestions: [],
    }))

  }

  onKeyDown = (e) => {
    switch (e.keyCode) {
      case 13:
        document.getElementById(`${this.props.id}`).value = this.state.suggestions[this.state.count - 1];
        this.setState(() => ({
          suggestions: [],
        }))
        break;

      case 40:
        if (this.state.count < this.state.suggestions.length) {
          this.setState(prevState => {
            return { count: prevState.count + 1 }
          })
        }
        break;

      case 38:
        if (this.state.count > 1) {
          this.setState(prevState => {
            return { count: prevState.count - 1 }
          })
        }
        break;
      default:
          
        break;
    }
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
      <div className={this.props.getDivClass}>
        <Input type="text"
          name="kukka"
          id={`${id}`}
          placeholder={placeholder}
          className={this.props.sendClass}
          onKeyDown={this.onKeyDown}
          onChange={this.onTextChange}
        />
        {this.renderSuggestions(id)}
      </div>
    );
  }
}

export default MyAutosuggest;
