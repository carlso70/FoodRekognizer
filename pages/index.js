import Layout from '../components/MyLayout';
import Link from 'next/link';
import { Button } from "semantic-ui-react";

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
        </ul>
    </Layout>
);

export default Index;