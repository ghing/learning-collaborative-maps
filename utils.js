function currentSchoolYear() {
  var today = new Date();
  var month = today.getMonth() + 1;
  var startYear = today.getFullYear();
  
  if (month < 8) {
    startYear = startYear - 1;
  }
 
  return [startYear, startYear + 1];
}

function sendgridTokenDelivery(url, sgMail, sender) {
  return function(tokenToSend, uidToSend, recipient, callback) {
    var loginUrl = url + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend);
    var msg = {
      to: recipient,
      from: sender,
      subject: "Your login link",
      text: "Access your account here: " + loginUrl
    };
    sgMail
      .send(msg)
      .then(function() {
        callback(); 
      })
      .catch(function(err) {
        callback(err);
      });
  };
}

module.exports = {
  currentSchoolYear: currentSchoolYear,
  sendgridTokenDelivery: sendgridTokenDelivery
};
