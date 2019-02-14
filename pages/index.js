import Layout from '../components/MyLayout';
import Link from 'next/link';
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    List,
    Menu,
    Segment,
    Visibility
  } from "semantic-ui-react";

const PostLink = (props) => (
    <li>
        <Link href={`/post?title=${props.title}`}>
            <a>{props.title}</a>
        </Link>
    </li>
);

const Index = () => (
    <Layout>
        <h1>My blog</h1>
        <ul>
            <Button>Follow</Button>
            <PostLink title="Hello next.js" />
            <PostLink title="Learn next.js" />
            <PostLink title="Test next.js" />
            <PostLink title="hiya next.js" />
        </ul>
    </Layout>
);

export default Index;