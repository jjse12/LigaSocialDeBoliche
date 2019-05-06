import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getUser } from "../reducers/user";
import routes from './routes';

@connect(
    null, { getUser }
)
export default class Main extends Component {
    static propTypes = {
        auth: PropTypes.bool.isRequired,
        getUser: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            authChecked: !props.auth
        }
    }

    componentWillMount() {
        if (this.props.auth){
            this.props.getUser()
                .then(() => {
                    this.setState({authChecked: true})
                });
        }
    }

    render(){
        if (!this.state.authChecked)
            return null;

        return <div>
            {routes}
        </div>;
    }
}
