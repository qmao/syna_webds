import { TestResult } from './test_interface'
import { TestBase } from './test_base'

export class TestDownloadFile extends TestBase {
		
	_file: string;
	_packrat: string;

	constructor(packrat: string, file: string) {
		super();
		this._id = 'DownloadFile' + '_' + packrat + '_' + file;
		this._title = 'Download File'
		this._file = file;
		this._packrat = packrat;
	}
	
	async run() : Promise<TestResult> {
		try {
			
			let url = '/webds/packrat?packrat-id=' + this._packrat + '&filename=' + this._file
			
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
}