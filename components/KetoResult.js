import React from 'react'
import {
    Card,
    Tab
} from 'semantic-ui-react'
import equalArray from '../Utils/equalArray.js';

export default class KetoResult extends React.Component {
    state = { nutrition: this.props.result }

    componentDidUpdate(prevProps) {
        if (!equalArray(this.props.result, prevProps.result)) {
            this.setState({ nutrition: this.props.result })
        }
    }

    renderPane = (index) => {
        const nutrition = this.state.nutrition;
        return (
            <Tab.Pane>
                <p>Calories: {nutrition[index].nf_calories}</p>
                <p>Carbs: {nutrition[index].nf_total_carbohydrate}</p>
            </Tab.Pane>
        );
    }

    render() {

        console.log("Nutrition Result");
        const nutrition = this.state.nutrition;
        console.log(nutrition);

        /* Build panes */
        let panes = [];
        if (Array.isArray(nutrition)) {
            console.log("is array");
            for (let i in nutrition) {
                console.log(nutrition[i]);
                let pane = {
                    menuItem: nutrition[i].food_name,
                    render: () => this.renderPane(i)
                };
                panes.push(pane);
            };
        }
        

        return <Tab panes={panes} />
    }
}