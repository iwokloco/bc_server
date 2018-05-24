function addToCollection(req, res){
  res.json({originalUrl: req.originalUrl, length:collections.length});
}
exports.addToCollection = addToCollection;
