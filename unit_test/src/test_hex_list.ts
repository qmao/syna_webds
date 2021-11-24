import { requestAPI } from './handler';
import { TestResult, TestUnit } from './test_interface'

export class TestGetHexList implements TestUnit {

	name: string;
	result: TestResult;

	constructor() {
		this.name = 'Test Get Hex List';
		this.result = { status: 'pending', info: "" };
	}
	
	async run() : Promise<TestResult> {
	
		console.log("get_hex_list:", event);
		try {
			const reply = await requestAPI<any>('packrat?extension=hex', {
				method: 'GET',
			});

			this.result = { status: 'pass', info: reply['filelist'].toString() };
			return Promise.resolve(this.result);

		} catch (error) {
			this.result = { status: 'fail', info: error.message };
			return Promise.resolve(this.result);
		}
	}

	get Name() {
		return this.name;
	}
	
	get Result() {
		return this.result;
	}
	

}
