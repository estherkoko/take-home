import React, { Component } from 'react';
import Sources from './Sources';
import NewSourceModal from './NewSourceModal';

const URL = 'http://localhost:8000/source/';
class Home extends Component {

    render() {
        return (
            <div className="container">
                <div className="row shadow-sm p-3 mb-5 mt-5 bg-white rounded">
                    <h4 className="text-dark font-weight-normal col-md-2">Source(s)</h4>
                    <span className="text-right col-md-10">
                        <NewSourceModal url={URL} />
                    </span>
                </div>
                <Sources url={URL} />
            </div>
        );
    }
}

export default Home;