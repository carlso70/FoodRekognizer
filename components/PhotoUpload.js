import React from 'react'
import { Card, Image, Progress, Button, Placeholder } from 'semantic-ui-react'


export default class PhotoUpload extends React.Component {
    render() {
        let imageComponent;
        if (this.props.image) {
            imageComponent = <Image src={URL.createObjectURL(this.props.image)} style={{ 'height': this.props.imageHeight }} />
        } else {
            imageComponent = (<Placeholder style={{ 'height': this.props.imageHeight }}>
                <Placeholder.Image square />
            </Placeholder>);
        }

        let progressBar;
        if (this.props.progress) {
            switch (this.props.progress) {
                case 'active':
                    progressBar = (<Progress percent={50} active>Uploading....</Progress>);
                    break;
                case 'complete':
                    progressBar = (<Progress percent={100} success>Completed!</Progress>);
                    break;
                case 'failed':
                    progressBar = (<Progress percent={100} error>Uh oh...looks like there was an error</Progress>);
                    break;
            }
        }

        return (
            <Card fluid centered>
                {imageComponent}
                <Card.Content>
                    <Card.Header>Detect Calories</Card.Header>
                    {progressBar}
                    <div>
                        <form onSubmit={this.props.onPhotoSubmit}>
                            <label htmlFor='myInput'>
                                <input id="myInput" onChange={this.props.onPhotoChange} type="file" />
                            </label>
                            <Button content="Upload Photo" />
                        </form>
                    </div>

                </Card.Content>
            </Card>
        );
    }
}