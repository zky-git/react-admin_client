var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var path = require('path');
var formidable = require('formidable');
const fs = require('fs');
var Product = require('../config/product.js');
var upload = require('jquery-file-upload-middleware');

var app = express();
router.get('/',function (req, res, next) {
    var pageSize = parseInt(req.query.pageSize);
    var page = req.query.page;
    var searchStr = req.query.searchStr;
    var searchType = req.query.searchType;
    searchType == 0 ? searchType='name' : searchType='desc';
    if(searchStr){
        Product.paginate({[searchType]: {$regex:searchStr}},{page: page, limit: pageSize}, function(err, result){
            if(err) return console.error(err);
            res.send({data:result,status:1,msg:'查询成功'})
        })
    }else{
        Product.paginate({},{page: page, limit: pageSize}, function(err, result){
            if(err) return console.error(err);
            res.send({data:result,status:1,msg:'查询成功'})
        })
    }
    
    
})
router.post('/updateProduct', function (req, res, next) { 
    var where = {_id: ObjectID(req.body._id)}
    var set = {
        $set: {...req.body.values}
    }
    Product.update(where, set, function(err){
        if(err) return console.error(err);
        res.send({data:[],status:1,msg:'更新成功'})
    })
})
router.post('/addproduct',function (req, res, next) { 
    var product = new Product(req.body.values)
    product.save(function(err){
        if(err) return console.error(err);
        res.send({data:[],status:1,msg:'插入成功'})
    })
})

// upload.configure({
//     uploadDir: __dirname + '/public/uploads/',
//     uploadUrl: '/uploads'
// });

// router.post('/uploads', function(req, res, next){
//     upload.fileHandler({
//         uploadDir: function () {
//             return path.join(__dirname, '../public/uploads/');
//         },
//         uploadUrl: function () {
//             return '/uploads'
//         }
//     })(req, res, next);
// });

router.post('/uploads', function(req, res, next){
    
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8'; // 编码
    // 保留扩展名
    form.keepExtensions = true;
    //文件存储路径 最后要注意加 '/' 否则会被存在public下
    form.uploadDir = path.join(__dirname, '../public/uploads/');
    // 解析 formData 数据
    form.parse(req, (err, fields ,files) => {
        if(err) return next(err);
        console.log(files)
        var file = files.productImg.name;
        var path = '/public/uploads' + files.productImg.name;
        res.send({data:{name: file, path: path}, status: 1, message: '上传成功'})
    })
});
  

module.exports = router;

