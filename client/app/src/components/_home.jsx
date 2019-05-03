import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader,Form, FormGroup, Label, Input } from 'reactstrap';
import NewSourceModal from './_newSourceModal';

const URL = 'http://localhost:8000/source/';

class _home extends Component {

    constructor(props) {

        super(props);
        this.state = {
            data: [],
            sources: [],
            modal: false,
            show: false,
            name: '',
            environment: '',
            encoding: '',
            source: {
                id: ''
              },
            sourceDetails: []
        };

        this.toggle = this.toggle.bind(this);
        this.handleSourceDetails = this.handleSourceDetails.bind(this);
        this.handleUpdateDetails = this.handleUpdateDetails.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onChange = this.onChange.bind(this);


    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    onChange = e => this.setState({ [e.target.name]: e.target.value })

    componentDidMount() {
        this.getAllSources();
    }
    handleClose() {
        this.setState({ show: false });
    }

    handleSourceDetails(event) {
        this.showSourceDetails(this.state.sourceId);
        event.preventDefault();
    }
    
    handleUpdateDetails(event) {
        this.updateSourceDetails(this.state.sourceId);
        event.preventDefault();
    }
    handleDeleteSource(event){
        this.updateSourceDetails(this.state.sourceId);
        event.preventDefault();

    }
    getAllSources() {
        fetch(URL)
            .then(response => response.json())
            .then(sources => {
                this.setState({
                    sources: sources.data
                });
            });
    }
    showSourceDetails(sourceId) {
        fetch(URL + sourceId)
            .then(response => response.json())
            .then(sources => {
                this.setState({ sourceDetails: sources.data });
                this.setState({ show: true });
            });
    }
    updateSourceDetails(sourceId) {
        let data = {};
        data.environment = this.state.sourceDetails.environment;
        data.encoding = this.state.sourceDetails.environment;
        data.name = this.state.sourceDetails.name;
        fetch(URL + sourceId,{
            method: 'PATCH',
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }
    deleteSource(source){
        this.sendSourceDeleteRequest(source);
            //close modal on delete
            //remove deleted source from sources array
        this.removeDeletedFromView(source);
    }

    sendSourceDeleteRequest(source) {
        fetch(URL, {
            method: 'DELETE',
            body: JSON.stringify({ id: source.id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }

    removeDeletedFromView(source) {
        const deletedSourceIndex = this.state.sources.indexOf(source);
        this.state.sources.splice(deletedSourceIndex, 1);
    }

    render() {

        const sourceList = this.state.sources.map((source) =>
            <tr key={source.id}>
                <td>{source.id}</td>
                <td>{source.name}</td>
                <td>
                    <Button color="secondary" className="mx-2" onClick={() => this.showSourceDetails(source.id)}>Source Info</Button>
                    <Button color="primary" className="mx-2" onClick={this.toggle}>Messages</Button>
                </td>
            </tr>
        );
        return (
            <div className="container">
                <NewSourceModal modal={this.state.modal} url={URL} />
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
                <>
                    <Modal isOpen={this.state.show}>
                        <ModalHeader><span className="font-weight-bold">Source Details</span> - <span className="text-muted">{this.state.sourceDetails.id}</span></ModalHeader>
                        <ModalBody className="font-weight-bold">
                            <Form onSubmit={this.updateSourceDetails}>
                                <FormGroup>
                                    <Label for="name">Source Name</Label>
                                    <Input type="text" defaultValue={this.state.sourceDetails.name} onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="environment">Environment</Label>
                                    <Input type="select" value={this.state.sourceDetails.environment} name="sourceDetails.environment" onChange ={this.onChange}>
                                        <option value="">Choose an environment</option>
                                        <option value="development">Development</option>
                                        <option value="staging">Staging</option>
                                        <option value="production">Production</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="encoding">Encoding</Label>
                                    <Input type="select" defaultValue={this.state.sourceDetails.encoding}>
                                        <option value="">Choose an encoding</option>
                                        <option value="utf8">UTF8</option>
                                        <option value="latin1">Latin1</option>
                                    </Input>
                                </FormGroup>
                                <Button color="primary" onClick={this.handleUpdateDetails}>Update Source</Button>
                                <Button color="danger mx-2" onClick={() => this.deleteSource(this.state.sourceDetails)}>Delete Source :(</Button>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                            <Button variant="primary" onClick={this.handleClose}>Save Changes</Button>
                        </ModalFooter>
                    </Modal>
                </>
            </div>

        );
    }
}

export default _home;