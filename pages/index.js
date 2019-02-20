import Layout from '../components/MyLayout';
import Link from 'next/link';
import { withRouter } from 'next/router';
import React from 'react';
import {
    Button,
    Header,
    Icon,
    Grid
} from "semantic-ui-react";
import PhotoUpload from '../components/PhotoUpload';
import axios from 'axios';

class Index extends React.Component {
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
                <Grid>
                    <Grid.Row centered>
                        <div>
                            <Header as='h2' icon textAlign='center'>
                                <Icon name='lemon' circular />
                                <Header.Content>Is it Keto?</Header.Content>
                            </Header>
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4} centered />
                        <Grid.Column width={8} centered>
                            <PhotoUpload
                                imageHeight={'45vh'}
                                image={this.state.file}
                                onPhotoSubmit={this.onPhotoSubmit}
                                onPhotoChange={this.onPhotoChange}
                                progress={this.state.progress}
                            />
                        </Grid.Column>
                        <Grid.Column width={4} centered />
                    </Grid.Row>
                </Grid>
            </Layout>);
    }
}

export default withRouter(Index);