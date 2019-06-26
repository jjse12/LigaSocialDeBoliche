import React, {Component} from 'react';
import { bool, func } from "prop-types";
import { connect } from "react-redux";
import { getUser } from "../reducers/user";
import routes from './routes';

@connect(
    null, { getUser }
)
export default class Main extends Component {
    static propTypes = {
        auth: bool.isRequired,
        getUser: func
    };

    constructor(props) {
        super(props);
        this.state = {
            authChecked: !props.auth
        }
    }

    componentWillMount = async() => {
        if (this.props.auth){
            await this.props.getUser();
            this.setState({authChecked: true});
        }
    };

    render(){
        if (!this.state.authChecked)
            return null;

        return <div>
            {routes}
        </div>;
    }
}
