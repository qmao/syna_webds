import { requestAPI } from './handler';
import { TestResult, TestUnit } from './test_interface'

export class TestGetHexList implements TestUnit {

	_title: string;
	_result: TestResult;
	_state: string;
		
	constructor() {
		this._title = 'Test Get Hex List';
		this._result = { status: 'pending', info: "" };
		this._state = 'pending';
	}
	
	async run() : Promise<TestResult> {
		try {
			const reply = await requestAPI<any>('packrat?extension=hex', {
				method: 'GET',
			});

			this._state = 'done';
			this._result = { status: 'pass', info: reply['filelist'].toString() };
			return Promise.resolve(this._result);

		} catch (error) {
			this._state = 'done';
			this._result = { status: 'fail', info: error.message };
			return Promise.resolve(this._result);
		}
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
