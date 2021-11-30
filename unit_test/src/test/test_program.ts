import { requestAPI } from './../handler';
import { TestResult } from './test_interface'
import { TestBase } from './test_base'

export interface TestProgramParam {
	packrat: string;
}

export class TestProgram extends TestBase {
	static id: string = 'Program';

	_param: TestProgramParam;

	constructor() {
		super();
		this._title = 'Program';
		this._param = { packrat: '' };
	}
	
	async run() : Promise<TestResult> {
		const file_name = this._param.packrat + '/PR' + this._param.packrat + '.hex';
        const action = "start";
        const dataToSend = {
            filename: file_name,
            action: action
        };

        console.log("filename:", file_name);

        try {

       
            const reply = await requestAPI<any>('program', {
                body: JSON.stringify(dataToSend),
                method: 'POST',
            });
            console.log(reply);

            await new Promise(f => setTimeout(f, 5000));

            return Promise.resolve({
                status: 'pass',
                info: reply
            });

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