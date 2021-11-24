import { /*TestResult,*/ TestUnit } from './test/test_interface'

import { TestGetHexList } from './test/test_hex_list'
import { TestDownloadFile } from './test/test_download_file';


export class TestManager {

	_list: TestUnit[];
	
	constructor() {
		this._list = [
                new TestGetHexList('hex'),
                new TestDownloadFile("3080091", "PR3080091.hex"),
				new TestDownloadFile("1234567", "PR1234567.hex")
            ];
	}
	
	get list() {
		return this._list;
	}
	
	getTest(id: string) {
		this._list.map((element) => {
			if (element.id == id)
                return element;
        });
		return null;
	}
}