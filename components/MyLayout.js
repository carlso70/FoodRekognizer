import Header from './Header';
import Head from "next/head";
import '../styles/styling.css'

const Layout = (props) => (
    <div>
        <Head>
            <link
                rel="stylesheet"
                href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
            />
        </Head>
        <Header />
        {props.children}
    </div>
)

export default Layout