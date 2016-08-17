var db = require('./connection');

var helpers = require('./queryHelpers');
var respondWithData = helpers.respondWithData;
var catchError = helpers.catchError;

function requestInstantSession(req, res, next) {
  var studentID = req.body.studentID;
  var teacherID = req.body.teacherID;
  var subjectID = req.body.subjectID;

  db.one(`INSERT INTO instantSessionRequests
      (studentAuthID, teacherAuthID, subjectID)
      VALUES ($1, $2, $3) RETURNING *`, [studentID, teacherID, subjectID] )
    .then(respondWithData(res, 'Added live session request'))
    .catch(catchError(next));
}

function getStudentRequests(req, res, next) {
  var authID = req.params.authID;

  db.any(`SELECT * FROM instantSessionRequests AS i
      INNER JOIN subjects AS s ON i.subjectID = s.id
      WHERE i.studentAuthId=$1`, [authID])
    .then(respondWithData(res, 'Found student\'s instant session requests'))
    .catch(catchError(next));
}

function getTeacherRequests(req, res, next) {
  var authID = req.params.authID;

  db.any(`SELECT * FROM instantSessionRequests AS i
      INNER JOIN subjects AS s ON i.subjectID = s.id
      WHERE i.teacherAuthId=$1`, [authID])
    .then(respondWithData(res, 'Found teacher\'s instant session requests'))
    .catch(catchError(next));
}

// cancel one request identified by `req.body`
function cancelStudentRequest(req, res, next) {
  var studentID = req.body.studentID;
  var teacherID = req.body.teacherID;
  var subjectID = req.body.subjectID;

  db.any(`DELETE FROM instantSessionRequests AS i
      WHERE i.studentAuthID=$1 AND i.teacherAuthID=$2 AND i.subjectID=$3
      RETURNING *`, [studentID, teacherID, subjectID])
    .then(respondWithData(res, 'Cancelled instant session request'))
    .catch(catchError(next));
}

// cancel all requests for a student identified by `req.params.authID`
function cancelStudentRequests(req, res, next) {
  var studentID = req.params.authID;

  db.any(`DELETE FROM instantSessionRequests AS i
      WHERE i.studentAuthID=$1 RETURNING *`, [studentID])
    .then(respondWithData(res, 'Cancelled student\'s session requests'))
    .catch(catchError(next));
}

module.exports = {
  requestInstantSession: requestInstantSession,
  getStudentRequests: getStudentRequests,
  getTeacherRequests: getTeacherRequests,
  cancelStudentRequest: cancelStudentRequest,
  cancelStudentRequests: cancelStudentRequests
};