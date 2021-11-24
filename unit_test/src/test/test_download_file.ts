import { TestResult } from './test_interface'
import { TestBase } from './test_base'

export interface TestDownloadFileParam {
	file: string;
	packrat: string;
}

export class TestDownloadFile extends TestBase {
	static id: string = 'DownloadFile';

	_param: TestDownloadFileParam;

	constructor() {
		super();
		this._title = 'Download File ';
		this._param = {file: '', packrat: ''}
	}
	
	async run() : Promise<TestResult> {
		try {
			
			let url = '/webds/packrat?packrat-id=' + this._param.packrat + '&filename=' + this._param.file
			
			console.log(url);

            var myRequest = new Request(url);

            const response = await fetch(myRequest);
			console.log(response);
			
            const blob = await response.blob();
			console.log(blob);

			let text = await blob.text();
			//console.log(text);
			let read_max = 0x100;

			if ( blob.size < read_max )
				read_max = blob.size;

			if ( blob.type == "application/json" ) {
				this._result = { status: 'fail', info: text.substring(0, read_max) };	
			} else {
				this._result = { status: 'pass', info: text.substring(0, read_max) };	
			}

			this._state = 'done';
            return Promise.resolve(this._result);
        } catch (error) {
			this._result = { status: 'fail', info: error.message };
			this._state = 'done';
            return Promise.reject(this._result);
        }
	}
	
	set param(param: TestDownloadFileParam) {
		this._param = param;
		this._title += JSON.stringify(this._param);
	}
	
	static create(): TestBase
	{
		return new TestDownloadFile();
	}
}