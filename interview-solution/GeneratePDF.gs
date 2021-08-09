function generateCleanPDF() {
	const documentId = 'PUT HERE THE ID OF YOUR GOOGLE DOC';

	const templateFile = DriveApp.getFileById(documentId);
	const tempDoc = templateFile.makeCopy('Interview - Questionnaire');
	const tempDocId = tempDoc.getId();

	findAndRemoveAllSolutions(tempDocId);

	DocumentApp.openById(tempDocId).saveAndClose()
	const pdfFileName = gdocToPDF(tempDocId);

	tempDoc.setTrashed(true);

	const pdfURL = DriveApp.getFileById(pdfFileName.getId()).getUrl();

	const htmlOutput = HtmlService
		.createHtmlOutput(`<a href='${pdfURL}' target="_blank">Download the questionnaire</a>`)
		.setWidth(250)
		.setHeight(40);

	DocumentApp.getUi()
		.showModalDialog(htmlOutput, 'Generated pdf file');
}

function gdocToPDF(fileID) {
	const folderID = 'PUT HERE THE ID OF THE FOLDER CONTAINING YOUR GOOGLE DOC';

	const pdfFolder = DriveApp.getFolderById(folderID);         // replace this with the ID of the folder that the PDFs should be put in. 

	const docFile = DriveApp.getFileById(fileID)

	return createPDF(docFile.getId(), pdfFolder.getId(), function (fileID, folderID) {
		if (fileID) {
			return createPDFfile(fileID, folderID);
		}
	}
	)
}

function createPDF(fileID, folderID, callback) {
	const templateFile = DriveApp.getFileById(fileID);
	const templateName = templateFile.getName();

	const existingPDFs = DriveApp.getFolderById(folderID).getFiles();

	//in case no files exist
	if (!existingPDFs.hasNext()) {
		return callback(fileID, folderID);
	}

	for (; existingPDFs.hasNext();) {

		const existingPDFfile = existingPDFs.next();
		const existingPDFfileName = existingPDFfile.getName();

		if (existingPDFfileName == templateName + ".pdf") {
			Logger.log("PDF exists already. A new one is created!")
			return callback(fileID, folderID)
		}
		if (!existingPDFs.hasNext()) {
			Logger.log("PDF is created")
			return callback(fileID, folderID)
		}
	}
}

function createPDFfile(fileID, folderID) {
	const templateFile = DriveApp.getFileById(fileID);
	const folder = DriveApp.getFolderById(folderID);
	const theBlob = templateFile.getBlob().getAs('application/pdf');
	let newPDFFile = folder.createFile(theBlob);

	const fileName = templateFile.getName().replace(".", ""); //otherwise filename will be shortened after full stop    
	newPDFFile.setName(fileName + ".pdf");

	return newPDFFile;
}