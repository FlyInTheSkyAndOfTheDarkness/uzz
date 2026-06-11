/**
 * Қыз ұзату — анкета приёмник для Google-таблицы
 * Вставьте этот код в Apps Script вашей таблицы.
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    // Заголовки (только один раз)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Есімі', 'Келу', 'Қонақ саны']);
    }

    var d = e.parameter;
    sheet.appendRow([
      d.name || '',
      d.attending || '',
      d.guests || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
