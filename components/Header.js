import Link from 'next/link'
import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class Header extends Component {
    state = {}

    handleClick = (name) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state

        return (
            <Menu>
                <Link href="/" >
                <Menu.Item header>Food Rekognizer</Menu.Item>
                </Link>
                <Link href="/about" >
                    <Menu.Item
                        name='About'
                        active={activeItem === 'About'}
                        onClick={() => this.handleClick('About')}
                    />
                </Link>
            </Menu>
        )
    }
};