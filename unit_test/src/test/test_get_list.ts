import { requestAPI } from './../handler';
import { TestResult } from './test_interface'
import { TestBase } from './test_base'

export interface TestGetListParam {
	extension: string;
}

export class TestGetList extends TestBase {
	
	static id: string = 'GetList';
		
	_param: TestGetListParam;
	
	constructor() {
		super();
		this._title = 'Get List ';
		this._param = { extension: '' }
	}
	
	async run() : Promise<TestResult> {
		try {
			let url = 'packrat?extension=' + this._param.extension;
			
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
	
	set param(param: TestGetListParam) {
		this._param = param;
		this._title += JSON.stringify(this._param);
	}
	
	static create(): TestBase
	{
		return new TestGetList();
	}
}
