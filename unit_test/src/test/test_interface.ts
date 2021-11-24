export interface Item {
	title: string;
	function: () => Promise<TestResult | undefined>;
	result: TestResult;
}

export interface TestResult {
	status: string;
	info: string;
}


export interface TestUnit {
	run: () => Promise<TestResult>;
	title: string;
	result: TestResult;
	state: string;
	id: string;
}