import React from 'react'
import { Card, Image, Progress, Button, Placeholder } from 'semantic-ui-react'

export default class PhotoUpload extends React.Component {

    /* getImageComponent: using the props, set the image inside the card to a placeholder or image */
    getImageComponent = () => {
        if (this.props.image) {
            return <Image src={URL.createObjectURL(this.props.image)} style={{ 'height': this.props.imageHeight }} />
        } else {
            return (<Placeholder style={{ 'height': this.props.imageHeight }}>
                <Placeholder.Image square />
            </Placeholder>);
        }
    }

    /* getProgressComponent: setup the progress bar component based off the progress prop */
    getProgressComponent = () => {
        if (this.props.progress) {
            switch (this.props.progress) {
                case 'active':
                    return <Progress percent={100} active>Uploading....</Progress>;
                case 'complete':
                    return <Progress percent={100} success>Completed!</Progress>;
                case 'failed':
                    return <Progress percent={100} error>Uh oh...looks like there was an error</Progress>;
                case 'waiting':
                    return <Progress percent={0}>Ready to upload</Progress>
                default:
                    return
            }
        }
    }

    render() {
        return (
            <Card fluid centered>
                {this.getImageComponent()}
                <Card.Content>
                    {this.getProgressComponent()}
                    <Card.Header>Detect Nutrition</Card.Header>
                    <form onSubmit={this.props.onPhotoSubmit}>
                        <input id="myInput" onChange={this.props.onPhotoChange} type="file" />
                        {this.props.progress === 'waiting' && <Button content="Upload Photo" />}
                    </form>
                </Card.Content>
            </Card>
        );
    }
}