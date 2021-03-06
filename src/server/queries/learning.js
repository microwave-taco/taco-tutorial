var db = require('./connection');

var helpers = require('./queryHelpers');
var respondWithData = helpers.respondWithData;
var catchError = helpers.catchError;
var postData = helpers.postData;

function getLearning(req, res, next){
  db.any('select * from learning')
    .then(respondWithData(res, "Retrieved the users to subjects learning table"))
    .catch(catchError(next))
}

function learningSubject(req, res, next){
  db.none('insert into learning(userID, subjectID)' + 'values(${userID}, ${subjectID})', req.body)
    .then(postData(res, `User with id of ${req.body.userID} is now learning subject ${req.body.subjectID}`))
    .catch(catchError(next));
};

function findSubjectsByUser(req, res, next){
    var userID = req.params.id;
  db.any('select users.name, learning.subjectID, learning.progress, learning.userID, subjects.name from users inner join learning on users.id = learning.userID inner join subjects on learning.subjectID = subjects.id WHERE users.authid = $1', [userID])
    .then(respondWithData(res, `Retrieved all subjects that ${req.body.name} wants to learn`))
    .catch(catchError(next));
};

function removeSubjectByUser(req, res, next){
  var userID = req.params.userID;
  var subjectID = parseInt(req.params.subjectID);
  db.result('DELETE FROM learning AS l USING users AS u WHERE l.userID = u.id AND u.authID = $1 AND l.subjectID = $2' , [userID, subjectID])
    .then(postData(res, `Removed ${res.rowCount} row's`))
    .catch(catchError(next));
};

function levelUp(req, res, next) {
 db.any('UPDATE learning SET progress = progress + 10 WHERE userid = ${userID} AND subjectid = ${subjectID}', req.body)
      .then(respondWithData(res, "Added 10"))
      .catch(catchError)
};

module.exports = {
  getLearning: getLearning,
  learningSubject: learningSubject,
  findSubjectsByUser: findSubjectsByUser,
  removeSubjectByUser: removeSubjectByUser,
  levelUp: levelUp
};
