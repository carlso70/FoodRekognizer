import React from 'react'
import {
    Tab,
    Segment,
    Statistic
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
                <h1>{nutrition[index].nf_total_carbohydrate > 20 ? 'Probably Not Keto' : 'Probably Keto'}</h1>
                <Segment >
                    <Statistic.Group widths="2" size="mini" >
                        <Statistic label={"Calories"} value={nutrition[index].nf_calories} />
                        <Statistic label={"Carbs"} value={nutrition[index].nf_total_carbohydrate} />
                        <Statistic label={"Protein"} value={nutrition[index].nf_protein} />
                        <Statistic label={"Total Fat"} value={nutrition[index].nf_total_fat} />
                        <Statistic label={"Saturated Fat"} value={nutrition[index].nf_saturated_fat} />
                        <Statistic label={"Cholesterol"} value={nutrition[index].nf_cholesterol} />
                        <Statistic label={"Sodium"} value={nutrition[index].nf_sodium} />
                        <Statistic label={"Fiber"} value={nutrition[index].nf_dietary_fiber} />
                        <Statistic label={"Sugars"} value={nutrition[index].nf_sugars} />
                        <Statistic label={"Potassium"} value={nutrition[index].nf_potassium} />
                    </Statistic.Group>
                </Segment>
            </Tab.Pane>
        );
    }

    render() {
        const nutrition = this.state.nutrition;

        /* Build panes */
        let panes = [];
        if (Array.isArray(nutrition)) {
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