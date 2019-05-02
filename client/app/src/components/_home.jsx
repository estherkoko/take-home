import React, { Component } from 'react';


class _home extends Component {

    constructor(props) {

        super(props);
        this.state = {
            data: []
        }
    };

    componentDidMount() {
        this.getAllSources();
    }

    getAllSources() {
        fetch('http://localhost:8000/source/')
            .then(response => response.json())
            .then(sources => {
                this.setState({sources});
                console.log(this.state.sources);
            });
    }
    
    render() {
        const sourceList = this.state.data.map((source) =>
                <tr key={source.id}>
                    <td>{source.id}</td>
                    <td>{source.name}</td>
                </tr>
        );
        return (
            <div className="container">
                <div className="row shadow-sm p-3 mb-5 mt-5 bg-white rounded">
                    <h4 className="text-dark font-weight-normal col-md-2">Source(s)</h4>
                    <span className="text-right col-md-10">
                        <button type="button" className="btn btn-primary font-weight-bold">Add New Source</button>
                    </span>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Source ID</th>
                            <th scope="col">Source Name</th>
                        </tr>
                    </thead>
                    <tbody>{sourceList}</tbody>
                
                </table>

            </div>
        );
    }
}

export default _home;