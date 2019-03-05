import React from 'react'
import { Card } from 'semantic-ui-react'
import equalArray from '../Utils/equalArray.js';

export default class KetoResult extends React.Component {
    state = { nutrition: props.result }

    componentDidUpdate(prevProps) {
        if (!equalArray(this.props.result, prevProps.result)) {
            this.setState({ nutrition: this.props.result })
        }
    }

    render() {
        const nutrition = this.state.nutrition;
        return (
            <Card fluid centered>
                <Card.Content>
                    <Card.Header>Nutrition</Card.Header>

                </Card.Content>
            </Card>
        );
    }
}