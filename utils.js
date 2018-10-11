var helper = require('sendgrid').mail;


function currentSchoolYear() {
  var today = new Date();
  var month = today.getMonth() + 1;
  var startYear = today.getFullYear();
  
  if (month < 8) {
    startYear = startYear - 1;
  }
 
  return [startYear, startYear + 1];
}

function sendgridTokenDelivery(url, sg, sender) {
  return function(tokenToSend, uidToSend, recipient, callback) {
    var loginUrl = url + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend);
    var senderEmail = new helper.Email(sender);
    var rcptEmail = new helper.Email(recipient);
    var subject = "Your login link";
    var content = new helper.Content("text/plain", "Access your account here: " + loginUrl);
    var mail = new helper.Mail(senderEmail, subject, rcptEmail, content);

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, function(err, response) {
      callback(err);
    });
  };
}

module.exports = {
  currentSchoolYear: currentSchoolYear,
  sendgridTokenDelivery: sendgridTokenDelivery
};
