import React from 'react'
import { Card, Image, Grid, Header, Segment, Icon, Button, Placeholder } from 'semantic-ui-react'


export default class PhotoUpload extends React.Component {
    render() {
        console.log(this.props.image)
        let imageComponent;
        if (this.props.image) {
            imageComponent = <Image src={URL.createObjectURL(this.props.image)} style={{ 'height': '25vh' }}/>
        } else {
            imageComponent = (<Placeholder style={{ 'height': '25vh' }} >
                <Placeholder.Image square />
            </Placeholder>);
        }

        return (
            <Card style={{'width' :'50vh'}}>
                {imageComponent}
                <Card.Content>
                    <Card.Header>Detect Calories</Card.Header>
                    <div>
                        <form onSubmit={this.props.onPhotoSubmit}>
                            <label htmlFor='myInput'>
                                <input id="myInput" onChange={this.props.onPhotoChange} type="file" />
                            </label>
                            <Button >
                                Upload Photo
                        </Button>
                        </form>
                    </div>

                </Card.Content>
            </Card>
        );
    }
}