import React from 'react'
import { Grid, Header, Segment, Icon, Button, GridRow, Form } from 'semantic-ui-react'
const axios = require("axios");

export default class PhotoUpload extends React.Component {
    state = {}

    onFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/api/detectPhotoLabels", formData, config)
            .then((response) => {
                console.log(response);
                alert("The file is successfully uploaded");
            }).catch((error) => {
                console.error(error);
            });
    }

    onChange = (e) => {
        this.setState({ file: e.target.files[0] });
    }

    render() {
        return (
            <Segment style={{ 'height': '75vh' }} textAlign="center">
                <div>
                    <form onSubmit={this.onFormSubmit}>
                        <label htmlFor='myInput'>
                            <input id="myInput" onChange={this.onChange} type="file" />
                        </label>
                        <Button >
                            Upload Photo
                        </Button>
                    </form>
                </div>
            </Segment>
        );
    }
}