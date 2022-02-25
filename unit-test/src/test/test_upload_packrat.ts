import { requestAPI } from './../handler';
import { TestResult } from './test_interface'
import { TestBase } from './test_base'

export interface TestUploadPackratParam {
	packrat: string;
}

export class TestUploadPackrat extends TestBase {
	static id: string = 'UploadPackrat';

	_param: TestUploadPackratParam;
	_done: Boolean;
	_status: string;
	_message: string;

	constructor() {
		super();
		this._title = 'Upload Packrat';
		this._param = { packrat: '' };
		this._done = false;
		this._status = '';
		this._message = '';
	}
	
	async run() : Promise<TestResult> {
		let packrat = this._param.packrat;
		this._done = false;

		const formData = new FormData();
		
		var content = '<a id="a"><b id="b">hey!</b></a>';
		var blob = new Blob([content], { type: "text/xml"});

		formData.append(packrat + ".test", blob, packrat + ".test");


        try {
            const reply = await requestAPI<any>('packrat/' + packrat, {
				body: formData,
				method: 'POST',
			});
            console.log(reply);

			this._state = 'done';
			this._message = reply;
			this._status = 'pass';

			this._result = { status: this._status, info: JSON.stringify(this._message) };
			return Promise.resolve(this._result);

        } catch (e) {
            console.error(
                `Error on POST.\n${e}`
            );

            return Promise.reject({
                status: 'fail',
                info: (e as Error).message
            });
        }
	}

	set param(param: TestUploadPackratParam) {
		this.setParameter(param);
		this._param = param;
	}
	
	static create(): TestBase
	{
		return new TestUploadPackrat();
	}
}