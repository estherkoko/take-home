import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ViewMessages extends Component {

    constructor(props) {

        super(props);
        this.state = {
            data: [],
            messages: [],
            messageDetails: [],
            showMessage: false,
            message: { id: '' },
            selectedSourceId: ''
        };
        this.showSourceMessages = this.showSourceMessages.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    
    handleClose() {
        this.setState({ showMessage: false });
    }

    showSourceMessages(sourceId) {
        fetch('http://localhost:8000/message/' + sourceId)
            .then(response => response.json())
            .then(messages => {
                this.setState({ messageDetails: messages.data });
                this.setState({ showMessage: true });
                this.setState({ selectedSourceId: sourceId });
            });
    }

    render() {
        const messageList = this.state.messageDetails.map((message) =>
            <tr key={message.id}>
                <td>{message.id}</td>
                <td>{message.status}</td>
                <td>{message.status_count}</td>
            </tr>
        );
        return (
            <React.Fragment>
                <Button color="primary" className="mx-2" onClick={() => this.showSourceMessages(this.props.id)}>Messages</Button>
                <Modal isOpen={this.state.showMessage}>
                    <ModalHeader><span className="font-weight-bold">Message Details</span> - <span className="text-muted">{this.state.selectedSourceId}</span></ModalHeader>
                    <ModalBody>
                        <table className="table">
                            <thead className="font-weight-bold">
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
            </React.Fragment>
        );
    }
}

export default ViewMessages;