function classifyCurrentDocument(sensitivityLevel, complianceTags, customerDataTags) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();

  // Add Sensitivity Level
  body.appendParagraph('Sensitivity Level: ' + sensitivityLevel)
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);

  // Add Compliance Tags
  if (complianceTags.length > 0) {
    body.appendParagraph('Compliance Tags: ' + complianceTags.join(', '))
        .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  }

  // Add Customer Data Tags
  if (customerDataTags.length > 0) {
    body.appendParagraph('Customer Data: ' + customerDataTags.join(', '))
        .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  }
}

