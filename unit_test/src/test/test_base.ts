import { TestResult, TestUnit } from './test_interface'

export class TestBase implements TestUnit {

	_id: string;
	_title: string;
	_state: string;
	_result: TestResult;
		
	constructor() {
		this._id = 'Unknown';
		this._title = 'Test Get Hex List';
		this._result = { status: 'pending', info: "" };
		this._state = 'pending';
	}
	
	async run() : Promise<TestResult> {
		this._state = 'done';
		this._result = { status: 'fail', info: '' };
		return Promise.resolve(this._result);
	}

	get id() {
		return this._id;
	}
	
	get title() {
		return this._title;
	}
	
	get result() {
		return this._result;
	}
	
	get state() {
		return this._state;
	}
	
	set state(s: string ) {
		this._state = s;
	}
}
