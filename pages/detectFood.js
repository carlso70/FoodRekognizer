import { withRouter } from 'next/router';
import Layout from '../components/MyLayout.js';
import PhotoUpload from '../components/PhotoUpload.js';
import React from 'react';
import {
    Segment,
    Divider
} from 'semantic-ui-react';
import axios from 'axios';

class Page extends React.Component {
    state = {
        file: null,
        progress: '' /* Progress values: waiting, active, failed, complete */
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
            axios.post("/api/detectNutrition", formData, config)
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
        this.setState({
            file: e.target.files[0],
            progress: 'waiting'
        });
    }

    render() {
        return (
            <Layout>
                <PhotoUpload
                    imageHeight={'75vh'}
                    image={this.state.file}
                    onPhotoSubmit={this.onPhotoSubmit}
                    onPhotoChange={this.onPhotoChange}
                    progress={this.state.progress}
                />
            </Layout>
        );
    }
}

export default withRouter(Page);