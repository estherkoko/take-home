import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input } from 'reactstrap';
import ViewMessages from './ViewMessages';

class Sources extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sources: [],
            sourceDetails: [],
            show: false,
            name: '',
            environment: '',
            encoding: '',
            selectedSourceId: '',
            source: { id: '' }
        }
        this.handleSourceDetails = this.handleSourceDetails.bind(this);
        this.handleUpdateDetails = this.handleUpdateDetails.bind(this);
        this.updateSourceDetails = this.updateSourceDetails.bind(this);
        this.deleteSource = this.deleteSource.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.getAllSources();
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    handleClose() {
        this.setState({ show: false });
    }

    getAllSources() {
        fetch(this.props.url)
            .then(response => response.json())
            .then(sources => {
                this.setState({
                    sources: sources.data
                });
            });
    }

    handleSourceDetails(event) {
        this.showSourceDetails(this.state.sourceId);
        event.preventDefault();
    }

    showSourceDetails(sourceId) {
        fetch(this.props.url + sourceId)
            .then(response => response.json())
            .then(sources => {
                this.setState({ sourceDetails: sources.data });
                this.setState({ selectedSourceId: sourceId });
                this.setState({ show: true });
            });
    }

    updateSourceDetails(event) {
        event.preventDefault();
        let source = { id: this.state.selectedSourceId, name: event.target.name.value, environment: event.target.environment.value, encoding: event.target.encoding.value };
        fetch(this.props.url, {
            method: 'PATCH',
            body: JSON.stringify(source),
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        })
            .then(response => response.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }

    handleUpdateDetails(event) {
        this.updateSourceDetails(this.state.sourceId);
        event.preventDefault();
    }

    deleteSource(source) {
        this.sendSourceDeleteRequest(source);
        this.removeDeletedFromView(source);
    }

    sendSourceDeleteRequest(source) {
        fetch(this.props.url, {
            method: 'DELETE',
            body: JSON.stringify({ id: source.id }),
            headers: {'Content-Type': 'application/json'}
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
                    <ViewMessages id={source.id}></ViewMessages>
                </td>
            </tr>
        );

        return (
            <div>
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
                <Modal isOpen={this.state.show}>
                    <ModalHeader><span className="font-weight-bold">Source Details</span> - <span className="text-muted">{this.state.sourceDetails.id}</span></ModalHeader>
                    <ModalBody className="font-weight-bold">
                        <Form onSubmit={this.updateSourceDetails}>
                            <FormGroup>
                                <Label for="name">Source Name</Label>
                                <Input type="text" name="name" defaultValue={this.state.sourceDetails.name} onChange={this.onChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="environment">Environment</Label>
                                <Input type="select" name="environment" defaultValue={this.state.sourceDetails.environment} onChange={this.onChange}>
                                    <option value="">Choose an environment</option>
                                    <option value="development">Development</option>
                                    <option value="staging">Staging</option>
                                    <option value="production">Production</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="encoding">Encoding</Label>
                                <Input type="select" name="encoding" defaultValue={this.state.sourceDetails.encoding} onChange={this.onChange}>
                                    <option value="">Choose an encoding</option>
                                    <option value="utf8">UTF8</option>
                                    <option value="latin1">Latin1</option>
                                </Input>
                            </FormGroup>
                            <Button color="primary" type="submit">Update Source</Button>
                            <Button color="danger mx-2" onClick={() => this.deleteSource(this.state.sourceDetails)}>Delete Source :(</Button>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Sources;