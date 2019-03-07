import Layout from '../components/MyLayout';
import { withRouter } from 'next/router';
import React from 'react';
import {
    Header,
    Icon,
    Grid
} from "semantic-ui-react";
import KetoResult from '../components/KetoResult';
import PhotoUpload from '../components/PhotoUpload';
import testObjects from '../Utils/testObjects';
import axios from 'axios';

const style = {
    'padding': '2vh'
}

class Index extends React.Component {
    state = {
        file: null,
        progress: '', /* Progress values: waiting, active, failed, complete */
        result: process.env.NODE_ENV === 'development' ? testObjects.nutritionResponse : {} /* Set to dummy response if dev  */
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
                    this.setState({
                        progress: 'complete',
                        result: response.data
                    }, this.forceUpdate());
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
                <Grid style={style}>
                    <Grid.Row centered>
                        <div>
                            <Header as='h2' icon textAlign='center'>
                                <Icon name='lemon' circular />
                                <Header.Content>Is it Keto?</Header.Content>
                            </Header>
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={isEmpty(this.state.result) ? 4 : 8} centered>
                            {!isEmpty(this.state.result) ?
                                <KetoResult result={this.state.result} />
                                : <div />
                            }
                        </Grid.Column>
                        <Grid.Column width={8} centered>
                            <PhotoUpload
                                imageHeight={'45vh'}
                                image={this.state.file}
                                onPhotoSubmit={this.onPhotoSubmit}
                                onPhotoChange={this.onPhotoChange}
                                progress={this.state.progress}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>);
    }
}

function isEmpty(obj) {
    console.log(obj)
    return Object.entries(obj).length === 0 && obj.constructor === Object
}

export default withRouter(Index);