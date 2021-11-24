import { requestAPI } from './../handler';
import { TestResult } from './test_interface'
import { TestBase } from './test_base'

export class TestGetHexList extends TestBase {
		
	constructor() {
		super();
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
}
