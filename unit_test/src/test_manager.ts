import { /*TestResult,*/ TestUnit } from './test/test_interface'

import { TestGetList } from './test/test_get_list'
import { TestDownloadFile } from './test/test_download_file';
import { TestProgram } from './test/test_program';
import { TestBase } from './test/test_base';


interface test_descriptor
{
	title: string,
	parameter: any
}

export class TestManager {

	_list: TestUnit[];
	_class_list: typeof TestBase[];
	
	constructor() {
		console.log("CONSTRUCTOR IS CALLED?");
		
		this._list = [];
		
		// TBC: auto detection
		this._class_list = [];
		this._class_list.push(TestGetList);
		this._class_list.push(TestDownloadFile);
		this._class_list.push(TestProgram);


		// TBC: load from config file
		let run_test: test_descriptor[] = [
			{ title: 'GetList', parameter: { extension: 'hex' }},
			{ title: 'GetList', parameter: { extension: 'img' }},
			{ title: 'DownloadFile', parameter: { packrat: "3080091", file: "PR3080091.hex" }},
			{ title: 'DownloadFile', parameter: { packrat: "1234567", file: "PR1234567.hex" }},
			{ title: 'Program', parameter: { packrat: "3080091" }}
		]

		// create test instance with own parameter
		run_test.map((go) => {
			this._class_list.map((element) => {
				
				if (go.title == element.id)
				{
					console.log("FOUND!!!!!!");
					console.log(element.id);
					let test = element.create();
					test.param = go.parameter;
					this._list.push(test);
				}
			});
		
		});
	}
	
	get list() {
		return this._list;
	}
}