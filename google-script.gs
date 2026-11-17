/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: BACKEND DATABASE PPDB ONLINE KE GOOGLE SHEETS
 * ==============================================================================
 * Kode ini ditempelkan di Google Sheets:
 * Menu: Ekstensi (Extensions) > Apps Script
 *
 * FITUR:
 * 1. Menerima kiriman form PPDB dari Website secara otomatis (HTTP POST).
 * 2. Membuat header kolom secara otomatis jika sheet masih kosong.
 * 3. Menghasilkan respons JSON dengan status sukses & nomor pendaftaran.
 * 4. Mendukung fitur pencarian status verifikasi (HTTP GET).
 * 5. Aman dari CORS (Cross-Origin Resource Sharing).
 * ==============================================================================
 */

// Nama sheet tempat data disimpan
var SHEET_NAME = "Data_PPDB_2026";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Cegah race condition saat pendaftar bersamaan

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Header tabel jika sheet belum ada
    var headers = [
      "Waktu Pendaftaran",
      "No. Pendaftaran",
      "Jalur Pendaftaran",
      "Pilihan Jurusan/Program",
      "Nama Lengkap Siswa",
      "NISN",
      "NIK",
      "Tempat, Tgl Lahir",
      "Jenis Kelamin",
      "Agama",
      "Alamat Lengkap",
      "Asal Sekolah (SMP/MTs)",
      "Nama Ayah",
      "Pekerjaan Ayah",
      "Nama Ibu",
      "Pekerjaan Ibu",
      "No. WhatsApp Aktif",
      "Penghasilan Orang Tua",
      "Status Verifikasi",
      "Catatan Petugas"
    ];

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Parse data dari permintaan (baik JSON maupun form-encoded)
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    var regNumber = data.registrationNumber || ("PPDB-2026-" + Math.floor(1000 + Math.random() * 9000));
    var defaultStatus = "Menunggu Verifikasi";

    var newRow = [
      timestamp,
      regNumber,
      data.path || "-",
      data.major || "-",
      data.fullName || "-",
      "'" + (data.nisn || "-"), // Beri tanda petik satu agar angka tidak terformat ilmiah
      "'" + (data.nik || "-"),
      (data.birthPlace || "") + ", " + (data.birthDate || ""),
      data.gender || "-",
      data.religion || "-",
      data.address || "-",
      data.schoolOrigin || "-",
      data.fatherName || "-",
      data.fatherJob || "-",
      data.motherName || "-",
      data.motherJob || "-",
      "'" + (data.whatsapp || "-"),
      data.parentIncome || "-",
      defaultStatus,
      "Terdaftar otomatis dari formulir web"
    ];

    sheet.appendRow(newRow);

    var responseOutput = {
      status: "success",
      message: "Data pendaftaran berhasil disimpan ke Google Sheets!",
      registrationNumber: regNumber,
      timestamp: timestamp
    };

    return ContentService.createTextOutput(JSON.stringify(responseOutput))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "empty",
        message: "Belum ada data pendaftaran di sheet."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var query = (e.parameter.query || "").toString().trim().toLowerCase();
    var values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "empty",
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var results = [];
    // Baris 0 adalah Header
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var regNum = String(row[1]).replace(/^'/, '').trim();
      var nisn = String(row[5]).replace(/^'/, '').trim();
      var name = String(row[4]).trim();
      var status = String(row[18]).trim();
      var notes = String(row[19]).trim();
      var major = String(row[3]).trim();
      var path = String(row[2]).trim();

      if (!query || regNum.toLowerCase() === query || nisn.toLowerCase() === query || name.toLowerCase().indexOf(query) !== -1) {
        results.push({
          registrationNumber: regNum,
          fullName: name,
          nisn: nisn,
          path: path,
          major: major,
          status: status,
          notes: notes,
          timestamp: row[0]
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: results.length,
      data: results
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
