import { withRouter } from 'next/router';
import Layout from '../components/MyLayout.js';
import PhotoUpload from '../components/PhotoUpload.js';
import React from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';

class Page extends React.Component {
    state = {
        file: null
    }

    onPhotoSubmit = (e) => {
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

    onPhotoChange = (e) => {
        this.setState({ file: e.target.files[0] });
    }

    render() {
        return (
            <Layout>
                <Container >
                    <PhotoUpload image={this.state.file} onPhotoSubmit={this.onPhotoSubmit} onPhotoChange={this.onPhotoChange} />
                </Container>
            </Layout>
        );
    }
}

export default withRouter(Page);