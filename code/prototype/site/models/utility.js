var passwordHash = function ( password , salt ){
    var md5 = crypto.createHash('md5');
    return md5.update(salt+"."+password+"."+salt).digest('base64');
}
module.exports = {
    passwordHash : passwordHash
};
