import { TestResult, TestUnit } from './test_interface'

export class TestDownloadFile implements TestUnit {

	name: string;
	result: TestResult;
	
	file: string;

	constructor(file: string) {
		this.name = 'Test Download File';
		this.result = { status: 'pending', info: "" };
		this.file = file;
	}
	
	async run() : Promise<TestResult> {
		try {
            var myRequest = new Request('/webds/packrat?packrat-id=3080091&filename=PR3080091.hex');

            const response = await fetch(myRequest);
            const blob = await response.blob();

			this.result = { status: 'pass', info: "File Size: " + blob.size.toString() };
            return Promise.resolve(this.result);
        } catch (error) {
            console.log("error!!!", error.message);
			this.result = { status: 'fail', info: error.message };
            return Promise.reject(this.result);
        }
	}

	get Name() {
		return this.name;
	}
	
	get Result() {
		return this.result;
	}
	

}
