import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input} from 'reactstrap';
import uuid from "uuid";

class NewSourceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            sources: [],
            modal: false,
            name: '',
            environment: '',
            encoding: ''
        };
    
        this.toggle = this.toggle.bind(this);
        this.saveNewSource = this.saveNewSource.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

   
    saveNewSource(event) {
        let newSource = {
            id: uuid.v1(),
            name: this.state.name,
            environment: this.state.environment,
            encoding: this.state.encoding,
        };
        this.postSourceData(newSource);
        this.resetForm();
        event.preventDefault();
    }

    postSourceData(newSource) {
        fetch(this.props.url, {
            method: 'POST',
            body: JSON.stringify(newSource),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }

    resetForm() {
        this.setState({
            modal: false,
            name: '',
            environment: '',
            encoding: ''
        });
    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });    
    }

    render() {
        const isNameInvalid = this.state.name.length === 0;
        const isEnvironmentInvalid = this.state.environment.length === 0;
        const isEncodingInvalid = this.state.encoding.length === 0;
        
        return (
            <div>
                <Button color="success" onClick={this.toggle}>Add New Source</Button>
                <Modal isOpen={ this.state.modal } toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add New Source</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.saveNewSource}>
                            <FormGroup>
                                <Label for="name">Source Name</Label>
                                <Input type="text" value={this.state.name} name="name" onChange={this.handleChange} />
                            </FormGroup>        
                            <FormGroup>
                                <Label for="environment">Environment</Label>
                                <Input type="select"  value={this.state.environment} name="environment" id="environment" onChange={this.handleChange} >
                                    <option value="">Choose an environment</option>
                                    <option value="development">Development</option>
                                    <option value="staging">Staging</option>
                                    <option value="production">Production</option>
                                </Input>
                            </FormGroup>       
                            <FormGroup>
                                <Label for="encoding">Encoding</Label>
                                <Input type="select" value={this.state.encoding} name="encoding" id="environment" onChange={this.handleChange}>
                                    <option value="">Choose an encoding</option>
                                    <option value="utf8">UTF8</option>
                                    <option value="latin1">Latin1</option>
                                </Input>
                            </FormGroup>
                            <Button color="primary" disabled={isNameInvalid && isEncodingInvalid && isEnvironmentInvalid}>Submit</Button>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default NewSourceModal;