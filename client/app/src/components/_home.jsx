import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input } from 'reactstrap';
import NewSourceModal from './_newSourceModal';

const URL = 'http://localhost:8000/source/';
class _home extends Component {

    constructor(props) {

        super(props);
        this.state = {
            data: [],
            sources: [],
            messages: [],
            sourceDetails: [],
            messageDetails: [],
            modal: false,
            show: false,
            showMessage: false,
            name: '',
            environment: '',
            encoding: '',
            source: { id: '' },
            selectedSourceId: '',
        };

        this.toggle = this.toggle.bind(this);
        this.handleSourceDetails = this.handleSourceDetails.bind(this);
        this.deleteSource = this.deleteSource.bind(this);
        this.updateSourceDetails = this.updateSourceDetails.bind(this);
        this.handleShowMessages = this.handleShowMessages.bind(this);
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
    handleDeleteSource(event) {
        this.updateSourceDetails(this.state.sourceId);
        event.preventDefault();

    }
    handleShowMessages(event) {
        this.showSourceMessages(this.state.sourceId);
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
                console.log(sourceId);
                this.setState({ selectedSourceId: sourceId });
            });
    }
    updateSourceDetails(event) {
        event.preventDefault();
        let source = {
            id: this.state.selectedSourceId,
            name: event.target.name.value,
            environment: event.target.environment.value,
            encoding: event.target.encoding.value,
        };
        fetch(URL, {
            method: 'PATCH',
            body: JSON.stringify(source),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        })
            .then(response => response.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }

    showSourceMessages(sourceId) {
        fetch('http://localhost:8000/message/' + sourceId)
            .then(response => response.json())
            .then(messages => {
                this.setState({ messageDetails: messages.data });
                this.setState({ showMessage: true });
            });
    }
    deleteSource(source) {
        this.sendSourceDeleteRequest(source);
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
        const messageList = this.state.messageDetails.map((message) =>
            <tr key={message.id}>
                <td>{message.id}</td>
                <td>{message.status}</td>
                <td>{message.status_count}</td>
            </tr>
        );
        const sourceList = this.state.sources.map((source) =>
            <tr key={source.id}>
                <td>{source.id}</td>
                <td>{source.name}</td>
                <td>
                    <Button color="secondary" className="mx-2" onClick={() => this.showSourceDetails(source.id)}>Source Info</Button>
                    <Button color="primary" className="mx-2" onClick={() => this.showSourceMessages(source.id)}>Messages</Button>
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
                                    <Input type="text" name="name" defaultValue={this.state.sourceDetails.name} onChange={this.onChange} ref={(name) => { this.state.sourceDetails.name = name; }} />
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
                </>
                <>
                    <Modal isOpen={this.state.showMessage}>
                        <ModalHeader><span className="font-weight-bold">Message Details</span> - <span className="text-muted">{this.state.messageDetails.id}</span></ModalHeader>
                        <ModalBody className="font-weight-bold">
                            <table className="table text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">Message ID</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Status Count</th>
                                    </tr>
                                </thead>
                                <tbody>{messageList}</tbody>
                            </table>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        </ModalFooter>
                    </Modal>
                </>
            </div>

        );
    }
}

export default _home;