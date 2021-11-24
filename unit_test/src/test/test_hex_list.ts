import { requestAPI } from './../handler';
import { TestResult } from './test_interface'
import { TestBase } from './test_base'

export class TestGetHexList extends TestBase {
	
	_extension: string;
	
	constructor(extension: string) {
		super();
		this._id = 'GetList' + '_' + extension;
		this._title = 'Test Get Hex List';
		this._extension = extension
	}
	
	async run() : Promise<TestResult> {
		try {
			let url = 'packrat?extension=' + this._extension;
			
			const reply = await requestAPI<any>(url, {
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
