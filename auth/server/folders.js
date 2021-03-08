var fileMetadata = {
    'name': 'JavaScript',
    'mimeType': 'application/vnd.google-apps.folder'
};

drive.files.create({
    resource: fileMetadata,
    fields: 'id'
    }, function (err, file) {
    if (err) {
      // Handle error
        console.error(err);
    } else {
        console.log('Folder Id: ', file.id, ' Folder Name:', file.name);
    }
});
