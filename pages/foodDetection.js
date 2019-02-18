import { withRouter } from 'next/router';
import Layout from '../components/MyLayout.js';
import PhotoUpload from '../components/PhotoUpload.js';
import React from 'react';
import {
    Container,
    Segment,
    Divider
} from 'semantic-ui-react';
import axios from 'axios';

class Page extends React.Component {
    state = {
        file: null,
        progress: 'none' /* Progress values: none, active, failed, complete */
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
        this.setState({ progress: 'active' }, () => {
            axios.post("/api/detectCalories", formData, config)
                .then((response) => {
                    console.log(response);
                    this.setState({ progress: 'complete' });
                }).catch((error) => {
                    console.error(error);
                    this.setState({ progress: 'failed' });
                });
        });
    }

    onPhotoChange = (e) => {
        this.setState({ file: e.target.files[0] });
    }

    render() {
        return (
            <Layout>
                <Container>
                    <PhotoUpload
                        imageHeight={'75vh'}
                        image={this.state.file}
                        onPhotoSubmit={this.onPhotoSubmit}
                        onPhotoChange={this.onPhotoChange}
                        progress={this.state.progress}
                    />
                </Container>
            </Layout>
        );
    }
}

export default withRouter(Page);