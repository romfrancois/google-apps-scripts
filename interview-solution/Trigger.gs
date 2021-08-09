function onOpen() {
	var ui = DocumentApp.getUi();
	// Or DocumentApp or FormApp.
	ui.createMenu('New Action')
		.addItem('Generate Clean PDF', 'generateCleanPDF')
		.addToUi();
}
