import { TestResult, TestUnit } from './test_interface'

export class TestDownloadFile implements TestUnit {
	_title: string;
	_result: TestResult;
	_file: string;
	_state: string;

	constructor(file: string) {
		this._title = 'Test Download File';
		this._result = { status: 'pending', info: "" };
		this._state = 'pending';
		this._file = file;
	}
	
	async run() : Promise<TestResult> {
		try {
            var myRequest = new Request('/webds/packrat?packrat-id=3080091&filename=PR3080091.hex');

            const response = await fetch(myRequest);
			console.log(response);
			
            const blob = await response.blob();
			console.log(blob);

			let text = await blob.text();
			//console.log(text);
			let read_max = 0x100;

			if ( blob.size < read_max )
				read_max = blob.size;

			if ( blob.size > 2 ) { 
				this._result = { status: 'pass', info: text.substring(0, read_max) };
			}
			else
			{
				this._result = { status: 'fail', info: text.substring(0, read_max) };	
			}

			this._state = 'done';
            return Promise.resolve(this._result);
        } catch (error) {
			this._result = { status: 'fail', info: error.message };
			this._state = 'done';
            return Promise.reject(this._result);
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
