var formidable = require('formidable'),
    http = require('http'),
    util = require('util');
var fs = require('fs');

http.createServer(function(req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

            console.log(files);
            console.log(err);
            console.log(fields);
            fs.rename(files.upload.path, "test.jpg", function(err) {
                if (err) {
                    fs.unlink("test.jpg");
                    fs.rename(files.upload.path, "test.jpg");
                }
            });

            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));
        });

        return;
    }

    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
}).listen(8080);