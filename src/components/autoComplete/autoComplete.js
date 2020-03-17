import React from "react";

export default class autoComplete extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        items: [
            "Orvokki",
            "Pelargonia",
            "Kukka",
            "Amppeli"
        ]
        }
    }
    
    render() {

        return(
            <div>
                <input type="text" />
                <ul>
                    {this.state.items.map((item) => 
                        <li>{item}</li>
                    )}
                </ul>
            </div>
        )
    }
}