import React, { Component } from 'react';
import { Button } from 'reactstrap';
import NewSourceModal from './_newSourceModal';

const URL = 'http://localhost:8000/source/';

class _home extends Component {
    
    constructor(props) {

        super(props);
        this.state = {
            data: [],
            sources: [],
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }
    
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    componentDidMount() {
        this.getAllSources();
    }

    getAllSources() {
        fetch(URL)
            .then(response => response.json())
            .then(sources => {
                this.setState({
                    sources: sources.data
                });
                console.log(this.state.sources);
            });
    }

    render() {
        const sourceList = this.state.sources.map((source) =>
            <tr key={source.id}>
                <td>{source.id}</td>
                <td>{source.name}</td>
                <td>
                    <Button color="secondary" className="mx-2" onClick={this.toggle}>Source Info</Button>
                    <Button color="primary" className="mx-2" onClick={this.toggle}>Messages</Button>
                </td>
            </tr>
        );
        return (
            <div className="container">
                <NewSourceModal modal={this.state.modal} url={URL}/>
                <div className="row shadow-sm p-3 mb-5 mt-5 bg-white rounded">
                    <h4 className="text-dark font-weight-normal col-md-2">Source(s)</h4>
                    <span className="text-right col-md-10">
                        <Button color="success" onClick={this.toggle}>Add New Source</Button>
                    </span>
                </div>
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th scope="col">Source ID</th>
                            <th scope="col">Source Name</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>{sourceList}</tbody>

                </table>

            </div>
        );
    }
}

export default _home;