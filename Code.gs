/**
* @OnlyCurrentDoc
**/

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Start', 'showSidebar')
    .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Page.html')
    .setTitle('Document Classification');
  DocumentApp.getUi().showSidebar(html);
}

function classifyCurrentDocument(sensitivityLevel, complianceTags, customerDataTags) {
  if (!sensitivityLevel) {
    throw new Error('Invalid sensitivity level. Please select a level.');
  }

  const doc = DocumentApp.getActiveDocument();
  if (!doc) {
    throw new Error('Unable to access the active document.');
  }

  const properties = PropertiesService.getDocumentProperties();

  if (properties) {
    properties.setProperty('sensitivityLevel', sensitivityLevel);
    properties.setProperty('complianceTags', complianceTags.join(','));
    properties.setProperty('customerDataTags', customerDataTags.join(','));

    try {
      updateDocumentWithClassificationInfo(doc, sensitivityLevel, complianceTags, customerDataTags);
      integrateWithDLPSystem(sensitivityLevel, complianceTags, customerDataTags); // Placeholder for DLP integration
    } catch (error) {
      console.error('Error updating document: ' + error.message);
    }
  } else {
    console.error('Document properties could not be retrieved.');
  }
}

function updateDocumentWithClassificationInfo(doc, sensitivityLevel, complianceTags, customerDataTags) {
  const header = doc.getHeader() || doc.addHeader();
  const footer = doc.getFooter() || doc.addFooter();

  // Update header and footer with classification info
  header.clear();
  header.appendParagraph('Classification: ' + sensitivityLevel)
    .setHeading(DocumentApp.ParagraphHeading.HEADING1);

  footer.clear();
  footer.appendParagraph('Compliance: ' + complianceTags.join(', ') + '\nCustomer Data: ' + customerDataTags.join(', '))
    .setHeading(DocumentApp.ParagraphHeading.NORMAL);
}

function integrateWithDLPSystem(sensitivityLevel, complianceTags, customerDataTags) {
  // Placeholder for DLP system integration
  // This could involve API calls or other integration logic
}

// Additional utility functions can be added here
