import { requestAPI } from './../handler';
import { TestResult } from './test_interface'
import { TestBase } from './test_base'

export interface TestProgramParam {
	packrat: string;
}

export class TestProgram extends TestBase {
	static id: string = 'Program';

	_param: TestProgramParam;
	_done: Boolean;
	_status: string;
	_message: string;

	constructor() {
		super();
		this._title = 'Program';
		this._param = { packrat: '' };
		this._done = false;
		this._status = '';
		this._message = '';

	}
	
	eventHandler(event: any) {
        let obj = JSON.parse(event.data);
        console.log(obj)

        if (obj.progress) {
			console.log(obj.progress)
        }
        if (obj.status && obj.message) {
			console.log(obj.status)
            console.log(obj.message)
			this._status = obj.status;
			this._message = obj.message;
			this._done = true;
        }
    }
	
	async run() : Promise<TestResult> {
		this._done = false;

		const file_name = this._param.packrat + '/PR' + this._param.packrat + '.hex';
        const action = "start";
        const dataToSend = {
            filename: file_name,
            action: action
        };

        console.log("filename:", file_name);

        try {
			let source = new window.EventSource('/webds/program');

			console.log(source);
			if (source != null) {
				source.addEventListener('program', event => {this.eventHandler(event)}, false);
			} else {
				console.log("event source is null");
			}
	   
            const reply = await requestAPI<any>('program', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);


			while (!this._done)
			{
				await new Promise(f => setTimeout(f, 1000));
				console.log(this._done);
			}

			if (source != undefined && source.addEventListener != null) {
                source.removeEventListener('program', event => {this.eventHandler(event)}, false);
                source.close();
                console.log("close event source");
            }

			this._state = 'done';

			if (this._status == 'success')
				this._status = 'pass'
			else
				this._status = 'fail'
			this._result = { status: this._status, info: JSON.stringify(this._message) };
			return Promise.resolve(this._result);

        } catch (e) {
            console.error(
                `Error on POST ${dataToSend}.\n${e}`
            );

            return Promise.reject({
                status: 'fail',
                info: (e as Error).message
            });
        }
	}

	set param(param: TestProgramParam) {
		this._param = param;
		this._title += JSON.stringify(this._param);
	}
	
	static create(): TestBase
	{
		return new TestProgram();
	}
}