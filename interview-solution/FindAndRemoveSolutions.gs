function findAndRemoveAllSolutions(documentId) {
	const startTag = '{solution}';
	const endTag = '{end}';

	const body = DocumentApp.openById(documentId).getBody();

	let toRemove = [];

	let para = body.getParagraphs();
	for (let i in para) {
		const from = para[i].findText(startTag);

		if (from !== null) {
			for (let j = parseInt(i) + 1; j <= para.length; j++) {
				const to = para[j].findText(endTag, from);

				if (to !== null) {
					for (let k = parseInt(i); k <= parseInt(j); k++) {
						toRemove.push(para[k]);
					}

					break;
				}
			}
		}
	}

	toRemove.forEach((para) => para.removeFromParent());
}