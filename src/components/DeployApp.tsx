import { Component } from 'react';
import { APP_ID } from '../constant';
import { clearLocalStorage, storeInLocalStorage } from '../utility';

// const approval_program = require('../teal/counter/approval_program.txt');
// const clear_program = require('../teal/counter/clear_program.txt');
// const approval_program = require('../teal/auction-demo/auction/auction_approval.teal');
// const clear_program = require('../teal/auction-demo/auction/auction_clear_state.teal');
const approval_program = require('../teal/vote/ss_approval.teal');
const clear_program = require('../teal/vote/ss_clear_state.teal');
const { AlgoDeploy } = require('pipeline-ui');

interface DeployState {
	program: string;
	clearProgram: string;
	appArgs: [];
	bytesInts: Array<number>;
	appIndex?: number;
}

class Deploy extends Component<{}, DeployState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			program: '',
			clearProgram: '',
			appArgs: [],
			bytesInts: [1, 1, 1, 1],
			appIndex: undefined,
		};
	}

	getContract = async () => {
		let approval_program_data = await fetch(approval_program);
		this.setState({ program: await approval_program_data.text() });
		let clear_program_data = await fetch(clear_program);
		this.setState({ clearProgram: await clear_program_data.text() });
	};

	componentDidMount() {
		this.getContract();
	}

	handleChange = (value: number) => {
		// clear previous app id before storing new one
		clearLocalStorage();
		storeInLocalStorage(APP_ID, value);
		console.log(APP_ID);
	};

	render() {
		return (
			<>
				<AlgoDeploy
					tealProgram={this.state.program}
					tealClear={this.state.clearProgram}
					bytesInts={this.state.bytesInts}
					appArgs={this.state.appArgs}
					onChange={this.handleChange}
				/>
				<br />
			</>
		);
	}
}

export default Deploy;
