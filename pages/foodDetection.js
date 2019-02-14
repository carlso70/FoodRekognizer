import { withRouter } from 'next/router';
import Layout from '../components/MyLayout.js';
import PhotoUpload from '../components/PhotoUpload.js';
import React from 'react';
import { Container, Header, Segment, Icon, Button } from 'semantic-ui-react';


class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <Container>
                    <PhotoUpload />
                </Container>
            </Layout>
        );
    }
}

export default withRouter(Page);